"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Scale } from "lucide-react";
import toast from "react-hot-toast";

export default function TaxPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", rate: 0, type: "percentage" });
  const { data, isLoading } = useQuery({ queryKey: ["tax"], queryFn: async () => { const r = await fetch("/api/admin/finance/tax"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/tax", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tax"] }); setShowForm(false); toast.success("Tax config created"); setForm({ name: "", rate: 0, type: "percentage" }); },
    onError: () => toast.error("Failed"),
  });

  const configs = data?.config || [];
  const entries = data?.entries || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Tax</h1><p className="text-gray-500 mt-1">Tax configuration and entries</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> Add Tax Rule</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Tax Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Name (e.g., Sales Tax)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Rate (%)" value={form.rate || ""} onChange={e => setForm({ ...form, rate: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border rounded-lg px-3 py-2"><option>percentage</option><option>fixed</option></select>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Creating..." : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Tax Rules</h3>
          {isLoading ? <p className="text-gray-500">Loading...</p> : configs.length === 0 ? <p className="text-gray-500 text-center py-4">No tax rules</p> : (
            <div className="space-y-2">
              {configs.map((c: { id: string; name: string; rate: number; type: string; isActive: boolean }) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><p className="font-medium text-gray-900">{c.name}</p><p className="text-sm text-gray-500">{c.type}</p></div>
                  <div className="text-right"><p className="font-semibold text-gray-900">{Number(c.rate)}%</p><span className={`px-2 py-1 text-xs rounded-full ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.isActive ? "Active" : "Inactive"}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Tax Entries</h3>
          {entries.length === 0 ? <p className="text-gray-500 text-center py-4">No tax entries</p> : (
            <div className="space-y-2">
              {entries.map((e: { id: string; entityType: string; baseAmount: number; taxAmount: number; status: string }) => (
                <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><p className="font-medium text-gray-900">{e.entityType}</p><p className="text-sm text-gray-500">Base: ${Number(e.baseAmount).toLocaleString()}</p></div>
                  <div className="text-right"><p className="font-semibold text-red-600">${Number(e.taxAmount).toLocaleString()}</p><span className={`px-2 py-1 text-xs rounded-full ${e.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{e.status}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
