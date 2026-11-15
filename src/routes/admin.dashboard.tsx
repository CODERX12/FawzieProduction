import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, BriefcaseBusiness, Building2, Download, Eye, EyeOff, FileText, LayoutDashboard, LoaderCircle, LogOut, Pencil, Phone, Plus, Save, Search, ShieldCheck, Trash2, UserRound, Users, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminAccessManagement } from "@/components/fawzie/admin-access-management";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAccount } from "@/components/fawzie/providers";
import { CATEGORIES } from "@/lib/fawzie";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [
    { title: "Recruitment Dashboard | Fawzie" },
    { name: "description", content: "Manage job listings, applications, hiring requests and worker support reports." },
    { property: "og:title", content: "Recruitment Dashboard | Fawzie" },
    { property: "og:description", content: "Secure Fawzie Recruitment staff dashboard." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: AdminDashboard,
});

type JobRow = { id: string; title: string; category: string; location: string; country: string; job_type: string; salary_min: number | null; salary_max: number | null; currency: string; description: string; requirements: string; employer: string; posted_at: string; is_published: boolean; is_sample: boolean };
type AppRow = { id: string; full_name: string; email: string; phone: string; status: string; cover_note: string | null; created_at: string; job_id: string | null; job?: { title: string } | null };
type SeekerRow = { id: string; full_name: string; email: string; phone: string; skills: string | null; status: string; cv_path: string | null; passport_path: string | null };
type EmployerRow = { id: string; company_name: string; contact_name: string; email: string; phone: string; roles: string; num_workers: number; location: string; timeline: string | null; notes: string | null; status: string };
type DistressRow = { id: string; full_name: string; country: string; employer: string | null; situation: string; phone: string; created_at: string };
type ContentRow = { key: string; value: string };
type JobForm = Omit<JobRow, "id" | "posted_at">;
const EMPTY_JOB: JobForm = { title: "", category: CATEGORIES[0], location: "", country: "Kenya", job_type: "Kenya", salary_min: null, salary_max: null, currency: "KES", description: "", requirements: "", employer: "Confidential", is_published: true, is_sample: false };
const APP_STATUSES = ["Received", "Reviewing", "Accepted", "Rejected"];
const EMPLOYER_STATUSES = ["Received", "Reviewing", "Accepted", "Rejected", "Fulfilled"];
const ADMIN_TABS = [
  { value: "overview", label: "Overview", icon: LayoutDashboard, description: "Track activity across your recruitment operations." },
  { value: "jobs", label: "Job listings", icon: BriefcaseBusiness, description: "Publish and manage recruitment opportunities." },
  { value: "applications", label: "Applications", icon: FileText, description: "Review applications and update applicant statuses." },
  { value: "seekers", label: "Job seekers", icon: Users, description: "Review profiles, skills and submitted documents." },
  { value: "employers", label: "Employer requests", icon: Building2, description: "Review and respond to hiring requests." },
  { value: "reports", label: "Urgent reports", icon: AlertTriangle, description: "Review worker support reports and contact the workers who submitted them." },
  { value: "content", label: "Site content", icon: Pencil, description: "Manage editable content on the public site." },
] as const;

const ADMIN_ACCESS_TAB = { value: "admin-access", label: "Admin access", icon: ShieldCheck, description: "Manage administrator access to the recruitment workspace." } as const;

