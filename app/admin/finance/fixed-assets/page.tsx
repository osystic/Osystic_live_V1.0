"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, PiggyBank } from "lucide-react";
import toast from "react-hot-toast";

export default function FixedAssetsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", purchaseDate: "", purchaseCost: 0, residualValue: 0, usefulLifeMonths: 12, description: "" });
  const { data, isLoading } = useQuery({ queryKey: ["fixed-assets"], queryFn: async () => { const r = await fetch("/api/admin/finance/fixed-assets"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/fixed-assets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["fixed-assets"] }); setShowForm(false); toast.success("Asset registered"); setForm({ name: "", purchaseDate: "", purchaseCost: 0, residualValue: 0, usefulLifeMonths: 12, description: "" }); },
    onError: () => toast.error("Failed"),
  });

  const assets = data?.assets || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Fixed Assets</h1><p className="text-gray-500 mt-1">Asset register and depreciation</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> Add Asset</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Register Fixed Asset</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Asset Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Purchase Cost" value={form.purchaseCost || ""} onChange={e => setForm({ ...form, purchaseCost: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Residual Value" value={form.residualValue || ""} onChange={e => setForm({ ...form, residualValue: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Useful Life (months)" value={form.usefulLifeMonths} onChange={e => setForm({ ...form, usefulLifeMonths: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Registering..." : "Register"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : assets.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><PiggyBank size={48} className="mx-auto text-gray-300 mb-2" />No fixed assets yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Cost</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">NBV</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {assets.map((a: { id: string; assetCode: string; name: string; purchaseCost: number; netBookValue: number; status: string }) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{a.assetCode}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.name}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">${Number(a.purchaseCost).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">${Number(a.netBookValue || 0).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${a.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
