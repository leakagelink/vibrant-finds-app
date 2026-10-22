import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { actions } from "@/lib/store";

export const Route = createFileRoute("/verify")({
  validateSearch: (s: Record<string, unknown>) => ({ phone: typeof s["phone"] === "string" ? s["phone"].replace(/\D/g, "").slice(0, 10) : "" }),
  head: () => ({ meta: [
    { title: "Verify your number — JAKAS" },
    { name: "description", content: "Enter the one-time code to verify your phone on JAKAS." },
    { property: "og:title", content: "Verify your number — JAKAS" },
    { property: "og:description", content: "One-time code verification for JAKAS." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Verify,
});

function Verify() {
  const { phone } = Route.useSearch();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [left, setLeft] = useState(30);
  useEffect(() => { const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  const verify = () => { actions.demoSignIn(phone); toast.success("Demo verified — welcome to JAKAS!"); navigate({ to: "/" }); };
  return <main className="login-slide mx-auto flex min-h-dvh max-w-md flex-col bg-card px-6 pt-6">
    <Button asChild variant="ghost" size="icon" className="rounded-xl border" aria-label="Back"><Link to="/login"><ArrowLeft /></Link></Button>
    <span className="mt-8 grid h-16 w-16 place-items-center rounded-[20px] bg-action text-3xl shadow-action">💬</span>
    <h1 className="mt-6 text-[28px] font-extrabold leading-tight">Verify your number</h1>
    <p className="mt-2 text-sm text-muted-foreground">Enter the 6-digit code sent to <span className="font-bold text-foreground">+91 {phone || "your number"}</span></p>
    <div className="mt-8 flex justify-center">
      <InputOTP maxLength={6} value={code} onChange={setCode} onComplete={verify} autoFocus>
        <InputOTPGroup className="gap-2">{[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} className="otp-slot h-14 w-12 rounded-2xl border bg-muted text-xl font-extrabold first:rounded-2xl last:rounded-2xl" />)}</InputOTPGroup>
      </InputOTP>
    </div>
    <p className="mt-4 rounded-2xl bg-warning/10 px-4 py-3 text-center text-xs font-semibold text-accent-foreground">Demo mode: no SMS is sent — enter any 6 digits.</p>
    <Button variant="action" className="mt-6 h-14 w-full text-base" disabled={code.length < 6} onClick={verify}>Verify & Continue</Button>
    <p className="mt-4 text-center text-sm text-muted-foreground">{left > 0 ? <>Resend code in <span className="font-bold tabular-nums">0:{String(left).padStart(2, "0")}</span></> : <Button variant="link" className="h-auto p-0 font-bold text-brand-orange" onClick={() => setLeft(30)}>Resend code</Button>}</p>
    <p className="mt-auto flex items-center justify-center gap-2 pb-8 text-[10px] font-semibold text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" />Your number is never shared with hosts.</p>
  </main>;
}
