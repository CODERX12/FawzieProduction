import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/fawzie/static-pages";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Fawzie Recruitment" },
    { name: "description", content: "Contact Fawzie Recruitment about jobs, hiring, registration or urgent worker support." },
    { property: "og:title", content: "Contact Fawzie Recruitment" },
    { property: "og:description", content: "Reach the Fawzie Recruitment team in Nairobi." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ContactPage,
});