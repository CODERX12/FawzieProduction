import { createFileRoute } from "@tanstack/react-router";
import { SafeMigrationPage } from "@/components/fawzie/static-pages";

export const Route = createFileRoute("/safe-migration")({
  head: () => ({ meta: [
    { title: "Safe Migration Guide | Fawzie Recruitment" },
    { name: "description", content: "Read practical guidance on verifying job agencies, contracts, payments and travel documents." },
    { property: "og:title", content: "Safe Migration Guide | Fawzie Recruitment" },
    { property: "og:description", content: "Protect your rights and prepare for work abroad safely." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: SafeMigrationPage,
});