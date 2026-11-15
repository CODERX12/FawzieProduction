import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Section = { value: string; label: string; icon: LucideIcon };

export function AccountWorkspace({ role, email, sections, active, onChange, signOut, action, children }: {
  role: string;
  email: string;
  sections: Section[];
  active: string;
  onChange: (value: string) => void;
  signOut: () => Promise<void>;
  action?: ReactNode;
  children: ReactNode;
}) {
  const current = sections.find((section) => section.value === active);
  return (
    <Tabs value={active} onValueChange={onChange} orientation="vertical" className="grid min-h-dvh items-start gap-0 bg-muted/55 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="flex min-w-0 flex-col bg-[#102439] text-slate-100 lg:sticky lg:top-0 lg:h-dvh">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 lg:py-6">
          <img src="/fawzie-logo.jpeg" alt="" className="size-10 shrink-0 rounded-lg bg-white object-contain" />
          <div className="min-w-0">
            <p className="font-heading font-semibold">Fawzie Recruitment</p>
            <p className="text-xs text-slate-300">{role} workspace</p>
          </div>
          <Button variant="ghost" size="icon" className="ms-auto text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="Sign out" onClick={() => void signOut()}><LogOut className="size-4" /></Button>
        </div>
        <div className="px-3 py-3 lg:flex-1 lg:py-5">
          <Label htmlFor="account-section" className="sr-only lg:hidden">Dashboard section</Label>
          <select id="account-section" value={active} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-white/20 bg-[#102439] px-3 py-2.5 text-sm lg:hidden">
            {sections.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          <TabsList aria-label={`${role} sections`} className="hidden h-auto w-full flex-col items-stretch gap-1 bg-transparent p-0 lg:flex">
            {sections.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-slate-200 shadow-none hover:bg-white/10 data-[state=active]:bg-teal-300/15 data-[state=active]:text-teal-100 data-[state=active]:shadow-none">
                <Icon className="size-4 shrink-0" />{label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <p className="mb-2 truncate px-3 text-sm text-slate-300" title={email}>{email}</p>
          <Button variant="ghost" className="w-full justify-start text-slate-100 hover:bg-white/10 hover:text-white" onClick={() => void signOut()}><LogOut className="size-4" />Sign out</Button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 md:px-8">
            <h1 className="font-heading text-3xl font-semibold tracking-tight">{current?.label}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {action}
              <Button asChild variant="outline" size="sm"><Link to="/">View site</Link></Button>
            </div>
          </div>
        </header>
        <div className="admin-panels mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </Tabs>
  );
}
