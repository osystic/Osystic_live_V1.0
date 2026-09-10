"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, ClipboardList } from "lucide-react";
import toast from "react-hot-toast";

export default function VendorBillsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vendorName: "", description: "", billDate: "", dueDate: "", currency: "PKR", subtotal: 0, taxAmount: 0, withholdingTax: 0, totalAmount: 0, notes: "" });
  const { data, isLoading } = useQuery({ queryKey: ["vendor-bills"], queryFn: async () => { const r = await fetch("/api/admin/finance/vendor-bills"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/vendor-bills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["vendor-bills"] }); setShowForm(false); toast.success("Bill created"); setForm({ vendorName: "", description: "", billDate: "", dueDate: "", currency: "PKR", subtotal: 0, taxAmount: 0, withholdingTax: 0, totalAmount: 0, notes: "" }); },
    onError: () => toast.error("Failed"),
  });

  const bills = data?.bills || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Vendor Bills</h1><p className="text-gray-500 mt-1">Manage accounts payable bills</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> New Bill</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Vendor Bill</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Vendor Name" value={form.vendorName} onChange={e => setForm({ ...form, vendorName: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.billDate} onChange={e => setForm({ ...form, billDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Currency" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Subtotal" value={form.subtotal || ""} onChange={e => setForm({ ...form, subtotal: +e.target.value, totalAmount: +e.target.value + form.taxAmount - form.withholdingTax })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Tax" value={form.taxAmount || ""} onChange={e => setForm({ ...form, taxAmount: +e.target.value, totalAmount: form.subtotal + +e.target.value - form.withholdingTax })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Withholding Tax" value={form.withholdingTax || ""} onChange={e => setForm({ ...form, withholdingTax: +e.target.value, totalAmount: form.subtotal + form.taxAmount - +e.target.value })} className="border rounded-lg px-3 py-2" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" rows={2} />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Creating..." : "Create Bill"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : bills.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><ClipboardList size={48} className="mx-auto text-gray-300 mb-2" />No vendor bills yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bill #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vendor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {bills.map((b: { id: string; billNumber: string; vendorName: string; totalAmount: number; billDate: string; status: string }) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{b.billNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{b.vendorName}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">${Number(b.totalAmount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{b.billDate}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${b.status === "POSTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
