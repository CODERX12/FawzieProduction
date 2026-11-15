import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, FileCheck2, Heart, Mail, MapPin, Phone, Scale, Shield, ShieldCheck, Target, Users, Globe2, Clock3, LockKeyhole, Eye, Trash2, ChevronDown, MessageCircle } from "lucide-react";
import { PageBanner, SectionHeading, TrustNote } from "@/components/fawzie/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BRAND, COUNTRIES, WHATSAPP_LINK } from "@/lib/fawzie";
import { useLanguage } from "@/components/fawzie/providers";
const aboutImage = { url: "/images/pascal-meier-UYiesSO4FiM-unsplash.jpg" };
const contactImage = { url: "/images/ross-parmly-rf6ywHVkrlY-unsplash.jpg" };
const flightImage = { url: "/images/arlind-photography-LZAJH134Np8-unsplash.jpg" };

export function AboutPage() {
  const values = [
    [ShieldCheck, "Safety first", "We verify employers and review contracts before any worker travels."],
    [Heart, "Fair treatment", "We never charge job seekers before a signed contract. Workers come first."],
    [Globe2, "Global reach", "We connect Kenyan workers to trusted opportunities across the Gulf and beyond."],
    [FileCheck2, "Check agency details", "Use NEAIMS to review an agency’s current registration information."],
  ] as const;
  return <>
    <PageBanner title="About Fawzie Recruitment" description="A Kenyan recruitment agency focused on connecting workers with safe, fair and life-changing opportunities — here and abroad." image={aboutImage.url} eyebrow="Worker-first recruitment" />
    <section className="py-14 md:py-20"><div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-8"><div><Badge variant="secondary">Our story</Badge><h2 className="mt-4 font-heading text-2xl font-bold md:text-3xl">Built on trust and care</h2><p className="mt-4 leading-relaxed text-muted-foreground">Fawzie Recruitment was founded to help Kenyan workers avoid exploitation by unlicensed agents and unsafe migration routes. We believe there is a better way.</p><p className="mt-4 leading-relaxed text-muted-foreground">We work with employers, review contracts and stay by our workers’ side — before, during and after placement.</p><a href={BRAND.licenceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"><ShieldCheck className="size-5" />Check agency details on NEAIMS</a></div><div className="border-l-2 border-accent px-7 py-8 md:px-10"><p className="font-heading text-3xl font-bold text-primary">Worker-first recruitment</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Every opportunity is approached with safety, fairness and clear information in mind.</p></div></div></section>
    <section className="bg-secondary/30 py-14 md:py-20"><div className="mx-auto max-w-4xl px-4 text-center md:px-8"><Target className="mx-auto size-7 text-primary" /><p className="mt-3 text-xs font-semibold uppercase text-primary">Our mission</p><h2 className="mt-3 font-heading text-2xl font-bold md:text-3xl">Safe migration. Fair work. Dignity for every worker.</h2><p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">We want no Kenyan worker to risk their safety or accept unfair conditions just to earn a living. Every placement is verified, every contract reviewed, and every worker supported along the way.</p></div></section>
    <section className="py-14 md:py-20"><div className="mx-auto max-w-6xl px-4 md:px-8"><SectionHeading eyebrow="What we stand for" title="Our values" /><div className="grid gap-6 sm:grid-cols-2">{values.map(([Icon, title, description]) => <div key={title} className="flex gap-4 border-t border-border py-5"><Icon className="size-6 shrink-0 text-primary" /><div><h3 className="font-heading font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></div></div>)}</div></div></section>
    <section className="py-14 text-center"><h2 className="font-heading text-2xl font-bold">Ready to work with us?</h2><p className="mx-auto mt-3 max-w-xl text-muted-foreground">Whether you are looking for a job or looking to hire, we are here to help.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Link to="/job-seekers"><Button className="gap-2">Register as a job seeker<ArrowRight className="size-4" /></Button></Link><Link to="/employers"><Button variant="outline">Hire workers</Button></Link></div></section>
  </>;
}

export function GetHelpPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ full_name: "", country: "", employer: "", situation: "", phone: "", consent: false });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const submit = async () => {
    if (!form.full_name.trim() || !form.country || !form.situation.trim() || !form.phone.trim() || !form.consent) { setMessage("Please complete the required details and accept the privacy notice."); return; }
    setBusy(true); setMessage("");
    const { error } = await (await import("@/integrations/supabase/client")).supabase.from("distress_reports").insert({ full_name: form.full_name, country: form.country, employer: form.employer || null, situation: form.situation, phone: form.phone, consent: form.consent });
    setBusy(false);
    if (error) { setMessage("We couldn’t send the report. Please call or WhatsApp us directly."); return; }
    setDone(true);
  };
  return <>
    <PageBanner image="/images/banners/worker-support.webp" eyebrow="Urgent help" title={t("help.title")} description="If you are a Kenyan worker abroad facing unsafe conditions, unpaid wages, a withheld passport or abuse, contact us now." />
    <section className="bg-destructive/5 py-8 md:py-12"><div className="mx-auto max-w-4xl px-4 md:px-8">
      <div className="mb-8 grid gap-3 sm:grid-cols-2"><a href={`tel:${BRAND.phoneRaw}`} className="flex items-center gap-4 bg-primary p-5 text-primary-foreground"><Phone className="size-7" /><span><strong className="block font-heading text-lg">Call now</strong><span className="text-sm text-primary-foreground/80">{BRAND.phone}</span></span></a><a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-accent p-5 text-accent-foreground"><MessageIcon /><span><strong className="block font-heading text-lg">WhatsApp</strong><span className="text-sm">{BRAND.phone}</span></span></a></div>
      {done ? <div className="border-y border-border py-10 text-center"><CheckCircle2 className="mx-auto size-12 text-accent" /><h2 className="mt-4 font-heading text-2xl font-bold">Report received</h2><p className="mx-auto mt-2 max-w-xl text-muted-foreground">Our team will contact you as soon as possible. If you are in immediate danger, contact local emergency services or your embassy.</p><div className="mt-5 flex justify-center gap-3"><a href={`tel:${BRAND.phoneRaw}`}><Button><Phone className="mr-2 size-4" />Call us</Button></a><a href={WHATSAPP_LINK} target="_blank" rel="noreferrer"><Button variant="outline">WhatsApp</Button></a></div></div> : <div className="border-t-2 border-destructive/70 pt-5"><div className="mb-5 flex items-center gap-3"><AlertTriangle className="size-5 text-destructive" /><div><h2 className="font-heading text-lg font-semibold">Send an urgent report</h2><p className="text-sm text-muted-foreground">Reports are treated as a priority. Required fields are marked.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Your name"><input className="fawzie-input" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} /></Field><Field label="Country you are in"><select className="fawzie-input" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })}><option value="">Select country</option>{COUNTRIES.map((country) => <option key={country.code}>{country.name}</option>)}<option>Other</option></select></Field><Field label="Employer name (optional)"><input className="fawzie-input" value={form.employer} onChange={(event) => setForm({ ...form, employer: event.target.value })} /></Field><Field label="Phone number"><input className="fawzie-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field><div className="sm:col-span-2"><Field label="Describe your situation"><textarea rows={4} className="fawzie-input min-h-28" value={form.situation} onChange={(event) => setForm({ ...form, situation: event.target.value })} placeholder="Unsafe conditions, unpaid wages, passport withheld, abuse, or other urgent concern…" /></Field></div></div><label className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} className="mt-0.5 size-4 accent-primary" />{t("common.privacy")}</label>{message && <p role="alert" className="mt-3 text-sm text-destructive">{message}</p>}<Button className="mt-5 w-full" variant="destructive" disabled={busy} onClick={() => void submit()}>{busy ? "Sending…" : "Send urgent report"}</Button></div>}
      <div className="mt-8 border-t border-border pt-5"><h3 className="font-heading font-semibold">Other emergency contacts</h3><ul className="mt-2 space-y-1 text-sm text-muted-foreground"><li>Kenyan Embassy contacts vary by country — save the number before you travel.</li><li>NEA helpline: check neaims.go.ke for current numbers.</li><li>If you are in immediate physical danger, contact local emergency services.</li></ul></div>
    </div></section><section className="px-4 py-8 md:px-8"><img src={flightImage.url} alt="Airplane wing viewed from the cabin" className="mx-auto h-52 w-full max-w-6xl object-cover md:h-72" /></section>
  </>;
}

