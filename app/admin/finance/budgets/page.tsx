"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Operational", "Project Specific", "Marketing", "Salary", "IT & Infrastructure", "Misc"];

export default function BudgetsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "Operational", totalAmount: 0, startDate: "", endDate: "" });
  const { data, isLoading } = useQuery({ queryKey: ["budgets"], queryFn: async () => { const r = await fetch("/api/admin/finance/budgets"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/budgets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["budgets"] }); setShowForm(false); toast.success("Budget created"); setForm({ name: "", description: "", category: "Operational", totalAmount: 0, startDate: "", endDate: "" }); },
    onError: () => toast.error("Failed"),
  });

  const budgets = data?.budgets || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Budgets</h1><p className="text-gray-500 mt-1">Budget planning and tracking</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> New Budget</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Budget</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border rounded-lg px-3 py-2">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            <input type="number" placeholder="Total Amount" value={form.totalAmount || ""} onChange={e => setForm({ ...form, totalAmount: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Creating..." : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : budgets.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><BarChart3 size={48} className="mx-auto text-gray-300 mb-2" />No budgets yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Period</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {budgets.map((b: { id: string; name: string; category: string; totalAmount: number; startDate: string; endDate: string; status: string }) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{b.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{b.category}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">${Number(b.totalAmount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{b.startDate} to {b.endDate}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${b.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{b.status || "DRAFT"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
