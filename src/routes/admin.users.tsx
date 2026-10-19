import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StatusBadge } from "@/components/jakas/PanelShell";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/users")({ head: () => ({ meta: [{ title: 'Account management — JAKAS' }, { name: "description", content: 'Account management on JAKAS.' }, { property: "og:title", content: 'Account management — JAKAS' }, { property: "og:description", content: 'Account management on JAKAS.' }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: UsersPage });

function UsersPage() {
  const users = useStore((s) => s.users);
  const [q, setQ] = useState("");
  const list = users.filter((u) => (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Users & businesses</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email…" className="mb-4 h-10 w-full max-w-sm rounded-full border bg-card px-4 text-sm" />
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr>{["Name", "Email", "Type", "Status", "Joined", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-semibold">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3 capitalize">{u.role}</td>
                <td className="p-3"><StatusBadge status={u.status} /></td><td className="p-3">{u.joined}</td>
                <td className="p-3"><button onClick={() => actions.toggleBan(u.id)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">{u.status === "active" ? "Ban" : "Unban"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
