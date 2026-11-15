import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account/reset")({
  head: () => ({ meta: [
    { title: "Reset Your Password | Fawzie Recruitment" },
    { name: "description", content: "Set a new password for your Fawzie Recruitment account." },
    { property: "og:title", content: "Reset Your Password | Fawzie Recruitment" },
    { property: "og:description", content: "Choose a new password for your account." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const submit = async () => {
    if (password.length < 6 || password !== confirmation) { setMessage("Use at least 6 characters and make sure both passwords match."); return; }
    setBusy(true); setMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setMessage("The reset link is invalid or expired. Please request a new one.");
    else { setMessage("Your password has been updated."); setSuccess(true); }
  };
  return <section className="grid min-h-[70vh] place-items-center px-4 py-12"><Card className="w-full max-w-md border-border shadow-none"><CardContent className="p-6 md:p-8"><div className="mb-6 flex items-center gap-3"><LockKeyhole className="size-6 text-primary" /><div><h1 className="font-heading text-xl font-bold">Reset password</h1><p className="text-sm text-muted-foreground">Choose a new password for your account.</p></div></div><div className="space-y-4"><div><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" minLength={6} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div><div><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" minLength={6} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></div>{message && <p role="status" className="border border-border bg-muted p-3 text-sm text-muted-foreground">{message}</p>}{success ? <Link to="/job-seekers"><Button className="w-full">Continue to your account</Button></Link> : <Button onClick={() => void submit()} disabled={busy} className="w-full">{busy && <LoaderCircle className="mr-2 size-4 animate-spin" />}Update password</Button>}</div></CardContent></Card></section>;
}