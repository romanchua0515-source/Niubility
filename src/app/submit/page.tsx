import { createCaptchaChallenge } from "@/app/submit/captcha";
import { SubmitLandingPage } from "@/components/submit-landing-page";
import { buildBilingualPageMetadata } from "@/lib/seo-metadata";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildBilingualPageMetadata({
    path: "/submit",
    enTitle: "Submit a Tool — Niubility",
    enDescription:
      "Know a great Web3 or AI tool? Submit it to be featured in the Niubility directory.",
    zhTitle: "提交工具 — Niubility",
    zhDescription:
      "有好的 Web3 或 AI 工具？提交后即可参与 Niubility 目录精选展示。",
  });
}

export default async function SubmitPage() {
  const captchaChallenge = createCaptchaChallenge();
  return <SubmitLandingPage captchaChallenge={captchaChallenge} />;
}
