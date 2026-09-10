"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, FileCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function CreditNotesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: "", amount: 0, currency: "USD", reason: "" });
  const { data, isLoading } = useQuery({ queryKey: ["credit-notes"], queryFn: async () => { const r = await fetch("/api/admin/finance/credit-notes"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/credit-notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["credit-notes"] }); setShowForm(false); toast.success("Credit note created"); setForm({ clientName: "", amount: 0, currency: "USD", reason: "" }); },
    onError: () => toast.error("Failed"),
  });

  const notes = data?.creditNotes || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Credit Notes</h1><p className="text-gray-500 mt-1">Manage AR credit notes</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> New Credit Note</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Credit Note</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Client Name" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Amount" value={form.amount || ""} onChange={e => setForm({ ...form, amount: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Creating..." : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : notes.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><FileCheck size={48} className="mx-auto text-gray-300 mb-2" />No credit notes yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">CN #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {notes.map((n: { id: string; creditNoteNumber: string; clientName: string; amount: number; reason: string; status: string }) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{n.creditNoteNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{n.clientName}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">${Number(n.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{n.reason || "—"}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${n.status === "POSTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{n.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
