"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Project Revenue", "Consulting", "Maintenance", "Other"];

export default function IncomePage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", amount: 0, category: "Project Revenue", incomeDate: "", description: "" });
  const { data, isLoading } = useQuery({ queryKey: ["income"], queryFn: async () => { const r = await fetch("/api/admin/finance/income"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/income", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["income"] }); setShowForm(false); toast.success("Income recorded"); setForm({ title: "", amount: 0, category: "Project Revenue", incomeDate: "", description: "" }); },
    onError: () => toast.error("Failed"),
  });

  const records = data?.income || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Income</h1><p className="text-gray-500 mt-1">Track revenue and income</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><Plus size={18} /> Add Income</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Record Income</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Amount" value={form.amount || ""} onChange={e => setForm({ ...form, amount: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border rounded-lg px-3 py-2">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            <input type="date" value={form.incomeDate} onChange={e => setForm({ ...form, incomeDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" rows={2} />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">{create.isPending ? "Saving..." : "Save"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : records.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><TrendingUp size={48} className="mx-auto text-gray-300 mb-2" />No income records yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Project</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount (USD)</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Net (USD)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((r: { id: string; date: string; projectName: string; invoiceNum: string; amount: number; currency: string; amountUSD: number; netUSD: number; method: string }) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{r.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.projectName || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.invoiceNum || "—"}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{Number(r.amount).toLocaleString()} {r.currency}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">${Number(r.amountUSD || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">${Number(r.netUSD || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.method || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
