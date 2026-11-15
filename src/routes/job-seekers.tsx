import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, BriefcaseBusiness, FileText, Globe2, LayoutDashboard, LoaderCircle, Pencil, UserRound } from "lucide-react";
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
import { COUNTRIES } from "@/lib/fawzie";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/job-seekers")({
  head: () => ({ meta: [
    { title: "Job Seeker Registration | Fawzie Recruitment" },
    { name: "description", content: "Create a private profile with your skills, documents and preferred work destination." },
    { property: "og:title", content: "Job Seeker Registration | Fawzie Recruitment" },
    { property: "og:description", content: "Build a profile for trusted local and overseas job opportunities." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: JobSeekersPage,
});

type Profile = { id: string; full_name: string; email: string; phone: string; national_id: string | null; skills: string | null; experience_years: number | null; preferred_destination: string | null; cv_path: string | null; passport_path: string | null; consent: boolean; status: string };
const sections = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "profile", label: "My profile", icon: UserRound },
  { value: "documents", label: "Documents", icon: FileText },
  { value: "applications", label: "My applications", icon: BriefcaseBusiness },
];
type Application = { id: string; status: string; feedback: string | null; created_at: string; job: { title: string } | null };
const steps = ["Personal", "Skills", "Documents", "Destination"];
const EMPTY_PROFILE = { full_name: "", email: "", phone: "", national_id: "", skills: "", experience_years: "", cv_path: "", passport_path: "", preferred_destination: "", consent: false };

