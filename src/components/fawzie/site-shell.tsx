import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, Globe2, LogOut, Menu, MessageCircle, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountProvider, LanguageProvider, useAccount, useLanguage } from "@/components/fawzie/providers";
import { BRAND, WHATSAPP_LINK } from "@/lib/fawzie";
const logo = { url: "/fawzie-logo.jpeg" };

const links = [
  ["/", "nav.home"], ["/jobs", "nav.jobs"], ["/job-seekers", "nav.seekers"],
  ["/employers", "nav.employers"], ["/safe-migration", "nav.migration"],
  ["/get-help", "nav.help"], ["/about", "nav.about"], ["/contact", "nav.contact"],
] as const;

export function RecruitmentShell({ children }: { children: React.ReactNode }) {
  return <LanguageProvider><AccountProvider><SiteFrame>{children}</SiteFrame></AccountProvider></LanguageProvider>;
}

function SiteFrame({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { session } = useAccount();
  const workspace = pathname.startsWith("/admin") || Boolean(session && ["/job-seekers", "/employers"].includes(pathname.replace(/\/$/, "")));
  return <div className="min-h-screen flex flex-col">{!workspace && <SiteHeader />}<main className={workspace ? "flex-1" : "flex-1 pb-20 md:pb-0"}>{children}</main>{!workspace && <><SiteFooter /><MobileActions /></>}</div>;
}

function SiteHeader() {
  const { pathname } = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { session, loading, signOut } = useAccount();
  const [open, setOpen] = useState(false);
  const cycleLanguage = () => setLang(lang === "en" ? "sw" : lang === "sw" ? "ar" : "en");
  return <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-[76px] md:px-8">
      <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3" onClick={() => setOpen(false)}>
        <span className="grid size-10 place-items-center sm:size-12 overflow-hidden rounded-md bg-card shadow-sm ring-1 ring-border"><img src={logo.url} alt="Fawzie Recruitment logo" className="h-full w-full object-contain" /></span>
        <span className="block"><strong className="block font-heading text-sm font-semibold leading-tight sm:text-base">Fawzie Recruitment</strong><span className="hidden text-xs text-muted-foreground sm:block">Kenyan recruitment agency</span></span>
      </Link>
      <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
        {links.map(([href, label]) => <Link key={href} to={href} className={`rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${pathname === href ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{t(label)}</Link>)}
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={cycleLanguage} aria-label="Change language" title="Change language" className="gap-1.5"><Globe2 className="size-4" /><span className="uppercase">{lang}</span></Button>
        <Link to="/job-seekers" className="hidden md:inline-flex"><Button size="sm">{session ? "My account" : loading ? "…" : "Sign in"}</Button></Link>
        {session && <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Sign out" title="Sign out" onClick={() => void signOut()}><LogOut className="size-4" /></Button>}
        <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</Button>
      </div>
    </div>
    {open && <nav className="absolute inset-x-0 top-full flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto border-b border-border bg-background p-4 shadow-lg xl:hidden" aria-label="Mobile navigation">
      {links.map(([href, label]) => <Link key={href} to={href} onClick={() => setOpen(false)} className={`rounded px-4 py-3 text-sm ${pathname === href ? "bg-secondary text-primary" : "hover:bg-muted"}`}>{t(label)}</Link>)}
      <Link to="/job-seekers" onClick={() => setOpen(false)} className="mt-2"><Button className="w-full">{session ? "My account" : loading ? "Checking account…" : "Sign in"}</Button></Link>
      {session && <Button variant="outline" className="mt-1 w-full" onClick={() => void signOut()}><LogOut className="size-4" />Sign out</Button>}
      <a href={BRAND.licenceUrl} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 px-4 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-accent" />Check agency details on NEAIMS</a>
    </nav>}
  </header>;
}

function SiteFooter() {
  const { t } = useLanguage();
  return <footer className="mt-14 bg-foreground text-background">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-8 lg:grid-cols-4">
      <div className="space-y-3"><div className="font-heading text-lg font-bold">Fawzie Recruitment</div><p className="max-w-xs text-sm text-background/70">{t("footer.tagline")}</p><a href={BRAND.licenceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-background/70 hover:text-accent">Check agency details on NEAIMS <ArrowUpRight className="size-3" /></a></div>
      <div><h2 className="mb-3 text-sm font-semibold">Quick links</h2><div className="grid gap-2 text-sm text-background/70">{links.slice(1, 6).map(([href, key]) => <Link key={href} to={href} className="hover:text-accent">{t(key)}</Link>)}</div></div>
      <div><h2 className="mb-3 text-sm font-semibold">Company</h2><div className="grid gap-2 text-sm text-background/70"><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy notice</Link><Link to="/admin">Admin login</Link></div></div>
      <div><h2 className="mb-3 text-sm font-semibold">Contact us</h2><div className="grid gap-2 text-sm text-background/70"><a href={`tel:${BRAND.phoneRaw}`}>{BRAND.phone}</a><a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">WhatsApp: {BRAND.phone}</a><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a><span>{BRAND.address}</span></div></div>
    </div>
    <div className="border-t border-background/15"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-background/60 md:px-8"><span>© {new Date().getFullYear()} Fawzie Recruitment. All rights reserved.</span><a className="inline-flex items-center gap-1 hover:text-accent" href={BRAND.licenceUrl} target="_blank" rel="noreferrer">Verify our licence on NEAIMS <ArrowUpRight className="size-3" /></a></div></div>
  </footer>;
}

function MobileActions() {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const actions = [["/jobs", "nav.jobs"], ["/job-seekers", "nav.register"], ["/get-help", "nav.help"]] as const;
  return <>
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 border-t border-border bg-background/95 px-2 backdrop-blur md:hidden" aria-label="Quick actions">
      {actions.map(([href, title]) => <Link key={href} to={href} className={`flex flex-col items-center justify-center gap-1 text-xs ${pathname === href ? "text-primary" : "text-muted-foreground"}`}><span className="font-semibold">{t(title)}</span></Link>)}
      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground"><MessageCircle className="size-4" /><span>WhatsApp</span></a>
    </nav>
    <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-20 right-4 z-30 grid size-10 place-items-center sm:size-12 rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6"><MessageCircle className="size-5" /></a>
  </>;
}