function AdminDashboard() {
  const { session, loading, signOut } = useAccount();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [canManageAdmins, setCanManageAdmins] = useState(false);
  const [checking, setChecking] = useState(true);
  const [accessError, setAccessError] = useState(false);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [applications, setApplications] = useState<AppRow[]>([]);
  const [seekers, setSeekers] = useState<SeekerRow[]>([]);
  const [employers, setEmployers] = useState<EmployerRow[]>([]);
  const [reports, setReports] = useState<DistressRow[]>([]);
  const [contents, setContents] = useState<ContentRow[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [jobDialog, setJobDialog] = useState(false);
  const [editing, setEditing] = useState<JobRow | null>(null);
  const [jobForm, setJobForm] = useState<JobForm>({ ...EMPTY_JOB });
  const [savingJob, setSavingJob] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobRow | null>(null);
  const [deletingJob, setDeletingJob] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const [appStatus, setAppStatus] = useState("all");
  const [busy, setBusy] = useState(true);

  const loadAll = useCallback(async () => {
    const [jobsResult, appsResult, seekersResult, employersResult, reportsResult, contentResult] = await Promise.all([
      supabase.from("jobs").select("*").order("posted_at", { ascending: false }),
      supabase.from("applications").select("*, job:jobs(title)").order("created_at", { ascending: false }),
      supabase.from("job_seekers").select("*").order("created_at", { ascending: false }),
      supabase.from("employer_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("distress_reports").select("*").order("created_at", { ascending: false }),
      supabase.from("site_content").select("*").order("key"),
    ]);
    setJobs((jobsResult.data ?? []) as JobRow[]);
    setApplications((appsResult.data ?? []) as AppRow[]);
    setSeekers((seekersResult.data ?? []) as SeekerRow[]);
    setEmployers((employersResult.data ?? []) as EmployerRow[]);
    setReports((reportsResult.data ?? []) as DistressRow[]);
    setContents((contentResult.data ?? []) as ContentRow[]);
    setBusy(false);
  }, []);

  useEffect(() => {
    let active = true;
    if (loading) return () => { active = false; };
    if (!session) { setChecking(false); void navigate({ to: "/admin" }); return () => { active = false; }; }
    setChecking(true);
    setIsAdmin(false);
    setAccessError(false);
    setCanManageAdmins(false);
    void Promise.all([supabase.rpc("is_admin"), supabase.rpc("can_manage_admins")]).then(([{ data, error }, owner]) => {
      if (!active) return;
      const allowed = data === true && !error;
      setIsAdmin(allowed); setCanManageAdmins(allowed && owner.data === true && !owner.error); setChecking(false);
      setAccessError(Boolean(error));
      if (allowed) void loadAll();
    });
    return () => { active = false; };
  }, [loading, session, navigate, loadAll]);

  const openNew = () => { setEditing(null); setJobForm({ ...EMPTY_JOB }); setJobDialog(true); };
  const openEdit = (job: JobRow) => { setEditing(job); const { id: _id, posted_at: _posted, ...form } = job; setJobForm(form); setJobDialog(true); };
  const saveJob = async () => {
    if (!jobForm.title.trim() || !jobForm.location.trim() || !jobForm.description.trim()) { toast.error("Add a title, location and description."); return; }
    setSavingJob(true);
    const result = editing ? await supabase.from("jobs").update(jobForm).eq("id", editing.id) : await supabase.from("jobs").insert(jobForm);
    setSavingJob(false);
    if (result.error) { toast.error("Could not save this job."); return; }
    setJobDialog(false); toast.success(editing ? "Job updated." : "Job created."); await loadAll();
  };
  const toggleJob = async (job: JobRow) => {
    const { error } = await supabase.from("jobs").update({ is_published: !job.is_published }).eq("id", job.id);
    if (error) toast.error("Could not change the job visibility."); else { toast.success(job.is_published ? "Job hidden from public listings." : "Job published."); await loadAll(); }
  };
  const deleteJob = async () => {
    if (!jobToDelete || deletingJob) return;
    setDeletingJob(true);
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobToDelete.id);
      if (error) throw error;
      setJobToDelete(null);
      toast.success("Job deleted.");
      await loadAll();
    } catch {
      toast.error("Could not delete this job.");
    } finally {
      setDeletingJob(false);
    }
  };
  const updateApp = async (id: string, status: string) => {
    const feedback = window.prompt("Optional feedback for the applicant:") || null;
    const { data, error } = await supabase.rpc("update_application_review", { p_application_id: id, p_status: status, ...(feedback ? { p_feedback: feedback } : {}) });
    if (!data || error) toast.error("Could not update the application."); else { toast.success("Application updated."); await loadAll(); }
  };
  const updateStatus = async (table: "job_seekers" | "employer_requests", id: string, status: string) => {
    const rpc = table === "job_seekers" ? "update_job_seeker_status" : "update_employer_request_status";
    const args = table === "job_seekers" ? { p_id: id, p_status: status } : { p_id: id, p_status: status };
    const { data, error } = await supabase.rpc(rpc, args);
    if (!data || error) toast.error("Could not update the status."); else { toast.success("Status updated."); await loadAll(); }
  };
  const saveContent = async () => {
    const results = await Promise.all(contents.map(({ key, value }) => supabase.from("site_content").update({ value }).eq("key", key)));
    if (results.some((result) => result.error)) toast.error("Some site content could not be saved."); else toast.success("Site content saved.");
    await loadAll();
  };
  const exportCsv = () => {
    const rows = applications.filter((app) => (appStatus === "all" || app.status === appStatus) && (!appSearch || `${app.full_name} ${app.email} ${app.job?.title ?? ""}`.toLowerCase().includes(appSearch.toLowerCase())));
    const data = [["Name", "Email", "Phone", "Job", "Status", "Applied"], ...rows.map((app) => [app.full_name, app.email, app.phone, app.job?.title ?? "", app.status, app.created_at])];
    const csv = data.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "fawzie-applications.csv"; anchor.click(); URL.revokeObjectURL(url);
  };
  const signOutAdmin = async () => { await signOut(); void navigate({ to: "/admin" }); };

  if (loading || checking || busy && isAdmin) return <div className="grid min-h-[60vh] place-items-center"><LoaderCircle className="size-8 animate-spin text-primary" /></div>;
  if (!session) return null;
  if (!isAdmin) return (
    <section className="mx-auto my-16 max-w-md rounded-xl border border-border bg-card p-6 text-center">
      <h1 className="font-heading text-2xl font-semibold">Staff access</h1>
      <p role="status" className="mt-3 text-sm text-muted-foreground">
        {accessError ? "We couldn’t check your staff access. Refresh the page to try again." : "A Fawzie administrator must grant you dashboard access."}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button asChild variant="outline"><Link to="/contact">Contact Fawzie</Link></Button>
        <Button variant="ghost" onClick={() => void signOutAdmin()}>Sign out</Button>
      </div>
    </section>
  );
  const filtered = applications.filter((app) => (appStatus === "all" || app.status === appStatus) && (!appSearch || `${app.full_name} ${app.email} ${app.job?.title ?? ""}`.toLowerCase().includes(appSearch.toLowerCase())));
  const tabs = canManageAdmins ? [...ADMIN_TABS, ADMIN_ACCESS_TAB] : ADMIN_TABS;
  const currentTab = tabs.find((tab) => tab.value === activeTab) ?? ADMIN_TABS[0];
  const stats: Array<{ icon: LucideIcon; label: string; count: number; tab: string }> = [
    { icon: BriefcaseBusiness, label: "Job listings", count: jobs.length, tab: "jobs" },
    { icon: FileText, label: "Applications", count: applications.length, tab: "applications" },
    { icon: Users, label: "Job seekers", count: seekers.length, tab: "seekers" },
    { icon: Building2, label: "Employer requests", count: employers.length, tab: "employers" },
    { icon: AlertTriangle, label: "Urgent reports", count: reports.length, tab: "reports" },
  ];

  return <>
    <Tabs
      value={currentTab.value}
      onValueChange={setActiveTab}
      orientation="vertical"
      className="grid min-h-dvh items-start gap-0 bg-muted/55 lg:grid-cols-[16rem_minmax(0,1fr)]"
    >
      <aside className="flex min-w-0 flex-col bg-[#102439] text-slate-100 lg:sticky lg:top-0 lg:h-dvh">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 lg:py-6">
          <img src="/fawzie-logo.jpeg" alt="" className="size-10 shrink-0 rounded-lg bg-white object-contain" />
          <div className="min-w-0">
            <p className="font-heading font-semibold">Fawzie Recruitment</p>
            <p className="text-xs text-slate-300">Staff workspace</p>
          </div>
          <Button variant="ghost" size="icon" className="ms-auto text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="Sign out" onClick={() => void signOutAdmin()}><LogOut className="size-4" /></Button>
        </div>
        <div className="px-3 py-3 lg:flex-1 lg:overflow-y-auto lg:py-5">
          <Label htmlFor="admin-section" className="sr-only lg:hidden">Dashboard section</Label>
          <select id="admin-section" value={currentTab.value} onChange={(event) => setActiveTab(event.target.value)} className="w-full rounded-lg border border-white/20 bg-[#102439] px-3 py-2.5 text-sm lg:hidden">
            {tabs.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          <TabsList aria-label="Recruitment sections" className="hidden h-auto w-full flex-col items-stretch gap-1 bg-transparent p-0 lg:flex">
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-slate-200 shadow-none hover:bg-white/10 data-[state=active]:bg-teal-300/15 data-[state=active]:text-teal-100 data-[state=active]:shadow-none">
                <Icon className="size-4 shrink-0" />{label}
                {value === "reports" && reports.length > 0 && <span className="ms-auto rounded-full bg-white/10 px-2 text-xs">{reports.length}</span>}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="mb-3 flex items-center gap-2">
            <UserRound className="size-4 shrink-0 text-slate-300" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium" title={session.user.email}>{session.user.email}</p>
              <p className="text-xs text-slate-300">{canManageAdmins ? "Owner" : "Administrator"}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => void signOutAdmin()} className="w-full justify-start text-slate-100 hover:bg-white/10 hover:text-white"><LogOut className="size-4" />Sign out</Button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 md:px-8">
            <div>
              <h1 className="font-heading text-3xl font-semibold tracking-tight">{currentTab.label}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{currentTab.description}</p>
            </div>
            <Button asChild variant="outline" size="sm"><Link to="/">View site</Link></Button>
          </div>
        </header>
        <div className="admin-panels mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
          <TabsContent value="overview">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {stats.map(({ icon: Icon, label, count, tab }) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} className="rounded-xl border border-border bg-card p-4 text-start transition-colors hover:border-primary/60">
                  <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></span>
                  <span className="mt-4 block font-heading text-3xl font-semibold tabular-nums">{count}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="jobs">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold">All listings <span className="ms-1 text-sm font-normal text-muted-foreground">({jobs.length})</span></h2>
              <Button onClick={openNew}><Plus className="size-4" />Add job</Button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[34rem] text-start text-sm">
                <thead className="bg-muted/70 text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start font-medium">Job</th>
                    <th scope="col" className="px-4 py-3 text-start font-medium">Location</th>
                    <th scope="col" className="px-4 py-3 text-start font-medium">Status</th>
                    <th scope="col" className="px-4 py-3 text-end font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3"><p className="font-semibold">{job.title}</p><p className="text-xs text-muted-foreground">{job.category}</p></td>
                      <td className="px-4 py-3 text-muted-foreground">{job.location}, {job.country}<p className="text-xs">{job.job_type}</p></td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${job.is_published ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>{job.is_published ? "Published" : "Hidden"}</span></td>
                      <td className="px-4 py-3"><div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" aria-label={`Edit ${job.title}`} onClick={() => openEdit(job)}><Pencil className="size-4" /></Button>
                        <Button size="icon" variant="ghost" aria-label={`${job.is_published ? "Hide" : "Publish"} ${job.title}`} onClick={() => void toggleJob(job)}>{job.is_published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button>
                        <Button size="icon" variant="ghost" className="text-destructive" aria-label={`Delete ${job.title}`} onClick={() => setJobToDelete(job)}><Trash2 className="size-4" /></Button>
                      </div></td>
                    </tr>
                  ))}
                  {jobs.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">No jobs yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </TabsContent>
      <TabsContent value="applications"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-heading text-lg font-semibold">Applications</h2><p className="text-sm text-muted-foreground">Update the applicant’s status; the applicant will see the change.</p></div><Button variant="outline" onClick={exportCsv}><Download className="mr-2 size-4" />Export CSV</Button></div><div className="mb-4 flex flex-wrap gap-2"><div className="relative min-w-52 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search applicants" value={appSearch} onChange={(event) => setAppSearch(event.target.value)} /></div><select className="fawzie-input w-auto min-w-36" value={appStatus} onChange={(event) => setAppStatus(event.target.value)}><option value="all">All statuses</option>{APP_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div><div className="divide-y divide-border border-y border-border">{filtered.map((app) => <article key={app.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><h3 className="font-medium">{app.full_name}</h3><p className="text-xs text-muted-foreground">{app.email} · {app.phone}</p><p className="mt-1 text-xs text-muted-foreground">{app.job?.title ?? "Job listing unavailable"} · {new Date(app.created_at).toLocaleDateString()}</p>{app.cover_note && <p className="mt-2 text-sm text-muted-foreground">{app.cover_note}</p>}</div><StatusSelect value={app.status} options={APP_STATUSES} onChange={(status) => void updateApp(app.id, status)} /></article>)}{filtered.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No applications match.</p>}</div></TabsContent>
      <TabsContent value="seekers"><h2 className="mb-4 font-heading text-lg font-semibold">Job seeker profiles</h2><div className="divide-y divide-border border-y border-border">{seekers.map((seeker) => <article key={seeker.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><h3 className="font-medium">{seeker.full_name}</h3><p className="text-xs text-muted-foreground">{seeker.email} · {seeker.phone}</p><p className="mt-1 text-sm text-muted-foreground">{seeker.skills || "No skills listed"}</p></div><div className="flex flex-wrap items-center gap-2">{seeker.cv_path && <PrivateFile path={seeker.cv_path} label="Open CV" />}{seeker.passport_path && <PrivateFile path={seeker.passport_path} label="Open passport" />}<StatusSelect value={seeker.status} options={APP_STATUSES} onChange={(status) => void updateStatus("job_seekers", seeker.id, status)} /></div></article>)}{seekers.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No profiles yet.</p>}</div></TabsContent>
      <TabsContent value="employers"><h2 className="mb-4 font-heading text-lg font-semibold">Employer requests</h2><div className="divide-y divide-border border-y border-border">{employers.map((item) => <article key={item.id} className="py-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start"><div className="min-w-0 flex-1"><h3 className="font-medium">{item.company_name}</h3><p className="text-xs text-muted-foreground">{item.contact_name} · {item.email} · {item.phone}</p><p className="mt-2 text-sm">{item.roles}</p><p className="mt-1 text-xs text-muted-foreground">{item.num_workers} worker(s) · {item.location}{item.timeline ? ` · ${item.timeline}` : ""}</p>{item.notes && <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>}</div><StatusSelect value={item.status} options={EMPLOYER_STATUSES} onChange={(status) => void updateStatus("employer_requests", item.id, status)} /></div></article>)}{employers.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No requests yet.</p>}</div></TabsContent>
      <TabsContent value="reports"><h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold"><AlertTriangle className="size-5 text-destructive" />Urgent support reports</h2><div className="divide-y divide-border border-y border-border">{reports.map((report) => <article key={report.id} className="border-l-2 border-destructive py-4 pl-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{report.full_name}</h3><p className="text-sm text-muted-foreground">{report.country}{report.employer ? ` · ${report.employer}` : ""} · {report.phone}</p></div><a href={`tel:${report.phone}`}><Button variant="outline" size="sm"><Phone className="mr-2 size-4" />Call</Button></a></div><p className="mt-3 whitespace-pre-line text-sm">{report.situation}</p><time className="mt-2 block text-xs text-muted-foreground">{new Date(report.created_at).toLocaleString()}</time></article>)}{reports.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No reports. Urgent reports will appear here.</p>}</div></TabsContent>
      <TabsContent value="content"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-heading text-lg font-semibold">Public site content</h2><p className="text-sm text-muted-foreground">Edit current content entries. Values appear on public pages where connected.</p></div><Button onClick={() => void saveContent()}><Save className="mr-2 size-4" />Save changes</Button></div><div className="space-y-4">{contents.map((entry, index) => <div key={entry.key} className="grid gap-2 border-t border-border py-4 sm:grid-cols-[minmax(160px,1fr)_3fr]"><Label htmlFor={`content-${entry.key}`} className="break-all">{entry.key}</Label><Textarea id={`content-${entry.key}`} rows={2} value={entry.value} onChange={(event) => setContents((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} /></div>)}{contents.length === 0 && <p className="border-y border-border py-8 text-sm text-muted-foreground">No editable site content has been configured yet.</p>}</div></TabsContent>
      {canManageAdmins && <TabsContent value="admin-access"><AdminAccessManagement /></TabsContent>}
        </div>
      </div>
    </Tabs>
    <AlertDialog open={jobToDelete !== null} onOpenChange={(open) => { if (!open && !deletingJob) setJobToDelete(null); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {jobToDelete?.title}?</AlertDialogTitle>
          <AlertDialogDescription>This permanently removes the job listing and all applications attached to it.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletingJob}>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={deletingJob} onClick={() => void deleteJob()}>{deletingJob ? "Deleting…" : "Delete job"}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Dialog open={jobDialog} onOpenChange={setJobDialog}><DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle className="font-heading">{editing ? "Edit job" : "Add a job"}</DialogTitle></DialogHeader><div className="grid gap-4 sm:grid-cols-2"><Field label="Job title"><Input value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} /></Field><Field label="Category"><select className="fawzie-input" value={jobForm.category} onChange={(event) => setJobForm({ ...jobForm, category: event.target.value })}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></Field><Field label="Location"><Input value={jobForm.location} onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })} /></Field><Field label="Country"><Input value={jobForm.country} onChange={(event) => setJobForm({ ...jobForm, country: event.target.value })} /></Field><Field label="Job type"><select className="fawzie-input" value={jobForm.job_type} onChange={(event) => setJobForm({ ...jobForm, job_type: event.target.value })}><option>Kenya</option><option>Overseas</option></select></Field><Field label="Employer"><Input value={jobForm.employer} onChange={(event) => setJobForm({ ...jobForm, employer: event.target.value })} /></Field><Field label="Currency"><Input value={jobForm.currency} onChange={(event) => setJobForm({ ...jobForm, currency: event.target.value })} /></Field><Field label="Minimum salary"><Input type="number" value={jobForm.salary_min ?? ""} onChange={(event) => setJobForm({ ...jobForm, salary_min: event.target.value ? Number(event.target.value) : null })} /></Field><Field label="Maximum salary"><Input type="number" value={jobForm.salary_max ?? ""} onChange={(event) => setJobForm({ ...jobForm, salary_max: event.target.value ? Number(event.target.value) : null })} /></Field><div className="sm:col-span-2"><Field label="Description"><Textarea rows={5} value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} /></Field></div><div className="sm:col-span-2"><Field label="Requirements"><Textarea rows={3} value={jobForm.requirements} onChange={(event) => setJobForm({ ...jobForm, requirements: event.target.value })} /></Field></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={jobForm.is_published} onChange={(event) => setJobForm({ ...jobForm, is_published: event.target.checked })} className="size-4 accent-primary" />Published</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={jobForm.is_sample} onChange={(event) => setJobForm({ ...jobForm, is_sample: event.target.checked })} className="size-4 accent-primary" />Sample listing</label></div><DialogFooter><Button variant="outline" onClick={() => setJobDialog(false)}>Cancel</Button><Button disabled={savingJob} onClick={() => void saveJob()}>{savingJob ? "Saving…" : "Save job"}</Button></DialogFooter></DialogContent></Dialog>
  </>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }
function StatusSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) { return <select aria-label="Update status" className="fawzie-input w-auto min-w-32" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((status) => <option key={status}>{status}</option>)}</select>; }
function PrivateFile({ path, label }: { path: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const open = async () => { setBusy(true); const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 60); setBusy(false); if (error || !data?.signedUrl) toast.error("Could not open this private file."); else window.open(data.signedUrl, "_blank", "noopener,noreferrer"); };
  return <Button size="sm" variant="outline" disabled={busy} onClick={() => void open()}>{busy ? <LoaderCircle className="mr-1 size-3 animate-spin" /> : <Eye className="mr-1 size-3" />}{label}</Button>;
}