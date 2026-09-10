"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
import toast from "react-hot-toast";

export default function VendorPaymentsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ entityId: "", amount: 0, paymentDate: "", paymentMethod: "Bank Transfer", reference: "", notes: "" });
  const { data, isLoading } = useQuery({ queryKey: ["vendor-payments"], queryFn: async () => { const r = await fetch("/api/admin/finance/vendor-payments"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/vendor-payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["vendor-payments"] }); setShowForm(false); toast.success("Payment recorded"); setForm({ entityId: "", amount: 0, paymentDate: "", paymentMethod: "Bank Transfer", reference: "", notes: "" }); },
    onError: () => toast.error("Failed"),
  });

  const payments = data?.payments || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Vendor Payments</h1><p className="text-gray-500 mt-1">Track payments to vendors</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> Record Payment</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Record Vendor Payment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Bill ID" value={form.entityId} onChange={e => setForm({ ...form, entityId: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Amount" value={form.amount || ""} onChange={e => setForm({ ...form, amount: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="border rounded-lg px-3 py-2"><option>Bank Transfer</option><option>Cash</option><option>Cheque</option><option>JazzCash</option><option>EasyPaisa</option></select>
            <input placeholder="Reference" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} className="border rounded-lg px-3 py-2" />
            <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" rows={2} />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Saving..." : "Save"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : payments.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><Wallet size={48} className="mx-auto text-gray-300 mb-2" />No vendor payments yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p: { id: string; paymentNumber: string; amount: number; paymentMethod: string; paymentDate: string; status: string }) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{p.paymentNumber}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">${Number(p.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.paymentMethod}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.paymentDate}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${p.status === "POSTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
