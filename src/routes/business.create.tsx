import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MomentForm } from "@/components/jakas/MomentForm";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/business/create")({ component: CreateBiz });

function CreateBiz() {
  const session = useStore((s) => s.session)!;
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 text-3xl font-bold">Create a new moment</h1>
      <p className="mb-6 text-muted-foreground">Add photos, timing and location. Admin approves before it goes live.</p>
      <div className="rounded-2xl border bg-card p-5"><MomentForm host={session.name} hostType="business" onDone={() => navigate({ to: "/business/moments" })} /></div>
    </div>
  );
}
