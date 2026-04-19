import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";
const ANTHROPIC_VERSION = "2023-06-01";
const SYSTEM_PROMPT =
  "You are a tool curator for Niubility, a Web3 and AI tools aggregator. Generate a tool listing based on the tool name provided. Use your knowledge about this tool to fill in accurate details. If you are not confident about a field, make a reasonable inference. Return ONLY valid JSON, no markdown, no explanation.";

const LOG = "[import-tool]";

type GeneratedTool = {
  name: string;
  name_zh: string;
  description: string;
  description_zh: string;
  best_for: string;
  best_for_zh: string;
  pricing: string;
  tags: string[];
  category_slug: string;
  subcategory_slug: string;
  website_url: string;
};

function err(status: number, message: string, detail?: string) {
  return NextResponse.json(
    detail ? { error: message, detail } : { error: message },
    { status },
  );
}

function extractJson(text: string): GeneratedTool | null {
  const direct = safeParse(text);
  if (direct) return direct;
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    const cleaned = safeParse(fence[1]);
    if (cleaned) return cleaned;
  }
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return safeParse(text.slice(first, last + 1));
  }
  return null;
}

function safeParse(raw: string): GeneratedTool | null {
  try {
    const parsed = JSON.parse(raw.trim());
    if (parsed && typeof parsed === "object") return parsed as GeneratedTool;
  } catch {
    /* ignore */
  }
  return null;
}

async function findDuplicate(
  url: string,
): Promise<{ id: string; name: string } | null> {
  const svc = createServiceClient();
  if (!svc) {
    console.warn(
      `${LOG} service client unavailable — skipping duplicate check`,
    );
    return null;
  }
  const { data, error } = await svc
    .from("tools")
    .select("id, name")
    .eq("website_url", url)
    .maybeSingle();
  if (error) {
    console.warn(`${LOG} duplicate lookup error:`, error.message);
    return null;
  }
  if (!data) return null;
  return { id: data.id as string, name: data.name as string };
}

export async function POST(req: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

    const authHeader = req.headers.get("authorization") ?? "";
    const bearerOk =
      adminPassword !== undefined &&
      adminPassword !== "" &&
      authHeader === `Bearer ${adminPassword}`;
    const cookieOk = req.cookies.get("admin_auth")?.value === "true";
    if (!bearerOk && !cookieOk) {
      console.warn(`${LOG} 401 — no valid bearer or admin cookie`);
      return err(401, "Unauthorized");
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch (e) {
      console.warn(`${LOG} 400 — invalid JSON body`, e);
      return err(400, "Invalid JSON body");
    }

    const checkOnly = Boolean((body as { checkOnly?: unknown })?.checkOnly);
    const name = (body as { name?: unknown })?.name;
    const url = (body as { url?: unknown })?.url;

    if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      return err(400, "Body must include a valid http(s) url");
    }
    const trimmedUrl = url.trim();

    // ---- Duplicate detection — runs for BOTH checkOnly and full flow ----
    const existing = await findDuplicate(trimmedUrl);
    if (existing) {
      console.log(
        `${LOG} 409 — duplicate url=${trimmedUrl} existing="${existing.name}"`,
      );
      return NextResponse.json(
        {
          error: "duplicate",
          message: "Already exists",
          existing_name: existing.name,
        },
        { status: 409 },
      );
    }

    if (checkOnly) {
      console.log(`${LOG} 200 — checkOnly pass, no duplicate for ${trimmedUrl}`);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // ---- Full generation path requires name + ANTHROPIC_API_KEY ----
    if (typeof name !== "string" || name.trim().length === 0) {
      return err(400, "Body must include a non-empty name");
    }
    if (!apiKey) {
      console.error(`${LOG} 500 — ANTHROPIC_API_KEY missing from environment`);
      return err(500, "ANTHROPIC_API_KEY is not configured on the server");
    }
    const trimmedName = name.trim();

    const userPrompt = `Tool name: ${trimmedName}
Official URL: ${trimmedUrl}

Return ONLY this JSON structure:
{
  "name": "Tool name in English",
  "name_zh": "工具中文名称",
  "description": "One paragraph description in English, max 150 chars",
  "description_zh": "中文描述，最多150字",
  "best_for": "Who this tool is best for, max 80 chars",
  "best_for_zh": "最适合谁使用，最多80字",
  "pricing": "Free | Freemium | Paid | Enterprise",
  "tags": ["tag1", "tag2", "tag3"],
  "category_slug": "ai | research-insights | security | wallets-browsers | jobs | media-community",
  "subcategory_slug": "suggest based on category",
  "website_url": "${trimmedUrl}"
}`;

    const requestBody = {
      model: MODEL,
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    };

    console.log(
      `${LOG} calling Anthropic — endpoint=${ANTHROPIC_URL} model=${MODEL}`,
    );

    let aiText = "";
    try {
      const aiRes = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify(requestBody),
      });

      console.log(
        `${LOG} Anthropic response status=${aiRes.status} ${aiRes.statusText}`,
      );

      if (!aiRes.ok) {
        const rawText = await aiRes.text();
        console.error(`${LOG} Anthropic error body:`, rawText.slice(0, 2000));
        let detail: string | undefined;
        try {
          const parsed = JSON.parse(rawText) as {
            error?: { type?: string; message?: string };
          };
          if (parsed?.error?.message) {
            detail = `${parsed.error.type ?? "error"}: ${parsed.error.message}`;
          }
        } catch {
          detail = rawText.slice(0, 500);
        }
        return err(
          500,
          "AI generation failed",
          detail ?? `upstream status ${aiRes.status}`,
        );
      }

      const aiJson = (await aiRes.json()) as {
        content?: Array<{ type?: string; text?: string }>;
      };
      aiText = (aiJson.content ?? [])
        .filter((c) => c.type === "text" && typeof c.text === "string")
        .map((c) => c.text as string)
        .join("\n")
        .trim();
      if (!aiText) {
        console.error(`${LOG} Anthropic returned empty content`, aiJson);
        return err(500, "AI generation failed", "empty content in response");
      }
    } catch (e) {
      const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
      console.error(`${LOG} Anthropic fetch threw:`, msg, e);
      return err(500, "AI generation failed", msg);
    }

    const parsed = extractJson(aiText);
    if (!parsed) {
      console.error(
        `${LOG} 422 — could not extract JSON from AI text:`,
        aiText.slice(0, 500),
      );
      return err(422, "Could not parse AI response");
    }

    parsed.website_url = trimmedUrl;

    console.log(`${LOG} 200 — generated tool "${parsed.name}"`);
    return NextResponse.json(parsed, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.error(`${LOG} unexpected server error:`, msg, e);
    return err(500, "Unexpected server error", msg);
  }
}
