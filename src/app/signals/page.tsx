import { SignalsPage } from "@/components/signals-page";
import { hotThisWeek } from "@/data/hot-this-week";

export default function SignalsPageRoute() {
  return <SignalsPage items={hotThisWeek} />;
}
