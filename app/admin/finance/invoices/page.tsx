"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, FileText, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function InvoicesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: "", description: "", issueDate: "", dueDate: "", currency: "USD", subtotal: 0, taxAmount: 0, discountAmount: 0, totalAmount: 0, notes: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => { const r = await fetch("/api/admin/finance/invoices"); return r.json(); },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: typeof form) => {
      const r = await fetch("/api/admin/finance/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!r.ok) throw new Error("Failed to create invoice");
      return r.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["invoices"] }); setShowForm(false); toast.success("Invoice created"); setForm({ clientName: "", description: "", issueDate: "", dueDate: "", currency: "USD", subtotal: 0, taxAmount: 0, discountAmount: 0, totalAmount: 0, notes: "" }); },
    onError: () => toast.error("Failed to create invoice"),
  });

  const invoices = data?.invoices || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage accounts receivable invoices</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> New Invoice
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Create Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Client Name" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" placeholder="Issue Date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" placeholder="Due Date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Currency" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Subtotal" value={form.subtotal || ""} onChange={e => setForm({ ...form, subtotal: +e.target.value, totalAmount: +e.target.value + form.taxAmount - form.discountAmount })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Tax Amount" value={form.taxAmount || ""} onChange={e => setForm({ ...form, taxAmount: +e.target.value, totalAmount: form.subtotal + +e.target.value - form.discountAmount })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Discount" value={form.discountAmount || ""} onChange={e => setForm({ ...form, discountAmount: +e.target.value, totalAmount: form.subtotal + form.taxAmount - +e.target.value })} className="border rounded-lg px-3 py-2" />
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <span className="text-gray-500 mr-2">Total:</span>
              <span className="font-semibold">${form.totalAmount.toLocaleString()}</span>
            </div>
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" rows={2} />
            <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" rows={2} />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {createMutation.isPending ? "Creating..." : "Create Invoice"}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No invoices found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv: { id: string; invoiceNumber: string; clientName: string; totalAmount: number; status: string; issueDate: string }) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inv.clientName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Number(inv.totalAmount).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${inv.status === "PAID" ? "bg-green-100 text-green-700" : inv.status === "OVERDUE" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{inv.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inv.issueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
