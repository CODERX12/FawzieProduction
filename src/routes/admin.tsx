import { useEffect } from "react";
import { createFileRoute, Outlet, useChildMatches, useNavigate } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { AccountAccess } from "@/components/fawzie/account-access";
import { useAccount } from "@/components/fawzie/providers";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Staff Access | Fawzie Recruitment" },
    { name: "description", content: "Secure staff account access for Fawzie Recruitment." },
    { property: "og:title", content: "Staff Access | Fawzie Recruitment" },
    { property: "og:description", content: "Authorized staff access." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: AdminLoginPage,
});


function AdminLoginPage() {
  const { session, loading } = useAccount();
  const navigate = useNavigate();
  const hasChildRoute = useChildMatches().length > 0;

  useEffect(() => {
    if (!hasChildRoute && !loading && session) {
      void navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [hasChildRoute, loading, session, navigate]);

  if (hasChildRoute) return <Outlet />;
  if (loading || session) return null;

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-12">
      <div className="w-full">
        <div className="mb-7 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground"><LockKeyhole className="size-6" /></div>
          <h1 className="mt-4 font-heading text-3xl font-semibold">Staff access</h1>
          <p className="mt-2 text-sm text-muted-foreground">Fawzie Recruitment Agency dashboard</p>
        </div>
        <AccountAccess title="Staff sign in" description="Sign in or create an account with your staff email address." staff />
      </div>
    </section>
  );
}
