import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/fawzie";

export function PageBanner({ eyebrow, title, description, image, children }: { eyebrow?: string; title: string; description?: string; image: string; children?: ReactNode }) {
  return <section className="relative isolate min-h-[250px] overflow-hidden border-b border-border bg-slate-950 text-white">
    <img src={image} alt="" fetchPriority="high" className="absolute inset-y-0 end-0 z-0 h-full w-full object-cover object-right md:w-[62%] rtl:object-left" />
    <div aria-hidden="true" className="absolute inset-0 z-10 bg-slate-950/80 md:bg-transparent md:bg-linear-to-r md:from-slate-950 md:via-slate-950/85 md:to-slate-950/20 rtl:md:bg-linear-to-l" />
    <div className="relative z-20 mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      {eyebrow && <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/85"><BadgeCheck className="size-4" />{eyebrow}</p>}
      <h1 className="max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  </section>;
}

export function SectionHeading({ eyebrow, title, text, className }: { eyebrow?: string; title: string; text?: string; className?: string }) {
  return <div className={cn("mb-8 max-w-2xl", className)}>{eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}<h2 className="text-balance font-heading text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>{text && <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>}</div>;
}

export function TrustNote({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-3 border-l-2 border-accent bg-secondary/40 px-4 py-3 text-sm text-secondary-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /><p>{children}</p></div>;
}

export function Callout({ title, description, link = "/get-help", action = "Get help now" }: { title: string; description: string; link?: string; action?: string }) {
  return <Card className="border-destructive/30"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-heading font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></div><Link to={link}><Button variant="outline" className="gap-2">{action}<ArrowRight className="size-4" /></Button></Link></CardContent></Card>;
}

export function LicenceLine() {
  return <p className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 text-accent" />Check agency details · <a href={BRAND.licenceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">view on NEAIMS</a></p>;
}

export function formatSalary(currency: string, min: number | null, max: number | null) {
  if (!max && !min) return "Salary shared by employer";
  const value = [min, max].filter((item): item is number => item !== null).map((item) => item.toLocaleString()).join(" – ");
  return `${currency} ${value}`;
}