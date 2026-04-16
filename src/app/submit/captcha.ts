import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const TTL_MS = 1000 * 60 * 30;

export type CaptchaChallenge = {
  a: number;
  b: number;
  token: string;
};

function secret(): string {
  return (
    process.env.SUBMIT_CAPTCHA_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "niubility-dev-captcha-insecure-change-me"
  );
}

export function createCaptchaChallenge(): CaptchaChallenge {
  const a = randomInt(2, 10);
  const b = randomInt(2, 10);
  const sum = a + b;
  const exp = Date.now() + TTL_MS;
  const payload = `${a}|${b}|${sum}|${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  const token = Buffer.from(`${payload}::${sig}`, "utf8").toString("base64url");
  return { a, b, token };
}

export function verifyCaptchaToken(
  token: string,
  userAnswerRaw: string,
): boolean {
  const userAnswer = Number.parseInt(String(userAnswerRaw).trim(), 10);
  if (!Number.isFinite(userAnswer)) return false;
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const sep = raw.lastIndexOf("::");
    if (sep === -1) return false;
    const payload = raw.slice(0, sep);
    const sig = raw.slice(sep + 2);
    const expectedSig = createHmac("sha256", secret())
      .update(payload)
      .digest("hex");
    const aBuf = Buffer.from(expectedSig, "utf8");
    const bBuf = Buffer.from(sig, "utf8");
    if (aBuf.length !== bBuf.length) return false;
    if (!timingSafeEqual(aBuf, bBuf)) return false;

    const parts = payload.split("|");
    if (parts.length !== 4) return false;
    const sum = Number(parts[2]);
    const exp = Number(parts[3]);
    if (!Number.isFinite(sum) || !Number.isFinite(exp)) return false;
    if (Date.now() > exp) return false;
    return userAnswer === sum;
  } catch {
    return false;
  }
}
