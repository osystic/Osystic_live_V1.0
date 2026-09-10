"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Landmark } from "lucide-react";
import toast from "react-hot-toast";

const ACCOUNT_TYPES = ["bank", "cash", "wallet", "platform", "gateway", "card", "clearing"];

export default function BankingPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "bank", currency: "PKR", openingBalance: 0, bankName: "", accountNumber: "", swiftCode: "", iban: "" });
  const { data, isLoading } = useQuery({ queryKey: ["banking"], queryFn: async () => { const r = await fetch("/api/admin/finance/banking"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/banking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["banking"] }); setShowForm(false); toast.success("Account created"); setForm({ name: "", type: "bank", currency: "PKR", openingBalance: 0, bankName: "", accountNumber: "", swiftCode: "", iban: "" }); },
    onError: () => toast.error("Failed"),
  });

  const accounts = data?.accounts || [];

  const typeColors: Record<string, string> = { bank: "bg-blue-100 text-blue-700", cash: "bg-green-100 text-green-700", wallet: "bg-purple-100 text-purple-700", platform: "bg-orange-100 text-orange-700" };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Banking</h1><p className="text-gray-500 mt-1">Manage financial accounts</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> Add Account</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Financial Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Account Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border rounded-lg px-3 py-2">{ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select>
            <input placeholder="Bank Name" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Account Number" value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="SWIFT Code" value={form.swiftCode} onChange={e => setForm({ ...form, swiftCode: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="IBAN" value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Opening Balance" value={form.openingBalance || ""} onChange={e => setForm({ ...form, openingBalance: +e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Creating..." : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : accounts.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><Landmark size={48} className="mx-auto text-gray-300 mb-2" />No financial accounts yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bank</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Balance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((a: { id: string; name: string; type: string; bankName: string; currentBalance: number; isActive: boolean }) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.name}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${typeColors[a.type] || "bg-gray-100 text-gray-700"}`}>{a.type}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.bankName || "—"}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">${Number(a.currentBalance || 0).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${a.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{a.isActive ? "Active" : "Inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
