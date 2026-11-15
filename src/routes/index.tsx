import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/fawzie/home-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fawzie Recruitment Agency | Kenyan Jobs, Local & Overseas" },
      { name: "description", content: "A Kenyan recruitment agency connecting job seekers with local and Gulf opportunities." },
      { property: "og:title", content: "Fawzie Recruitment Agency | Kenyan Jobs, Local & Overseas" },
      { property: "og:description", content: "Safe, fair and verified job opportunities for Kenyan workers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});
