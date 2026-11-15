import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Language } from "@/lib/fawzie";
import { languageText } from "@/lib/fawzie";

type LocaleValue = { lang: Language; setLang: (lang: Language) => void; t: (key: string) => string };
const LocaleContext = createContext<LocaleValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  useEffect(() => {
    const saved = window.localStorage.getItem("fawzie-lang");
    if (saved === "en" || saved === "sw" || saved === "ar") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (next: Language) => {
    setLangState(next);
    window.localStorage.setItem("fawzie-lang", next);
  };
  const t = (key: string) => languageText[lang][key] ?? languageText.en[key] ?? key;
  return <LocaleContext.Provider value={{ lang, setLang, t }}>{children}</LocaleContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LanguageProvider is missing");
  return context;
}

type AccountValue = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string, returnTo: "/admin" | "/job-seekers" | "/employers") => Promise<string | null>;
  resetPassword: (email: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};
const AccountContext = createContext<AccountValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!alive) return;
      setSession(next);
      setLoading(false);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (alive) {
        setSession(data.session);
        setLoading(false);
      }
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  };
  const signUp: AccountValue["signUp"] = async (email, password, fullName, returnTo) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: new URL(returnTo, window.location.origin).href,
        data: { full_name: fullName.trim() },
      },
    });
    return error?.message ?? null;
  };
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset`,
    });
    return error?.message ?? null;
  };
  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Could not sign out. Please try again.");
      return;
    }
    setSession(null);
  };
  return <AccountContext.Provider value={{ session, loading, signIn, signUp, resetPassword, signOut }}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("AccountProvider is missing");
  return context;
}