"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

const ACCOUNT_TYPES = ["asset", "liability", "equity", "revenue", "expense"];

export default function ChartOfAccountsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", type: "asset", description: "", currency: "PKR" });

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => { const r = await fetch("/api/admin/finance/accounts"); return r.json(); },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: typeof form) => {
      const r = await fetch("/api/admin/finance/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["accounts"] }); setShowForm(false); toast.success("Account created"); setForm({ code: "", name: "", type: "asset", description: "", currency: "PKR" }); },
    onError: () => toast.error("Failed to create account"),
  });

  const accounts = data?.accounts || [];

  const typeColors: Record<string, string> = {
    asset: "bg-blue-100 text-blue-700",
    liability: "bg-red-100 text-red-700",
    equity: "bg-purple-100 text-purple-700",
    revenue: "bg-green-100 text-green-700",
    expense: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
          <p className="text-gray-500 mt-1">Manage your account structure</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> Add Account
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Code (e.g., 1001)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border rounded-lg px-3 py-2">
              {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {createMutation.isPending ? "Creating..." : "Create Account"}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : accounts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-2" />
            No accounts yet. Create your first account to get started.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Currency</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((acc: { id: string; code: string; name: string; type: string; currency: string; isActive: boolean }) => (
                <tr key={acc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{acc.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{acc.name}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${typeColors[acc.type] || "bg-gray-100 text-gray-700"}`}>{acc.type}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{acc.currency}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${acc.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{acc.isActive ? "Active" : "Inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
