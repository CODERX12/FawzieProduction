import { useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, LoaderCircle, ShieldCheck, UserRoundPlus } from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount } from "@/components/fawzie/providers";
import { getAccountDashboard } from "@/lib/account-routing";

export function AccountAccess({ title, description, staff = false }: { title: string; description: string; staff?: boolean }) {
  const { signIn, signUp, resetPassword } = useAccount();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dashboard = getAccountDashboard(pathname);
  const returnTo = dashboard === "/admin/dashboard" ? "/admin" : dashboard;
  const [mode, setMode] = useState<"signIn" | "signUp" | "reset">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const result = mode === "signIn"
        ? await signIn(email.trim(), password)
        : mode === "signUp"
          ? await signUp(email.trim(), password, fullName, returnTo)
          : await resetPassword(email.trim());
      if (result) setMessage(result);
      else if (mode === "signIn" && !staff) void navigate({ to: dashboard });
      else if (mode === "signUp") setMessage("Check your inbox for a confirmation link. Open it to verify your email before signing in.");
      else if (mode === "reset") setMessage("If an account exists for that email, we’ll send a reset link.");
    } catch {
      setMessage("We couldn’t complete that request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return <Card className="mx-auto max-w-md border-border shadow-none"><CardContent className="p-6 md:p-8">
    <div className="mb-6 flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center bg-secondary text-primary"><KeyRound className="size-5" /></div><div><h2 className="font-heading text-lg font-semibold">{mode === "signUp" ? (staff ? "Create a staff account" : "Create your account") : mode === "reset" ? "Reset your password" : title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5"><Label htmlFor="account-email">Email address</Label><Input id="account-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
      {mode === "signUp" && <div className="space-y-1.5"><Label htmlFor="account-full-name">Full name</Label><Input id="account-full-name" autoComplete="name" required value={fullName} onChange={(event) => setFullName(event.target.value)} /></div>}
      {mode !== "reset" && <div className="space-y-1.5"><Label htmlFor="account-password">Password</Label><Input id="account-password" type="password" autoComplete={mode === "signUp" ? "new-password" : "current-password"} minLength={mode === "signUp" ? 6 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} /></div>}
      {message && <p role="status" className="border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">{message}</p>}
      <Button type="submit" disabled={busy} className="w-full gap-2">{busy ? <LoaderCircle className="size-4 animate-spin" /> : mode === "signUp" ? <UserRoundPlus className="size-4" /> : <ArrowRight className="size-4" />}{mode === "signIn" ? "Sign in" : mode === "signUp" ? "Create account" : "Send reset link"}</Button>
    </form>
    <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm"><Button type="button" variant="link" disabled={busy} className="h-auto p-0" onClick={() => { setMode(mode === "signIn" ? "signUp" : "signIn"); setMessage(""); }}>{mode === "signIn" ? "New here? Create account" : "Already registered? Sign in"}</Button>{mode === "signIn" && <Button type="button" variant="link" disabled={busy} className="h-auto p-0 text-muted-foreground" onClick={() => { setMode("reset"); setMessage(""); }}>Forgot password?</Button>}</div>
    <p className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />{staff ? "Verify your email first. An authorized administrator must grant dashboard access." : "Verify your email to activate your account."}</p>
  </CardContent></Card>;
}