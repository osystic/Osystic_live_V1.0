"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, HandCoins } from "lucide-react";
import toast from "react-hot-toast";

export default function ContractorsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", dailyRate: 0, currency: "USD", contractStart: "", contractEnd: "", department: "" });
  const { data, isLoading } = useQuery({ queryKey: ["contractors"], queryFn: async () => { const r = await fetch("/api/admin/finance/contractors"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/contractors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["contractors"] }); setShowForm(false); toast.success("Contractor added"); setForm({ name: "", email: "", phone: "", dailyRate: 0, currency: "USD", contractStart: "", contractEnd: "", department: "" }); },
    onError: () => toast.error("Failed"),
  });

  const contractors = data?.contractors || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Contractors</h1><p className="text-gray-500 mt-1">Contractor management</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> Add Contractor</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Contractor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Daily Rate" value={form.dailyRate || ""} onChange={e => setForm({ ...form, dailyRate: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.contractStart} onChange={e => setForm({ ...form, contractStart: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.contractEnd} onChange={e => setForm({ ...form, contractEnd: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Adding..." : "Add"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : contractors.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><HandCoins size={48} className="mx-auto text-gray-300 mb-2" />No contractors yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Daily Rate</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contract</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {contractors.map((c: { id: string; name: string; email: string; dailyRate: number; contractStart: string; contractEnd: string; isActive: boolean }) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">${Number(c.dailyRate || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.contractStart || "—"} to {c.contractEnd || "—"}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.isActive ? "Active" : "Inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
