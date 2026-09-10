"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function SubscriptionsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", amount: 0, currency: "USD", billingCycle: "monthly", startDate: "", nextRenewalDate: "" });
  const { data, isLoading } = useQuery({ queryKey: ["subscriptions"], queryFn: async () => { const r = await fetch("/api/admin/finance/subscriptions"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subscriptions"] }); setShowForm(false); toast.success("Subscription added"); setForm({ name: "", amount: 0, currency: "USD", billingCycle: "monthly", startDate: "", nextRenewalDate: "" }); },
    onError: () => toast.error("Failed"),
  });

  const subs = data?.subscriptions || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1><p className="text-gray-500 mt-1">Recurring cost tracking</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> Add Subscription</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Subscription</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Amount" value={form.amount || ""} onChange={e => setForm({ ...form, amount: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value })} className="border rounded-lg px-3 py-2"><option>monthly</option><option>quarterly</option><option>annually</option></select>
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.nextRenewalDate} onChange={e => setForm({ ...form, nextRenewalDate: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Adding..." : "Add"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : subs.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><FolderOpen size={48} className="mx-auto text-gray-300 mb-2" />No subscriptions yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cycle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Next Renewal</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {subs.map((s: { id: string; name: string; amount: number; billingCycle: string; nextRenewalDate: string; isActive: boolean }) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">${Number(s.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{s.billingCycle}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.nextRenewalDate || "—"}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{s.isActive ? "Active" : "Inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
