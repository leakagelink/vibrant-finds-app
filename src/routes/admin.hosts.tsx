import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/jakas/PanelShell";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/hosts")({ head: () => ({ meta: [{ title: 'Host verification — JAKAS' }, { name: "description", content: 'Host verification on JAKAS.' }, { property: "og:title", content: 'Host verification — JAKAS' }, { property: "og:description", content: 'Host verification on JAKAS.' }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Hosts });

function Hosts() {
  const hosts = useStore((s) => s.hosts);
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Host verification</h1>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr>{["Business", "Type", "Email", "City", "Status", "Action"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {hosts.map((h) => (
              <tr key={h.id} className="border-t">
                <td className="p-3 font-semibold">{h.name}</td><td className="p-3">{h.type}</td><td className="p-3">{h.email}</td><td className="p-3">{h.city}</td>
                <td className="p-3"><StatusBadge status={h.status} /></td>
                <td className="space-x-2 p-3">
                  <button onClick={() => actions.setHostStatus(h.id, "approved")} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-primary-foreground">Approve</button>
                  <button onClick={() => actions.setHostStatus(h.id, "rejected")} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">{h.status === "approved" ? "Suspend" : "Reject"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
