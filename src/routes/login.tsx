import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Phone sign-in — JAKAS" },
    { name: "description", content: "Phone verification for your JAKAS account." },
    { property: "og:title", content: "Phone sign-in — JAKAS" },
    { property: "og:description", content: "Phone verification for your JAKAS account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Login,
});

function Login() {
  const [phone, setPhone] = useState("");
  return <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-card">
    <div className="relative bg-brand px-6 pb-12 pt-16 text-center text-primary-foreground">
      <Button asChild variant="ghost" size="icon" className="absolute left-4 top-4 rounded-xl border border-primary-foreground/30 hover:bg-card/10" aria-label="Back"><Link to="/"><ArrowLeft /></Link></Button>
      <p className="absolute right-4 top-5 rounded-full border border-primary-foreground/20 bg-card/10 px-3 py-2 text-[10px] font-bold">🎵 Live Music</p>
      <h1 className="text-4xl font-extrabold">🔥 JAKAS</h1><p className="mt-2 text-xs font-medium">Experiences near you, right now.</p>
    </div>
    <div className="px-6 pt-5"><h2 className="text-2xl font-extrabold leading-tight">Discover what's<br/>happening near you.</h2><p className="mt-3 text-xs leading-5 text-muted-foreground">Enter your mobile number. We'll send you a one-time code.</p>
      <label className="mt-5 flex h-14 items-center rounded-[18px] bg-muted px-4"><span className="mr-4 shrink-0 border-r pr-4 text-sm font-bold">IN +91</span><input aria-label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} placeholder="Mobile number" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
      <Button disabled className="mt-3 h-14 w-full rounded-[18px] bg-muted font-extrabold text-muted-foreground">Continue<ArrowRight /></Button>
      <p role="status" className="mt-2 text-center text-[10px] text-muted-foreground">Phone verification is not available yet.</p>
      <div className="my-5 flex items-center gap-3 text-[10px] font-bold text-muted-foreground"><span className="h-px flex-1 bg-border"/>OR<span className="h-px flex-1 bg-border"/></div>
      <Button asChild variant="outline" className="h-12 w-full rounded-[18px] border-foreground font-extrabold"><Link to="/"><UserRound className="text-brand-purple"/>Continue without login</Link></Button>
    </div>
    <p className="mt-auto flex items-center justify-center gap-2 px-5 pb-8 pt-16 text-[10px] font-semibold text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success"/>Your data stays private. No spam, ever.</p>
  </main>;
}