function JobSeekersPage() {
  const { session, loading: authLoading, signOut } = useAccount();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [step, setStep] = useState(0);
  const [active, setActive] = useState("overview");
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationError, setApplicationError] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [passport, setPassport] = useState<File | null>(null);
  const [form, setForm] = useState(EMPTY_PROFILE);

  useEffect(() => {
    let alive = true;
    if (!session) { setProfile(null); setEditing(false); setActive("overview"); setForm(EMPTY_PROFILE); setCv(null); setPassport(null); setLoading(false); return () => { alive = false; }; }
    setLoading(true);
    setProfileError(false);
    void supabase.from("job_seekers").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle().then(({ data, error }) => {
      if (!alive) return;
      setProfileError(Boolean(error));
      const next = data; setProfile(next);
      if (next) setForm({ full_name: next.full_name, email: next.email, phone: next.phone, national_id: next.national_id ?? "", skills: next.skills ?? "", experience_years: next.experience_years?.toString() ?? "", cv_path: next.cv_path ?? "", passport_path: next.passport_path ?? "", preferred_destination: next.preferred_destination ?? "", consent: next.consent });
      else setForm((current) => ({ ...current, email: current.email || session.user.email || "" }));
      setLoading(false);
    });
    return () => { alive = false; };
  }, [session]);

  const userId = session?.user.id;
  useEffect(() => {
    let current = true;
    setApplications([]);
    setApplicationError(false);
    setApplicationsLoading(Boolean(userId));
    if (userId) {
      void supabase.from("applications").select("id,status,feedback,created_at,job:jobs(title)")
        .eq("user_id", userId).order("created_at", { ascending: false }).then(({ data, error }) => {
          if (!current) return;
          setApplications(data ?? []);
          setApplicationError(Boolean(error));
          setApplicationsLoading(false);
        });
    }
    return () => { current = false; };
  }, [userId]);

  const editProfile = (start = 0) => {
    setStep(start);
    setMessage("");
    setEditing(true);
    setActive("profile");
  };

  const validateStep = () => {
    if (step === 0 && (!form.full_name.trim() || !form.email.trim() || !form.phone.trim())) return "Please enter your name, email and phone number.";
    if (step === 1 && !form.skills.trim()) return "Please list at least one skill.";
    if (step === 3 && !form.consent) return "Please accept the privacy notice to continue.";
    return "";
  };
  const next = () => { const issue = validateStep(); if (issue) { setMessage(issue); return; } setMessage(""); setStep((current) => Math.min(3, current + 1)); };
  const upload = async (file: File | null, folder: "cvs" | "passports") => {
    if (!file || !session) return null;
    const path = `${session.user.id}/${folder}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
    if (error) throw new Error(`Could not upload ${folder === "cvs" ? "CV" : "passport"}. Please try again.`);
    return path;
  };
  const submit = async () => {
    const issue = validateStep(); if (issue) { setMessage(issue); return; }
    if (!session || profileError) return;
    setBusy(true); setMessage("");
    try {
      const cvPath = (await upload(cv, "cvs") ?? form.cv_path) || null;
      const passportPath = (await upload(passport, "passports") ?? form.passport_path) || null;
      const record = { full_name: form.full_name, email: form.email, phone: form.phone, national_id: form.national_id || null, skills: form.skills, experience_years: form.experience_years ? Number.parseInt(form.experience_years, 10) : null, cv_path: cvPath, passport_path: passportPath, preferred_destination: form.preferred_destination || null, consent: form.consent };
      const result = profile
        ? await supabase.from("job_seekers").update(record).eq("id", profile.id).select("*").single()
        : await supabase.from("job_seekers").insert({ ...record, user_id: session.user.id }).select("*").single();
      if (result.error) throw new Error("We couldn’t save your registration. Please try again.");
      setProfile(result.data);
      setForm((current) => ({ ...current, cv_path: cvPath ?? "", passport_path: passportPath ?? "" }));
      setCv(null);
      setPassport(null);
      setEditing(false);
      toast.success(profile ? "Profile updated." : "Registration received.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "We couldn’t save your registration."); }
    finally { setBusy(false); }
  };
  if (authLoading || loading) return <div className="grid min-h-[50vh] place-items-center"><LoaderCircle className="size-7 animate-spin text-primary" /></div>;
  if (!session) return <><PageBanner title="Your job seeker account" description="Create an account to register once, update your profile and follow your application progress." /><section className="px-4 py-10"><AccountAccess title="Sign in to continue" description="Your account keeps your profile and application progress private across devices." /></section></>;
  const progress = ((step + 1) / steps.length) * 100;
  return (
    <AccountWorkspace role="Job seeker" email={session.user.email ?? ""} sections={sections} active={active} onChange={setActive} signOut={signOut}
      action={<Button asChild size="sm"><Link to="/jobs">Browse jobs</Link></Button>}>
      {profileError && <p role="alert" className="mb-4 rounded-lg border border-border bg-card p-4 text-sm text-destructive">Couldn’t load your profile. Refresh to try again.</p>}
      <TabsContent value="overview">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Profile review" value={profileError ? "Unavailable" : profile?.status ?? "Incomplete"} onClick={() => setActive("profile")} />
          <SummaryCard label="Applications" value={applicationsLoading ? "Loading…" : applicationError ? "Unavailable" : String(applications.length)} onClick={() => setActive("applications")} />
          <SummaryCard label="Documents uploaded" value={String(Number(Boolean(profile?.cv_path)) + Number(Boolean(profile?.passport_path)))} onClick={() => setActive("documents")} />
        </div>
      </TabsContent>
      <TabsContent value="documents">
        <h2 className="font-heading text-lg font-semibold">Private documents</h2>
        <dl className="my-4 divide-y divide-border rounded-lg border border-border">
          {[["CV / Resume", profile?.cv_path], ["Passport copy", profile?.passport_path]].map(([label, path]) => (
            <div key={label} className="flex justify-between gap-3 p-4 text-sm"><dt>{label}</dt><dd className="text-muted-foreground">{path ? "Uploaded" : "Not uploaded"}</dd></div>
          ))}
        </dl>
        <Button disabled={profileError} onClick={() => editProfile(profile ? 2 : 0)}>{profile ? "Manage documents" : "Complete your profile"}</Button>
      </TabsContent>
      <TabsContent value="applications">
        <h2 className="font-heading text-lg font-semibold">Application history</h2>
        {applicationsLoading && <p role="status" className="mt-3 text-sm text-muted-foreground">Loading applications…</p>}
        {applicationError && <p role="alert" className="mt-3 text-sm text-destructive">Couldn’t load applications. Refresh to try again.</p>}
        {!applicationsLoading && !applicationError && applications.length === 0 && <p className="mt-3 text-sm text-muted-foreground">You haven’t submitted any applications while signed in.</p>}
        <ul className="mt-4 divide-y divide-border">
          {applications.map((application) => (
            <li key={application.id} className="flex flex-wrap justify-between gap-3 py-4">
              <div>
                <p className="font-medium">{application.job?.title ?? "Job listing unavailable"}</p>
                <p className="text-sm text-muted-foreground">{new Date(application.created_at).toLocaleDateString()}</p>
                {application.feedback && <p className="mt-2 text-sm">{application.feedback}</p>}
              </div>
              <span className="self-start rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">{application.status}</span>
            </li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="profile">
        {profileError ? null : profile && !editing ? (
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold">{profile.full_name}</h2>
              <p className="mt-1 break-all text-sm text-muted-foreground">{profile.email} · {profile.phone}</p>
              {profile.skills && <p className="mt-3 whitespace-pre-line text-sm">{profile.skills}</p>}
              <p className="mt-3 text-sm text-muted-foreground">Preferred destination: {profile.preferred_destination || "No preference"}</p>
            </div>
            <Button onClick={() => editProfile()}><Pencil className="size-4" />Edit profile</Button>
          </div>
        ) : (
          <div className="max-w-3xl">
<div className="mb-6 flex items-center justify-between">{steps.map((title, index) => <div key={title} className="flex items-center gap-2"><span className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${index === step ? "bg-primary text-primary-foreground" : index < step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{index < step ? <Check className="size-4" /> : index + 1}</span><span className={`hidden text-xs font-medium sm:inline ${index === step ? "text-foreground" : "text-muted-foreground"}`}>{title}</span></div>)}</div><div className="mb-6 h-1.5 bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div><Card className="border-border shadow-none"><CardContent className="space-y-5 p-5 md:p-8">
    {step === 0 && <><div className="flex items-center gap-3"><UserRound className="size-5 text-primary" /><h2 className="font-heading text-lg font-semibold">Personal details</h2></div><FormField label="Full name"><Input value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} /></FormField><FormField label="Email"><Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></FormField><FormField label="Phone number"><Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+254 7XX XXX XXX" /></FormField><FormField label="National ID number (optional)"><Input value={form.national_id} onChange={(event) => setForm({ ...form, national_id: event.target.value })} /></FormField></>}
    {step === 1 && <><div className="flex items-center gap-3"><FileText className="size-5 text-primary" /><h2 className="font-heading text-lg font-semibold">Skills & experience</h2></div><FormField label="Your skills"><Textarea rows={4} value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} placeholder="Cooking, cleaning, childcare, driving, construction, healthcare…" /></FormField><FormField label="Years of experience"><Input type="number" min="0" value={form.experience_years} onChange={(event) => setForm({ ...form, experience_years: event.target.value })} /></FormField></>}
    {step === 2 && <><div className="flex items-center gap-3"><FileText className="size-5 text-primary" /><h2 className="font-heading text-lg font-semibold">Documents</h2></div><p className="text-sm text-muted-foreground">CV and passport copies are stored privately and visible only to your account and authorized recruitment staff. You may skip this step and upload later.</p><FormField label="CV / Resume"><Input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setCv(event.target.files?.[0] ?? null)} />{form.cv_path && <span className="text-xs text-muted-foreground">Existing CV uploaded</span>}</FormField><FormField label="Passport copy"><Input type="file" accept=".pdf,.jpg,.png" onChange={(event) => setPassport(event.target.files?.[0] ?? null)} />{form.passport_path && <span className="text-xs text-muted-foreground">Existing passport copy uploaded</span>}</FormField></>}
    {step === 3 && <><div className="flex items-center gap-3"><Globe2 className="size-5 text-primary" /><h2 className="font-heading text-lg font-semibold">Preferred destination</h2></div><FormField label="Where would you like to work?"><select className="fawzie-input" value={form.preferred_destination} onChange={(event) => setForm({ ...form, preferred_destination: event.target.value })}><option value="">No preference — any safe opportunity</option><option>Kenya</option>{COUNTRIES.map((country) => <option key={country.code}>{country.name}</option>)}</select></FormField><div className="flex items-start gap-2 border-t border-border pt-5"><Checkbox id="seeker-consent" checked={form.consent} onCheckedChange={(checked) => setForm({ ...form, consent: checked === true })} /><Label htmlFor="seeker-consent" className="text-xs leading-relaxed text-muted-foreground">{t("common.privacy")}</Label></div></>}
    {message && <p role="alert" className="text-sm text-destructive">{message}</p>}<div className="flex justify-between border-t border-border pt-5"><Button type="button" variant="outline" onClick={() => { setMessage(""); setStep((current) => Math.max(0, current - 1)); }} disabled={step === 0}><ArrowLeft className="mr-2 size-4" />{t("common.back")}</Button>{step < 3 ? <Button type="button" onClick={next}>{t("common.next")}<ArrowRight className="ml-2 size-4" /></Button> : <Button type="button" disabled={busy} onClick={() => void submit()}>{busy ? "Submitting…" : editing ? "Save profile" : "Complete registration"}</Button>}</div>
  </CardContent></Card></div>
        )}
      </TabsContent>
    </AccountWorkspace>
  );
}

function SummaryCard({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-xl border border-border bg-card p-5 text-start hover:border-primary/60"><span className="block text-sm text-muted-foreground">{label}</span><span className="mt-3 block font-heading text-2xl font-semibold">{value}</span></button>;
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }