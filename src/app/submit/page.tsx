import type { Metadata } from "next";
import { createCaptchaChallenge } from "@/app/submit/captcha";
import { SubmitLandingPage } from "@/components/submit-landing-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Submit a Tool — Niubility",
  description:
    "Get your Web3 or AI product listed in Niubility. We review submissions weekly.",
};

export default async function SubmitPage() {
  const captchaChallenge = createCaptchaChallenge();
  return <SubmitLandingPage captchaChallenge={captchaChallenge} />;
}
