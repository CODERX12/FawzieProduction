import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, CheckCircle2, ChevronLeft, ChevronRight, Globe2, HeartHandshake, MapPin, ShieldCheck, Star, Users, UserRoundCheck, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { BRAND, CATEGORIES, COUNTRIES, type Job } from "@/lib/fawzie";
import { useLanguage } from "@/components/fawzie/providers";
import { formatSalary, SectionHeading, TrustNote } from "@/components/fawzie/ui";
const hero1 = { url: "/images/Bildschirmfoto_2026-11-07_um_10.32.01.png" };
const hero2 = { url: "/images/Bildschirmfoto_2026-11-07_um_10.30.12.png" };
const hero3 = { url: "/images/Bildschirmfoto_2026-11-07_um_10.29.55.png" };
const journey = { url: "/images/pascal-meier-UYiesSO4FiM-unsplash.jpg" };

const heroImages = [hero1.url, hero2.url, hero3.url];
const steps = [
  { icon: UserRoundCheck, title: "Register", text: "Create your profile and tell us about your skills and experience." },
  { icon: BadgeCheck, title: "Screening", text: "We verify your documents and match your skills to the right role." },
  { icon: HeartHandshake, title: "Match & contract", text: "We connect you with a verified employer and review your contract together." },
  { icon: Globe2, title: "Travel & start work", text: "We support your travel and make sure you arrive safely to start your new job." },
];
const faqs = [
  ["Do I pay for a job offer?", "No. Do not pay for a job offer or placement before you have a signed contract. Report anyone who asks for money before a contract."],
  ["How do I check an agency?", "Review current agency details on NEAIMS and confirm its physical office address."],
  ["Can I apply for jobs without a profile?", "Yes. You can submit an application directly from a job listing. Creating a profile helps us understand your skills and preferred destination."],
  ["What should I do if I need urgent help abroad?", "Call or WhatsApp our team, or use the urgent report form. If you are in immediate physical danger, contact local emergency services or your embassy."],
];
const metrics: Array<{ icon: LucideIcon; value: string; label: string }> = [
  { icon: BriefcaseBusiness, value: "0", label: "Featured listings" },
  { icon: Globe2, value: String(COUNTRIES.length), label: "Destination countries" },
  { icon: Users, value: String(CATEGORIES.length), label: "Job categories" },
];

