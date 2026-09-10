"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import toast from "react-hot-toast";

export default function TransfersPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fromAccountId: "", toAccountId: "", amount: 0, transferDate: "", reference: "", notes: "" });
  const { data, isLoading } = useQuery({ queryKey: ["transfers"], queryFn: async () => { const r = await fetch("/api/admin/finance/transfers"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/transfers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["transfers"] }); setShowForm(false); toast.success("Transfer created"); setForm({ fromAccountId: "", toAccountId: "", amount: 0, transferDate: "", reference: "", notes: "" }); },
    onError: () => toast.error("Failed"),
  });

  const transfers = data?.transfers || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Transfers</h1><p className="text-gray-500 mt-1">Inter-account transfers</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> New Transfer</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Transfer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="From Account ID" value={form.fromAccountId} onChange={e => setForm({ ...form, fromAccountId: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="To Account ID" value={form.toAccountId} onChange={e => setForm({ ...form, toAccountId: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Amount" value={form.amount || ""} onChange={e => setForm({ ...form, amount: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.transferDate} onChange={e => setForm({ ...form, transferDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Reference" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Transferring..." : "Transfer"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : transfers.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><ArrowLeftRight size={48} className="mx-auto text-gray-300 mb-2" />No transfers yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">From</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">To</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {transfers.map((t: { id: string; fromAccountId: string; toAccountId: string; amount: number; transferDate: string; status: string }) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{t.fromAccountId?.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{t.toAccountId?.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">${Number(t.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.transferDate}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${t.status === "POSTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
