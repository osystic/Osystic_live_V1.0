"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Operations", "Software", "Marketing", "Salary", "Utilities", "Hosting", "Office", "General"];

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", amount: 0, category: "Operations", expenseDate: "", notes: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => { const r = await fetch("/api/admin/finance/expenses"); return r.json(); },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: typeof form) => {
      const r = await fetch("/api/admin/finance/expenses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["expenses"] }); setShowForm(false); toast.success("Expense recorded"); setForm({ title: "", amount: 0, category: "Operations", expenseDate: "", notes: "" }); },
    onError: () => toast.error("Failed to record expense"),
  });

  const expenses = data?.expenses || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">Track and manage expenses</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Record Expense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Amount" value={form.amount || ""} onChange={e => setForm({ ...form, amount: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border rounded-lg px-3 py-2">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={form.expenseDate} onChange={e => setForm({ ...form, expenseDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" rows={2} />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
              {createMutation.isPending ? "Saving..." : "Save Expense"}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : expenses.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No expenses found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((exp: { id: string; title: string; category: string; amount: number; expenseDate: string; status: string }) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{exp.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exp.category}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">${Number(exp.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exp.expenseDate}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${exp.status === "POSTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{exp.status || "DRAFT"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