export function HomePage() {
  const { lang, t } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);
  const [content, setContent] = useState<Record<string, string>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let alive = true;
    void supabase.from("site_content").select("key, value").then(({ data }) => {
      if (alive && data) setContent(Object.fromEntries(data.map((item) => [item.key, item.value])));
    });
    void supabase.from("jobs").select("*").eq("is_published", true).order("posted_at", { ascending: false }).limit(8).then(({ data }) => {
      if (alive) setJobs((data ?? []) as Job[]);
    });
    return () => { alive = false; };
  }, []);

  return <>
    <section className="home-hero border-b border-border">
      <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-16">
        <div className="min-w-0">
          <a href={BRAND.licenceUrl} target="_blank" rel="noreferrer" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
            <ShieldCheck className="size-4 shrink-0" />
            Check agency details on NEAIMS
          </a>
          <h1 className="hero-title max-w-xl font-heading font-semibold">{lang === "en" ? content["hero_title"] || t("hero.title") : t("hero.title")}</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">{lang === "en" ? content["hero_subtitle"] || t("hero.subtitle") : t("hero.subtitle")}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/jobs">{t("cta.browse")}<ArrowRight className="size-4 rtl:rotate-180" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/job-seekers">{t("cta.register")}</Link></Button>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
            {["No fees before contract", "Verified employers", "Safe migration support"].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 shrink-0 text-primary" />{item}</li>
            ))}
          </ul>
        </div>
        <div className="relative isolate aspect-[5/4] overflow-hidden rounded-2xl bg-muted sm:aspect-[4/3] lg:aspect-[5/4]">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroImages[activeImage]}
              src={heroImages[activeImage]}
              alt="Illustration of overseas recruitment and travel"
              fetchPriority={activeImage === 0 ? "high" : "auto"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4 }}
              className="absolute inset-0 size-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center">
            <div className="flex rounded-full bg-foreground/85 px-1">
              {heroImages.map((image, index) => (
                <button key={image} type="button" onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`} aria-pressed={index === activeImage} className="grid size-9 place-items-center rounded-full">
                  <span className={`h-1.5 rounded-full bg-background transition-[width,opacity] ${index === activeImage ? "w-4" : "w-1.5 opacity-60"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-border px-3 py-3 sm:px-8">
        {metrics.map(({ icon: Icon, value: initialValue, label }) => { const value = label === "Featured listings" ? String(jobs.length) : initialValue; return <div key={label} className="flex flex-col items-center justify-center gap-2 px-2 py-3 text-center sm:flex-row sm:gap-3 sm:text-start"><Icon className="size-5 text-primary" /><div><p className="font-heading text-2xl font-semibold leading-none">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div></div>; })}
      </div>
    </section>

    <section className="py-16 md:py-20"><div className="mx-auto max-w-7xl px-4 md:px-8"><SectionHeading title="How it works" text="From registration to your first day at work — we guide you every step of the way." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-xl border border-border bg-card p-5 sm:p-6"><span className="mb-5 grid size-10 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-5" /></span><h3 className="font-heading font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}</div></div></section>

    <section className="px-4 pb-12 md:px-8 md:pb-16"><figure className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl"><img loading="lazy" src={journey.url} alt="An airplane approaching a runway beyond distant mountains" className="h-64 w-full object-cover md:h-[390px]" /><figcaption className="absolute inset-x-0 bottom-0 bg-image-caption p-5 font-heading text-xl font-semibold text-primary-foreground md:p-8 md:text-2xl">Your next opportunity can take you further.</figcaption></figure></section>

    <RecruitmentRoles />

    <section className="bg-muted/50 py-16 md:py-20"><div className="mx-auto max-w-7xl px-4 md:px-8"><div className="mb-8 flex items-end justify-between gap-4"><SectionHeading title="Latest jobs" text="Explore trusted opportunities selected by our recruitment team." className="mb-0" /><Link to="/jobs" className="hidden sm:block"><Button variant="outline" className="gap-2">All jobs<ArrowRight className="size-4" /></Button></Link></div>{jobs.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{jobs.slice(0, 4).map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="rounded-xl border border-border bg-card px-5 py-12 text-center"><BriefcaseBusiness className="mx-auto size-9 text-muted-foreground/50" /><p className="mt-3 text-sm text-muted-foreground">No current listings. Register your profile to hear about suitable opportunities.</p><Link to="/job-seekers" className="mt-4 inline-flex"><Button variant="outline">Register as a job seeker</Button></Link></div>}<div className="mt-6 text-center sm:hidden"><Link to="/jobs"><Button variant="outline">View all jobs</Button></Link></div></div></section>

    <TestimonialsSection />

    <section className="py-16 md:py-20"><div className="mx-auto max-w-7xl px-4 md:px-8"><SectionHeading title="Destination countries" text="Typical roles and what to expect in the places where we work." /><div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">{COUNTRIES.map((country) => <div key={country.code} className="rounded-xl border border-border bg-card p-4 sm:p-6"><span className="text-3xl">{country.flag}</span><h3 className="mt-3 font-heading text-lg font-semibold">{country.name}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{country.roles.join(" · ")}</p></div>)}</div></div></section>

    <section className="bg-secondary/30 py-16 md:py-20"><div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[.8fr_1.2fr] md:px-8"><div><SectionHeading title="A safer path to work" text="Our team is committed to transparent opportunities, reviewed contracts and ongoing support for every worker." /><TrustNote>Never pay a placement fee before a signed contract. Review agency details and verify every offer before you travel.</TrustNote><Link to="/safe-migration" className="mt-5 inline-flex"><Button variant="outline" className="gap-2">Read the safe migration guide<ArrowRight className="size-4" /></Button></Link></div><div className="grid gap-5 sm:grid-cols-3"><div><BadgeCheck className="size-7 text-primary" /><h3 className="mt-4 font-heading font-semibold">Verified employers</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">We work with employers whose opportunities can be checked.</p></div><div><HeartHandshake className="size-7 text-primary" /><h3 className="mt-4 font-heading font-semibold">Fair contracts</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Review your terms and ask questions before you sign.</p></div><div><ShieldCheck className="size-7 text-primary" /><h3 className="mt-4 font-heading font-semibold">Ongoing support</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Reach the team before travel and when you need help abroad.</p></div></div></div></section>

    <section className="py-16 md:py-20"><div className="mx-auto max-w-4xl px-4 md:px-8"><SectionHeading title="Frequently asked" /><Accordion type="single" collapsible className="w-full">{faqs.map(([question, answer], index) => <AccordionItem key={question} value={`faq-${index}`}><AccordionTrigger className="text-start text-base font-semibold">{question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>

    <section className="bg-primary py-14 text-primary-foreground md:py-16"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-4 sm:flex-row sm:items-center md:px-8"><div><h2 className="mt-2 max-w-2xl font-heading text-2xl font-bold sm:text-3xl">Looking for work or looking to hire?</h2><p className="mt-3 max-w-xl text-sm text-primary-foreground/80">Fawzie is here to guide the next step safely and clearly.</p></div><div className="flex flex-wrap gap-3"><Link to="/job-seekers"><Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">{t("cta.register")}<ArrowRight className="size-4" /></Button></Link><Link to="/employers"><Button variant="outline" className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">Hire workers</Button></Link></div></div></section>
  </>;
}

const recruitmentRoles = [
  { title: "Cleaners", alt: "Cleaner mopping an office lobby" },
  { title: "Motorcycle riders", alt: "Helmeted courier standing beside a motorcycle" },
  { title: "Domestic workers", alt: "Domestic worker making a bed" },
  { title: "Construction workers", alt: "Construction worker wearing a hard hat and high-visibility vest" },
  { title: "Drivers", alt: "Professional driver at the wheel of a van" },
];

function RecruitmentRoles() {
  return (
    <section className="border-t border-border py-12 md:py-16" aria-labelledby="recruitment-roles-heading">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 id="recruitment-roles-heading" className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">Explore job roles</h2>
          <Button asChild variant="outline"><Link to="/jobs">Browse current jobs<ArrowRight className="size-4 rtl:rotate-180" /></Link></Button>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {recruitmentRoles.map(({ title, alt }, index) => (
            <li key={title} className="min-w-0 overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src="/images/roles/recruitment-roles.webp"
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute top-0 left-0 w-[500%] max-w-none"
                  style={{ transform: `translateX(-${index * 20}%)` }}
                />
              </div>
              <h3 className="px-3 py-4 font-heading text-sm font-semibold sm:text-base">{title}</h3>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">AI-generated images illustrate the roles.</p>
      </div>
    </section>
  );
}

type Testimonial = { id: string; name: string; role: string; country: string; quote: string; rating: number; is_sample: boolean };

function TestimonialsSection() {
  const [stories, setStories] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    let alive = true;
    void supabase.from("testimonials").select("id,name,role,country,quote,rating,is_sample").order("created_at").then(({ data }) => {
      if (alive) setStories((data ?? []) as Testimonial[]);
    });
    return () => { alive = false; };
  }, []);
  if (stories.length === 0) return null;
  const story = stories[active % stories.length];
  if (!story) return null;
  return <section className="bg-muted/40 py-14 md:py-20"><div className="mx-auto max-w-4xl px-4 text-center md:px-8"><SectionHeading eyebrow="Stories" title="Worker stories" text="Experiences shared by workers in our community." className="mx-auto" /><div className="border-y border-border py-8"><div className="mb-4 flex justify-center gap-1">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-4 ${index < story.rating ? "fill-current text-accent" : "text-muted-foreground/30"}`} />)}</div><blockquote className="mx-auto max-w-2xl text-lg leading-relaxed">“{story.quote}”</blockquote><p className="mt-5 font-semibold">{story.name}</p><p className="text-sm text-muted-foreground">{story.role} · {story.country}</p>{story.is_sample && <Badge variant="outline" className="mt-3">Sample story</Badge>}</div>{stories.length > 1 && <div className="mt-5 flex items-center justify-center gap-3"><Button variant="outline" size="icon" aria-label="Previous story" onClick={() => setActive((current) => (current - 1 + stories.length) % stories.length)}><ChevronLeft className="size-4" /></Button><span className="text-xs text-muted-foreground">{active + 1} of {stories.length}</span><Button variant="outline" size="icon" aria-label="Next story" onClick={() => setActive((current) => (current + 1) % stories.length)}><ChevronRight className="size-4" /></Button></div>}</div></section>;
}

export function JobCard({ job }: { job: Job }) {
  return <Link to="/jobs/$id" params={{ id: job.id }} className="group block"><Card className="h-full border-border/80 shadow-none transition-colors group-hover:border-primary/50"><CardHeader className="pb-2"><div className="flex items-center justify-between gap-2"><Badge variant={job.job_type === "Overseas" ? "default" : "secondary"}>{job.job_type}</Badge>{job.is_sample && <Badge variant="outline">Sample</Badge>}</div><h3 className="mt-2 line-clamp-2 font-heading text-base font-semibold group-hover:text-primary">{job.title}</h3></CardHeader><CardContent className="space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><MapPin className="size-4 shrink-0" />{job.location}, {job.country}</p><p className="flex items-center gap-2"><BriefcaseBusiness className="size-4 shrink-0" />{job.category}</p>{job.salary_max && <p className="pt-1 font-semibold text-foreground">{formatSalary(job.currency, job.salary_min, job.salary_max)} / month</p>}</CardContent></Card></Link>;
}

export function FeaturedJobs({ jobs }: { jobs: Job[] }) {
  const [index, setIndex] = useState(0);
  if (!jobs.length) return null;
  const visible = jobs.slice(index, index + 3);
  return <div><div className="grid gap-4 md:grid-cols-3">{visible.map((job) => <JobCard key={job.id} job={job} />)}</div><div className="mt-4 flex justify-end gap-2"><Button variant="outline" size="icon" aria-label="Previous jobs" onClick={() => setIndex(Math.max(0, index - 1))}><ChevronLeft className="size-4" /></Button><Button variant="outline" size="icon" aria-label="Next jobs" onClick={() => setIndex(Math.min(Math.max(0, jobs.length - 3), index + 1))}><ChevronRight className="size-4" /></Button></div></div>;
}