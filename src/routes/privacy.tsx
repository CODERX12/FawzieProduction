import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/fawzie/static-pages";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: "Privacy Notice | Fawzie Recruitment" },
    { name: "description", content: "Learn how Fawzie Recruitment uses and protects personal information under Kenyan data protection law." },
    { property: "og:title", content: "Privacy Notice | Fawzie Recruitment" },
    { property: "og:description", content: "How personal information is used and protected." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: PrivacyPage,
});