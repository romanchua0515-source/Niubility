/** Structured email fallback alongside the on-site submit form */
export const SUBMIT_MAILTO_HREF =
  "mailto:hello@example.com?subject=" +
  encodeURIComponent("Tool submission — Niubility") +
  "&body=" +
  encodeURIComponent(
    "Tool name:\nURL:\nOne-line description:\nCategory (Web3 / AI / other):\n",
  );
