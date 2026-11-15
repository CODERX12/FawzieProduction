import { createFileRoute } from "@tanstack/react-router";
import { GetHelpPage } from "@/components/fawzie/static-pages";

export const Route = createFileRoute("/get-help")({
  head: () => ({ meta: [
    { title: "Urgent Help for Kenyan Workers Abroad | Fawzie" },
    { name: "description", content: "Get urgent help from Fawzie Recruitment if you are a Kenyan worker abroad facing unsafe conditions." },
    { property: "og:title", content: "Urgent Help | Fawzie Recruitment" },
    { property: "og:description", content: "Contact Fawzie for urgent support abroad." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: GetHelpPage,
});