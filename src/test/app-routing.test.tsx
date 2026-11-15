import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("registers every migrated Bolt page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const paths = [
      "/", "/about", "/account/reset", "/admin", "/admin/dashboard", "/contact",
      "/employers", "/get-help", "/job-seekers", "/jobs", "/jobs/sample-job", "/privacy", "/safe-migration",
    ];

    for (const path of paths) {
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId, `Expected a registered page at ${path}`).not.toBe(rootRouteId);
    }
  });
});
