import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Clock3, FileText, LayoutDashboard, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PageBanner } from "@/components/fawzie/ui";
import { TabsContent } from "@/components/ui/tabs";
import { AccountWorkspace } from "@/components/fawzie/account-workspace";
import { AccountAccess } from "@/components/fawzie/account-access";
import { useAccount, useLanguage } from "@/components/fawzie/providers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/employers")({
  head: () => ({ meta: [
    { title: "Hire Workers | Fawzie Recruitment" },
    { name: "description", content: "Request qualified, pre-screened Kenyan workers for trusted local or overseas roles." },
    { property: "og:title", content: "Hire Workers | Fawzie Recruitment" },
    { property: "og:description", content: "Submit and track a private hiring request." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: EmployersPage,
});

type RequestRow = { id: string; company_name: string; contact_name: string; email: string; phone: string; roles: string; num_workers: number; location: string; timeline: string | null; notes: string | null; consent: boolean; status: string };
const sections = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "requests", label: "Hiring requests", icon: FileText },
  { value: "form", label: "Request form", icon: Building2 },
];
const EMPTY = { company_name: "", contact_name: "", email: "", phone: "", roles: "", num_workers: "1", location: "", timeline: "", notes: "", consent: false };

function EmployersPage() {
  const { session, loading: accountLoading, signOut } = useAccount();
  const { t } = useLanguage();
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [editingRequest, setEditingRequest] = useState<RequestRow | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ ...EMPTY });
  const userId = session?.user.id;
  const email = session?.user.email ?? "";
  useEffect(() => {
    let active = true;
    setRequests([]);
    setEditingRequest(null);
    setActiveTab("overview");
    setForm({ ...EMPTY, email });
    setError("");
    setLoadError(false);
    setLoading(Boolean(userId));
    if (userId) {
      void supabase.from("employer_requests").select("*").eq("user_id", userId)
        .order("created_at", { ascending: false }).then(({ data, error }) => {
          if (!active) return;
          setRequests(data ?? []);
          setLoadError(Boolean(error));
          setLoading(false);
        });
    }
    return () => { active = false; };
  }, [userId, email]);

  const openForm = (request: RequestRow | null) => {
    setEditingRequest(request);
    setForm(request ? { ...request, num_workers: String(request.num_workers), timeline: request.timeline ?? "", notes: request.notes ?? "" } : { ...EMPTY, email });
    setError("");
    setActiveTab("form");
  };

  const submit = async () => {
    if (!form.company_name.trim() || !form.contact_name.trim() || !form.email.trim() || !form.phone.trim() || !form.roles.trim() || !form.location.trim() || !form.consent) { setError("Please complete the required details and accept the privacy notice."); return; }
    setBusy(true); setError("");
    const data = { company_name: form.company_name, contact_name: form.contact_name, email: form.email, phone: form.phone, roles: form.roles, num_workers: Math.max(1, Number.parseInt(form.num_workers, 10) || 1), location: form.location, timeline: form.timeline || null, notes: form.notes || null, consent: form.consent };
    try {
      const result = editingRequest
        ? await supabase.from("employer_requests").update(data).eq("id", editingRequest.id).select("*").single()
        : await supabase.from("employer_requests").insert(data).select("*").single();
      if (result.error) throw result.error;
      const saved = result.data;
      setRequests((current) => editingRequest ? current.map((request) => request.id === saved.id ? saved : request) : [saved, ...current]);
      toast.success(editingRequest ? "Request updated." : "Request received.");
      setEditingRequest(null);
      setForm({ ...EMPTY, email });
      setActiveTab("requests");
    } catch {
      setError("Could not submit your request. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  if (accountLoading || loading) return <div className="grid min-h-[50vh] place-items-center"><Clock3 className="size-7 animate-spin text-primary" /></div>;
  if (!session) return <><PageBanner image="/images/banners/employers.webp" title="Employer account" description="Create an account to submit hiring requests, update company details and track our response." /><section className="px-4 py-10"><AccountAccess title="Sign in to hire workers" description="Your company requests stay private and can be updated from any device." /></section></>;
  return (
    <AccountWorkspace role="Employer" email={email} sections={sections} active={activeTab} onChange={setActiveTab} signOut={signOut}
      action={<Button size="sm" disabled={busy || loadError} onClick={() => openForm(null)}><Plus className="size-4" />New request</Button>}>
      {loadError && <p role="alert" className="mb-4 rounded-lg border border-border bg-card p-4 text-sm text-destructive">Couldn’t load hiring requests. Refresh to try again.</p>}
      <TabsContent value="overview">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Hiring requests", loadError ? "Unavailable" : requests.length],
            ["Workers requested", loadError ? "Unavailable" : requests.reduce((total, request) => total + request.num_workers, 0)],
            ["Latest request status", loadError ? "Unavailable" : requests[0]?.status ?? "No requests yet"],
          ].map(([label, value]) => (
            <button key={label} type="button" onClick={() => setActiveTab("requests")} className="rounded-xl border border-border bg-card p-5 text-start hover:border-primary/60">
              <span className="block text-sm text-muted-foreground">{label}</span>
              <span className="mt-3 block font-heading text-2xl font-semibold">{value}</span>
            </button>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="requests">
        <h2 className="font-heading text-lg font-semibold">Your hiring requests</h2>
        {!loadError && requests.length === 0 && <p className="mt-3 text-sm text-muted-foreground">You haven’t submitted a hiring request yet.</p>}
        <ul className="mt-4 divide-y divide-border">
          {requests.map((request) => (
            <li key={request.id} className="flex flex-wrap justify-between gap-4 py-4">
              <div>
                <h3 className="font-semibold">{request.company_name}</h3>
                <p className="mt-1 whitespace-pre-line text-sm">{request.roles}</p>
                <p className="mt-1 text-sm text-muted-foreground">{request.num_workers} worker(s) · {request.location}{request.timeline ? ` · ${request.timeline}` : ""}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-primary">{request.status}</span>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => openForm(request)}><Pencil className="size-4" />Edit</Button>
              </div>
            </li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="form">
        <div className="max-w-3xl">
<Card className="border-border shadow-none"><CardContent className="space-y-5 p-5 md:p-8"><div className="flex items-center gap-3"><Building2 className="size-5 text-primary" /><h2 className="font-heading text-lg font-semibold">{editingRequest ? "Edit hiring request" : "New hiring request"}</h2></div><div className="grid gap-4 sm:grid-cols-2"><FormField label="Company name"><Input value={form.company_name} onChange={(event) => setForm({ ...form, company_name: event.target.value })} /></FormField><FormField label="Contact person"><Input value={form.contact_name} onChange={(event) => setForm({ ...form, contact_name: event.target.value })} /></FormField><FormField label="Email"><Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></FormField><FormField label="Phone number"><Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></FormField><FormField label="Number of workers"><Input type="number" min="1" value={form.num_workers} onChange={(event) => setForm({ ...form, num_workers: event.target.value })} /></FormField><FormField label="Work location"><Input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></FormField><div className="sm:col-span-2"><FormField label="Roles needed"><Textarea rows={3} value={form.roles} onChange={(event) => setForm({ ...form, roles: event.target.value })} placeholder="e.g. 5 domestic workers, 3 security guards, 2 drivers" /></FormField></div><div className="sm:col-span-2"><FormField label="Expected timeline"><Input value={form.timeline} onChange={(event) => setForm({ ...form, timeline: event.target.value })} placeholder="e.g. Within one month" /></FormField></div><div className="sm:col-span-2"><FormField label="Additional notes"><Textarea rows={3} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></FormField></div></div><label className="flex items-start gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><Checkbox checked={form.consent} onCheckedChange={(checked) => setForm({ ...form, consent: checked === true })} />{t("common.privacy")}</label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="w-full" disabled={busy || loadError} onClick={() => void submit()}>{busy ? "Submitting…" : editingRequest ? "Save changes" : "Submit hiring request"}</Button></CardContent></Card>
        </div>
      </TabsContent>
    </AccountWorkspace>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }