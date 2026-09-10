"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Tags } from "lucide-react";
import toast from "react-hot-toast";

export default function CommissionsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ personName: "", type: "percentage", rate: 0, baseAmount: 0, commissionAmount: 0 });
  const { data, isLoading } = useQuery({ queryKey: ["commissions"], queryFn: async () => { const r = await fetch("/api/admin/finance/commissions"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/commissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["commissions"] }); setShowForm(false); toast.success("Commission created"); setForm({ personName: "", type: "percentage", rate: 0, baseAmount: 0, commissionAmount: 0 }); },
    onError: () => toast.error("Failed"),
  });

  const comms = data?.commissions || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Commissions</h1><p className="text-gray-500 mt-1">Commission tracking</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> Add Commission</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Commission</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Person Name" value={form.personName} onChange={e => setForm({ ...form, personName: e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border rounded-lg px-3 py-2"><option>percentage</option><option>fixed</option></select>
            <input type="number" placeholder="Rate (%)" value={form.rate || ""} onChange={e => setForm({ ...form, rate: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Base Amount" value={form.baseAmount || ""} onChange={e => setForm({ ...form, baseAmount: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Commission Amount" value={form.commissionAmount || ""} onChange={e => setForm({ ...form, commissionAmount: +e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Creating..." : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : comms.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><Tags size={48} className="mx-auto text-gray-300 mb-2" />No commissions yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Person</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Rate</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {comms.map((c: { id: string; personName: string; type: string; rate: number; commissionAmount: number; status: string }) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.personName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{c.type}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{c.rate ? `${Number(c.rate)}%` : "—"}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">${Number(c.commissionAmount).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${c.status === "POSTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
