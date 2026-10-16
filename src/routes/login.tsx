import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Briefcase, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/jakas/Logo";
import { actions } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in or sign up — JAKAS" },
      { name: "description", content: "Log in to JAKAS as a user, business or admin." },
      { property: "og:title", content: "Sign in — JAKAS" },
      { property: "og:description", content: "Join JAKAS and discover what's happening near you." },
    ],
  }),
  component: Login,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(100),
});

const roles = [
  { id: "user", label: "User", icon: User },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "admin", label: "Admin", icon: Shield },
] as const;

function Login() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [role, setRole] = useState<"user" | "business" | "admin">("user");
  const [f, setF] = useState({ name: "", email: "", password: "", business: "", type: "", city: "" });
  const [err, setErr] = useState<Partial<Record<"name" | "email" | "password", string>>>({});
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = mode === "login" && !f.name ? f.email.split("@")[0] : f.name;
    const r = schema.safeParse({ ...f, name });
    if (!r.success) { setErr(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    const displayName = role === "business" && f.business.trim() ? f.business.trim() : r.data.name;
    if (role === "business" && mode === "signup") actions.registerHost({ name: displayName, type: f.type || "Business", email: r.data.email, city: f.city || "Surampalem" });
    actions.login(displayName, r.data.email, role);
    navigate({ to: role === "user" ? "/" : role === "business" ? "/business" : "/admin" });
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-end bg-brand p-12 text-primary-foreground md:flex">
        <h1 className="text-5xl font-extrabold leading-tight">Energy → Experience → Discovery</h1>
        <p className="mt-3 max-w-sm opacity-90">Live moments. Real people. Find what's happening around you, right now.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? window.history.back() : navigate({ to: "/" }))}
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <Logo className="mx-auto h-24" />
          <div className="grid grid-cols-3 gap-2">
            {roles.map(({ id, label, icon: Icon }) => (
              <button type="button" key={id} onClick={() => setRole(id)} className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-sm font-semibold ${role === id ? "border-primary bg-secondary text-primary" : "bg-card"}`}>
                <Icon className="h-5 w-5" />{label}
              </button>
            ))}
          </div>
          <div className="flex rounded-full bg-muted p-1 text-sm font-semibold">
            {(["signup", "login"] as const).map((m) => (
              <button type="button" key={m} onClick={() => setMode(m)} className={`flex-1 rounded-full py-2 ${mode === m ? "bg-card shadow" : "text-muted-foreground"}`}>{m === "signup" ? "Sign up" : "Log in"}</button>
            ))}
          </div>
          {mode === "signup" && (
            <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />{err.name && <p className="text-xs text-destructive">{err.name}</p>}</div>
          )}
          {mode === "signup" && role === "business" && (
            <>
              <div className="space-y-1.5"><Label htmlFor="biz">Business name</Label><Input id="biz" value={f.business} onChange={(e) => setF({ ...f, business: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5"><Label htmlFor="type">Type</Label><Input id="type" placeholder="Cafe" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} /></div>
                <div className="space-y-1.5"><Label htmlFor="city">City</Label><Input id="city" placeholder="Kakinada" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></div>
              </div>
            </>
          )}
          <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />{err.email && <p className="text-xs text-destructive">{err.email}</p>}</div>
          <div className="space-y-1.5"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />{err.password && <p className="text-xs text-destructive">{err.password}</p>}</div>
          <Button type="submit" className="h-12 w-full rounded-full bg-brand text-base font-bold shadow-glow">{mode === "signup" ? "Create account" : "Log in"}</Button>
        </form>
      </div>
    </div>
  );
}
