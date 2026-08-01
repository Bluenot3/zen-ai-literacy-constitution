import type { Metadata } from "next";
import ZenHub from "./zen-hub";

export const metadata: Metadata = {
  title: { absolute: "ZEN AI Co. | Intelligence Into Capability" },
  description:
    "The ZEN AI ecosystem gateway for build-first AI education, Arsenal-powered execution, and proof of real capability.",
};

export default function Home() {
  return <ZenHub />;
}
