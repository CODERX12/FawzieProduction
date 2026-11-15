import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { BriefcaseBusiness, Heart, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageBanner, SectionHeading } from "@/components/fawzie/ui";
import { JobCard } from "@/components/fawzie/home-page";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type Job } from "@/lib/fawzie";
import { toast } from "sonner";
const jobHero = { url: "/images/Bildschirmfoto_2026-11-07_um_10.32.01.png" };

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [
    { title: "Browse Jobs | Fawzie Recruitment" },
    { name: "description", content: "Search verified Kenyan and Gulf job opportunities with Fawzie Recruitment." },
    { property: "og:title", content: "Browse Jobs | Fawzie Recruitment" },
    { property: "og:description", content: "Search verified Kenyan and Gulf job opportunities." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: JobsPage,
});

function JobsPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { q?: string; type?: string; cat?: string };
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [filters, setFilters] = useState({ q: search.q ?? "", type: search.type ?? "all", cat: search.cat ?? "all", salary: "any", sort: "newest" });

  useEffect(() => {
    try { setSaved(JSON.parse(window.localStorage.getItem("fawzie-saved-jobs") ?? "[]") as string[]); } catch { setSaved([]); }
  }, []);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true); setError(false);
      let query = supabase.from("jobs").select("*").eq("is_published", true);
      if (filters.type !== "all") query = query.eq("job_type", filters.type);
      if (filters.cat !== "all") query = query.eq("category", filters.cat);
      if (filters.q.trim()) query = query.ilike("title", `%${filters.q.trim()}%`);
      query = filters.sort === "salary" ? query.order("salary_max", { ascending: false }) : query.order("posted_at", { ascending: false });
      const { data, error: requestError } = await query;
      if (alive) { setJobs((data ?? []) as Job[]); setError(Boolean(requestError)); setLoading(false); }
    };
    void load(); return () => { alive = false; };
  }, [filters]);

  const filtered = useMemo(() => jobs.filter((job) => {
    if (filters.salary !== "any" && job.salary_max) {
      const bounds: Record<string, [number, number]> = { under20: [0, 20000], "20-50": [20000, 50000], "50-100": [50000, 100000], over100: [100000, 99999999] };
      const range = bounds[filters.salary]; if (range && (job.salary_max < range[0] || job.salary_max > range[1])) return false;
    }
    return true;
  }), [jobs, filters.salary]);

  const toggleSave = (id: string) => {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    setSaved(next); window.localStorage.setItem("fawzie-saved-jobs", JSON.stringify(next)); toast.success(saved.includes(id) ? "Removed from saved jobs" : "Job saved");
  };
  const clear = () => setFilters({ q: "", type: "all", cat: "all", salary: "any", sort: "newest" });

  return <>
    <PageBanner title="Browse jobs" description="Find trusted local and overseas opportunities. Search listings by role, destination and category." image={jobHero.url}>
      <form onSubmit={(event) => { event.preventDefault(); void navigate({ to: "/jobs", search: { q: filters.q } }); }} className="flex max-w-2xl gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search job title" placeholder="Search job title…" value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))} className="h-11 border-primary-foreground/20 bg-background pl-10 text-foreground" /></div>
        <Button type="button" variant="outline" className="h-11 gap-2 border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal className="size-4" />Filters</Button>
      </form>
    </PageBanner>
    <section className="py-8 md:py-12"><div className="mx-auto max-w-7xl px-4 md:px-8">
      {filtersOpen && <div className="mb-7 grid gap-4 border-b border-border pb-6 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium text-muted-foreground">Job type<select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} className="mt-1.5 h-10 w-full rounded border border-input bg-background px-3 text-sm text-foreground"><option value="all">All types</option><option>Kenya</option><option>Overseas</option></select></label>
        <label className="text-xs font-medium text-muted-foreground">Category<select value={filters.cat} onChange={(event) => setFilters({ ...filters, cat: event.target.value })} className="mt-1.5 h-10 w-full rounded border border-input bg-background px-3 text-sm text-foreground"><option value="all">All categories</option>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-xs font-medium text-muted-foreground">Monthly salary<select value={filters.salary} onChange={(event) => setFilters({ ...filters, salary: event.target.value })} className="mt-1.5 h-10 w-full rounded border border-input bg-background px-3 text-sm text-foreground"><option value="any">Any salary</option><option value="under20">Under 20K</option><option value="20-50">20K–50K</option><option value="50-100">50K–100K</option><option value="over100">100K+</option></select></label>
        <label className="text-xs font-medium text-muted-foreground">Sort by<select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })} className="mt-1.5 h-10 w-full rounded border border-input bg-background px-3 text-sm text-foreground"><option value="newest">Newest first</option><option value="salary">Highest salary</option></select></label>
        <div className="sm:col-span-2 lg:col-span-4"><Button type="button" variant="ghost" size="sm" onClick={clear}><X className="mr-1 size-4" />Clear filters</Button></div>
      </div>}
      <div className="mb-5 flex items-center justify-between"><p className="text-sm text-muted-foreground">{loading ? "Loading jobs…" : `${filtered.length} job${filtered.length === 1 ? "" : "s"} found`}</p><Link to="/job-seekers" className="text-sm text-primary underline-offset-4 hover:underline">Register your profile</Link></div>
      {loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-48 animate-pulse bg-muted" />)}</div> : error ? <div className="border-y border-border py-16 text-center"><BriefcaseBusiness className="mx-auto size-9 text-destructive/70" /><h2 className="mt-4 font-heading text-xl font-semibold">Jobs are temporarily unavailable</h2><Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Try again</Button></div> : filtered.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((job) => <div key={job.id} className="relative"><JobCard job={job} /><Button size="icon" variant="ghost" aria-label={saved.includes(job.id) ? "Remove saved job" : "Save job"} className="absolute right-3 top-3 z-10 bg-card/90 shadow-sm hover:bg-card" onClick={() => toggleSave(job.id)}><Heart className={`size-4 ${saved.includes(job.id) ? "fill-destructive text-destructive" : ""}`} /></Button></div>)}</div> : <div className="border-y border-border py-16 text-center"><MapPin className="mx-auto size-9 text-muted-foreground/50" /><h2 className="mt-4 font-heading text-xl font-semibold">No jobs match your search</h2><p className="mt-2 text-sm text-muted-foreground">Try changing your filters or search for another role.</p><Button variant="outline" className="mt-4" onClick={clear}>Clear filters</Button></div>}
    </div></section>
  </>;
}