import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/fawzie/static-pages";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Fawzie Recruitment" },
    { name: "description", content: "Meet Fawzie Recruitment, a Kenyan agency connecting workers with safer local and overseas opportunities." },
    { property: "og:title", content: "About Fawzie Recruitment" },
    { property: "og:description", content: "Our commitment to safe migration and fair work." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: AboutPage,
});