export function SafeMigrationPage() {
  const [checked, setChecked] = useState<string[]>([]);
  const steps = [
    [ShieldCheck, "Verify the agency", ["Check current agency details on NEAIMS.", "Ask for its physical office address.", "Confirm its recruitment registration before proceeding.", "Be cautious when an agent has no physical office."]],
    [FileCheck2, "Read the contract", ["Read every page before signing.", "Confirm the job, salary, hours and benefits are written clearly.", "Ask for a copy in a language you understand.", "Ask a trusted person to review the contract with you."]],
    [Scale, "Never pay for an offer", ["Do not pay for a job offer or placement before a signed contract.", "Ask who is responsible for every listed fee.", "Report anyone who asks for money before the contract.", "Keep a record of any payment request."]],
    [LockKeyhole, "Keep your passport", ["Your passport belongs to you.", "Keep a copy in a safe place.", "If it is withheld, contact your embassy or Fawzie.", "Keep your identity documents accessible."]],
    [Phone, "Stay connected", ["Share your employer and location with someone you trust.", "Keep Fawzie’s contact information available.", "Know your local emergency and embassy numbers.", "Contact us if your work or safety situation changes."]],
  ] as const;
  return <><PageBanner title="Safe migration guide" description="Practical steps to help protect your rights before accepting a job or travelling for work." image={flightImage.url} eyebrow="Know your rights" /><section className="py-10 md:py-14"><div className="mx-auto max-w-4xl px-4 md:px-8"><TrustNote>A genuine job offer should be clear, documented and verified. Do not pay placement fees before a signed contract.</TrustNote><div className="mt-8 space-y-2">{steps.map(([Icon, title, details], index) => { const done = checked.includes(title); return <details key={title} className="group border-b border-border"><summary className="flex cursor-pointer list-none items-center gap-4 py-5"><span className={`grid size-9 place-items-center ${done ? "bg-accent text-accent-foreground" : "bg-secondary text-primary"}`}>{done ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}</span><span className="flex-1"><span className="block font-heading font-semibold">{index + 1}. {title}</span><span className="mt-1 block text-sm text-muted-foreground">{details[0]}</span></span><ChevronDown className="size-4 transition-transform group-open:rotate-180" /></summary><div className="pb-5 pl-14"><ul className="space-y-2">{details.map((detail) => <li key={detail} className="text-sm text-muted-foreground">• {detail}</li>)}</ul><label className="mt-4 inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={done} onChange={() => setChecked((current) => done ? current.filter((item) => item !== title) : [...current, title])} className="size-4 accent-primary" />I have checked this step</label></div></details>; })}</div><div className="mt-6 border-t border-border py-5 text-center"><Badge variant={checked.length === steps.length ? "default" : "secondary"}>{checked.length} of {steps.length} steps checked</Badge>{checked.length === steps.length && <p className="mt-3 text-sm text-primary">You are ready to travel more safely. Keep our contact details close.</p>}</div></div></section><section className="bg-muted/40 py-10 text-center"><h2 className="font-heading text-xl font-semibold">Need help with a situation?</h2><Link to="/get-help" className="mt-4 inline-flex"><Button>Get urgent help</Button></Link></section></>;
}

export function ContactPage() {
  const { t } = useLanguage();
  const [siteDetails, setSiteDetails] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", message: "", consent: false });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void import("@/integrations/supabase/client")
      .then(({ supabase }) => supabase.from("site_content").select("key,value"))
      .then(({ data }) => {
        if (active && data) {
          setSiteDetails(Object.fromEntries(data.map(({ key, value }) => [key, value])));
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const phone = siteDetails["contact_phone"] || BRAND.phone;
  const digits = phone.replace(/\D/g, "");
  const phoneRaw = /^0\d{9}$/.test(digits) ? `254${digits.slice(1)}` : digits;
  const email = siteDetails["contact_email"] || BRAND.email;
  const address = siteDetails["contact_address"] || BRAND.address;
  const whatsapp = phoneRaw ? `https://wa.me/${phoneRaw}` : WHATSAPP_LINK;

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim() || !form.consent) { setError("Complete all required fields and accept the privacy notice."); return; }
    setBusy(true); setError("");
    const { error: requestError } = await (await import("@/integrations/supabase/client")).supabase.from("employer_requests").insert({ company_name: `General Inquiry from ${form.name}`, contact_name: form.name, email: form.email, phone: "N/A", roles: form.message, num_workers: 0, location: "N/A", notes: form.message, consent: form.consent });
    setBusy(false);
    if (requestError) setError("We couldn’t send your message. Please contact us by phone or email."); else setDone(true);
  };

  return (
    <>
      <PageBanner title="Contact us" description="Questions about jobs, registration or hiring? Our team is here to help." image={contactImage.url} />
      <section className="py-9 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:px-8">
          <div>
            <SectionHeading title="Get in touch" text="For urgent matters, call or WhatsApp us directly." />
            <div className="space-y-5 border-t border-border pt-5">
              <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:+${phoneRaw || BRAND.phoneRaw.slice(1)}`} />
              <ContactRow icon={MessageCircle} label="WhatsApp" value={phone} href={whatsapp} external />
              <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
              <ContactRow icon={MapPin} label="Address" value={address} />
            </div>
          </div>
          <div className="border-t-2 border-primary pt-5">
            {done ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto size-10 text-accent" />
                <h2 className="mt-4 font-heading text-xl font-semibold">Message sent</h2>
                <p className="mt-2 text-sm text-muted-foreground">Thank you for reaching out. Our team has received your message.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setDone(false); setForm({ name: "", email: "", message: "", consent: false }); }}>Send another message</Button>
              </div>
            ) : (
              <>
                <h2 className="font-heading text-lg font-semibold">Send a message</h2>
                <div className="mt-5 space-y-4">
                  <Field label="Your name"><input className="fawzie-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
                  <Field label="Email"><input type="email" className="fawzie-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
                  <Field label="Message"><textarea rows={5} className="fawzie-input" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></Field>
                  <label className="flex items-start gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} className="mt-0.5 size-4 accent-primary" />{t("common.privacy")}</label>
                  {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                  <Button className="w-full" disabled={busy} onClick={() => void submit()}>{busy ? "Sending…" : "Send message"}</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  const sections = [
    [FileCheck2, "Information we collect", "When you register, apply for work, submit a hiring request or ask for urgent help, we collect the details needed to respond: your contact information, skills and experience, preferred work destination, relevant identity information and documents you choose to upload."],
    [Eye, "How we use your information", "We use your information to match you with appropriate jobs, process applications and hiring requests, provide migration support, respond to emergency reports and meet legal requirements. We share relevant information with verified employers only as part of recruitment and with your consent."],
    [LockKeyhole, "How we protect your data", "Account records are private. CVs and passport copies are kept in private file storage, visible only to the account holder and authorized recruitment staff. We do not sell your personal data."],
    [Shield, "Your rights", "Under the Kenya Data Protection Act (2019), you may request access to or correction of your data, ask for deletion where legally permitted, object to processing and withdraw consent. Contact us to exercise these rights."],
    [Trash2, "Data retention", "We retain personal data only as long as needed to provide our services and meet legal obligations. You may request deletion, subject to any legal retention requirements."],
    [Mail, "Privacy contact", `For privacy questions or data requests, email ${BRAND.email} or call ${BRAND.phone}.`],
  ] as const;
  return <><PageBanner image="/images/banners/privacy.webp" title="Privacy notice" description="How Fawzie Recruitment collects, uses and protects personal data under the Kenya Data Protection Act (2019)." /><section className="py-9 md:py-14"><div className="mx-auto max-w-4xl px-4 md:px-8"><div className="mb-6 border-l-2 border-primary bg-secondary/40 p-4 text-sm text-muted-foreground">We take your privacy seriously and use your information to help you find safe work and support your recruitment journey.</div><div className="divide-y divide-border">{sections.map(([Icon, title, text]) => <section key={title} className="grid gap-3 py-5 sm:grid-cols-[40px_1fr]"><Icon className="size-5 text-primary" /><div><h2 className="font-heading font-semibold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div></section>)}</div><p className="mt-6 text-center text-xs text-muted-foreground">This notice may be updated from time to time. Please review it periodically.</p></div></section></>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-1.5 text-sm font-medium">{label}{children}</label>; }
function ContactRow({ icon: Icon, label, value, href, external }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string; external?: boolean }) { const row = <div className="flex items-start gap-3"><Icon className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 text-sm font-medium">{value}</p></div></div>; return href ? <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="block hover:text-primary">{row}</a> : row; }
function MessageIcon() { return <span className="grid size-7 place-items-center rounded-full border border-current"><span className="text-xs">WA</span></span>; }