import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/jakas/Logo";

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
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
    <Button asChild variant="ghost" className="mb-6 self-start"><Link to="/"><ArrowLeft />Back</Link></Button>
    <Logo className="mx-auto h-24" />
    <h1 className="mt-6 text-center text-3xl font-bold">Phone sign-in</h1>
    <p role="status" className="mt-3 text-center text-muted-foreground">Phone verification is not available yet. You can still browse events without an account.</p>
    <Button asChild className="mt-6"><Link to="/">Browse events</Link></Button>
  </main>;
}
