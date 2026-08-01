import type { Metadata } from "next";
import StartIntake from "./start-intake";

export const metadata: Metadata = {
  title: "Start with ZEN",
  description:
    "A guided ZEN intake for learners, educators, businesses, communities, and partners.",
};

export default function StartPage() {
  return <StartIntake />;
}
