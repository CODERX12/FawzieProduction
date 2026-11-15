import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export function AdminAccessManagement() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function promote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = email.trim();
    if (!window.confirm(`Grant ${target} administrator access to recruitment records?`)) return;

    setBusy(true);
    setMessage("");
    try {
      const { data, error } = await supabase.rpc("promote_recruitment_admin", { p_email: target });
      if (error) throw error;
      if (data) {
        setMessage(`Administrator access granted to ${target}.`);
        setEmail("");
      } else {
        setMessage("No verified account matches that email address.");
      }
    } catch {
      setMessage("Could not grant administrator access. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-lg rounded-xl border border-border bg-card p-6">
      <h2 className="font-heading text-lg font-semibold">Manage administrators</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Grant a verified Fawzie account access to the recruitment dashboard and candidate records.
      </p>
      <form className="mt-5 space-y-3" onSubmit={promote}>
        <Label htmlFor="promotion-email">Account email address</Label>
        <Input id="promotion-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={busy} />
        <Button type="submit" disabled={busy}>{busy ? "Granting access…" : "Grant admin access"}</Button>
      </form>
      {message && <p role="status" className="mt-4 text-sm text-muted-foreground">{message}</p>}
    </section>
  );
}
