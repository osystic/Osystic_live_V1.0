"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function VendorsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", contactPerson: "", email: "", phone: "", address: "", paymentTerms: "Net 30" });
  const { data, isLoading } = useQuery({ queryKey: ["vendors"], queryFn: async () => { const r = await fetch("/api/admin/finance/vendors"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/vendors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["vendors"] }); setShowForm(false); toast.success("Vendor created"); setForm({ name: "", contactPerson: "", email: "", phone: "", address: "", paymentTerms: "Net 30" }); },
    onError: () => toast.error("Failed"),
  });

  const vendors = data?.vendors || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Vendors</h1><p className="text-gray-500 mt-1">Manage vendor master data</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> Add Vendor</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Vendor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Contact Person" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.paymentTerms} onChange={e => setForm({ ...form, paymentTerms: e.target.value })} className="border rounded-lg px-3 py-2"><option>Net 30</option><option>Net 60</option><option>Net 90</option><option>Due on Receipt</option></select>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Creating..." : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : vendors.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><Building2 size={48} className="mx-auto text-gray-300 mb-2" />No vendors yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Terms</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map((v: { id: string; name: string; contactPerson: string; email: string; paymentTerms: string; isActive: boolean }) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{v.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.contactPerson || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.paymentTerms}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${v.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{v.isActive ? "Active" : "Inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
