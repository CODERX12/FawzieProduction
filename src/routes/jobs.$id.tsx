import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, Heart, MapPin, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAccount, useLanguage } from "@/components/fawzie/providers";
import { PageBanner, TrustNote, formatSalary } from "@/components/fawzie/ui";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/lib/fawzie";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs/$id")({
  head: () => ({ meta: [
    { title: "Job Details | Fawzie Recruitment" }, { name: "description", content: "Review an opportunity and apply through Fawzie Recruitment." },
    { property: "og:title", content: "Job Details | Fawzie Recruitment" }, { property: "og:description", content: "Review an opportunity and apply through Fawzie Recruitment." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: JobDetailPage,
});

function JobDetailPage() {
  const { id } = Route.useParams();
  const { session } = useAccount();
  const { t } = useLanguage();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", cover_note: "", consent: false });
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    void supabase.from("jobs").select("*").eq("id", id).eq("is_published", true).maybeSingle().then(({ data }) => {
      if (alive) { setJob(data as Job | null); setLoading(false); }
    });
    return () => { alive = false; };
  }, [id]);
  useEffect(() => {
    if (session?.user.email) setForm((current) => ({ ...current, email: current.email || session.user.email || "" }));
  }, [session]);
  useEffect(() => {
    try { setSaved((JSON.parse(window.localStorage.getItem("fawzie-saved-jobs") ?? "[]") as string[]).includes(id)); } catch { setSaved(false); }
  }, [id]);

  const toggleSaved = () => {
    let current: string[] = [];
    try { current = JSON.parse(window.localStorage.getItem("fawzie-saved-jobs") ?? "[]") as string[]; } catch { current = []; }
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    window.localStorage.setItem("fawzie-saved-jobs", JSON.stringify(next)); setSaved(!saved); toast.success(saved ? "Removed from saved jobs" : "Job saved");
  };
  const submit = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim() || !form.consent) { setMessage("Complete your name, email, phone and privacy consent to continue."); return; }
    setBusy(true); setMessage("");
    const { error } = await supabase.from("applications").insert({ job_id: id, user_id: session?.user.id ?? null, full_name: form.full_name, email: form.email, phone: form.phone, cover_note: form.cover_note || null });
    setBusy(false);
    if (error) { setMessage("We couldn’t submit your application. Please try again."); return; }
    setOpen(false); setForm({ full_name: "", email: session?.user.email ?? "", phone: "", cover_note: "", consent: false }); toast.success("Application received. We’ll be in touch.");
  };

  if (loading) return <div className="mx-auto max-w-7xl animate-pulse px-4 py-16"><div className="h-72 bg-muted" /></div>;
  if (!job) return <div className="mx-auto max-w-7xl px-4 py-20 text-center"><BriefcaseBusiness className="mx-auto size-10 text-muted-foreground/50" /><h1 className="mt-4 font-heading text-2xl font-bold">Job not found</h1><p className="mt-2 text-muted-foreground">This listing may have been removed or is no longer available.</p><Link to="/jobs" className="mt-5 inline-flex"><Button>Browse jobs</Button></Link></div>;

  return <>
    <PageBanner eyebrow={job.job_type} title={job.title} description={`${job.location}, ${job.country} · ${job.category}`}>
      <div className="mt-5 flex flex-wrap items-center gap-3"><Button onClick={() => setOpen(true)}>{t("cta.apply")}</Button><Button variant="outline" size="icon" aria-label={saved ? "Remove saved job" : "Save job"} className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" onClick={toggleSaved}><Heart className={`size-4 ${saved ? "fill-destructive text-destructive" : ""}`} /></Button><Button variant="outline" size="icon" aria-label="Copy job link" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => void navigator.clipboard.writeText(window.location.href).then(() => toast.success("Link copied"))}><Share2 className="size-4" /></Button></div>
    </PageBanner>
    <section className="py-9 md:py-12"><div className="mx-auto grid max-w-7xl gap-7 px-4 md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] md:px-8">
      <div className="space-y-8"><div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-border pb-5 text-sm text-muted-foreground"><span className="flex items-center gap-2"><MapPin className="size-4" />{job.location}</span><span className="flex items-center gap-2"><BriefcaseBusiness className="size-4" />{job.category}</span><span className="flex items-center gap-2"><Building2 className="size-4" />{job.employer}</span><span className="flex items-center gap-2"><CalendarDays className="size-4" />{new Date(job.posted_at).toLocaleDateString()}</span></div><div><h2 className="font-heading text-xl font-semibold">Job description</h2><p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{job.description}</p></div>{job.requirements && <div className="border-t border-border pt-6"><h2 className="font-heading text-xl font-semibold">Requirements</h2><p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{job.requirements}</p></div>}</div>
      <aside><Card className="sticky top-24 border-border shadow-none"><CardContent className="space-y-4 p-5"><h2 className="font-heading text-lg font-semibold">Job overview</h2>{job.salary_max && <div className="border-b border-border pb-4"><p className="text-xs text-muted-foreground">Monthly salary</p><p className="mt-1 font-heading text-lg font-semibold">{formatSalary(job.currency, job.salary_min, job.salary_max)}</p></div>}<dl className="space-y-3 text-sm"><div><dt className="text-muted-foreground">Country</dt><dd className="mt-0.5 font-medium">{job.country}</dd></div><div><dt className="text-muted-foreground">Job type</dt><dd className="mt-0.5 font-medium">{job.job_type}</dd></div><div><dt className="text-muted-foreground">Employer</dt><dd className="mt-0.5 font-medium">{job.employer}</dd></div></dl><Button className="w-full" onClick={() => setOpen(true)}>{t("cta.apply")}</Button><p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-3 text-accent" />No fees before contract</p></CardContent></Card></aside>
    </div></section>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg"><DialogHeader><DialogTitle className="font-heading text-xl">Apply for {job.title}</DialogTitle><DialogDescription>Share your contact details and our recruitment team will follow up.</DialogDescription></DialogHeader><div className="space-y-4">
      <div className="space-y-1.5"><Label htmlFor="application-name">Full name</Label><Input id="application-name" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} /></div><div className="space-y-1.5"><Label htmlFor="application-email">Email</Label><Input id="application-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div><div className="space-y-1.5"><Label htmlFor="application-phone">Phone</Label><Input id="application-phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+254 7XX XXX XXX" /></div><div className="space-y-1.5"><Label htmlFor="application-note">Cover note (optional)</Label><Textarea id="application-note" rows={4} value={form.cover_note} onChange={(event) => setForm({ ...form, cover_note: event.target.value })} /></div><div className="flex items-start gap-2"><Checkbox id="application-consent" checked={form.consent} onCheckedChange={(value) => setForm({ ...form, consent: value === true })} /><Label htmlFor="application-consent" className="text-xs leading-relaxed text-muted-foreground">I agree to the privacy notice and consent to the use of my details.</Label></div>{message && <p role="alert" className="text-sm text-destructive">{message}</p>}<Button className="w-full" disabled={busy} onClick={() => void submit()}>{busy ? "Submitting…" : "Submit application"}</Button>
    </div></DialogContent></Dialog>
  </>;
}