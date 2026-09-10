"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function FiscalCalendarPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "" });
  const { data, isLoading } = useQuery({ queryKey: ["fiscal-calendar"], queryFn: async () => { const r = await fetch("/api/admin/finance/fiscal-calendar"); return r.json(); } });

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/fiscal-calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["fiscal-calendar"] }); setShowForm(false); toast.success("Fiscal year created"); setForm({ name: "", startDate: "", endDate: "" }); },
    onError: () => toast.error("Failed"),
  });

  const years = data?.years || [];
  const periods = data?.periods || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Fiscal Calendar</h1><p className="text-gray-500 mt-1">Manage fiscal years and periods</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> New Fiscal Year</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Fiscal Year</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Name (e.g., FY 2026)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Creating..." : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Fiscal Years</h3>
          {isLoading ? <p className="text-gray-500">Loading...</p> : years.length === 0 ? <p className="text-gray-500 text-center py-4">No fiscal years</p> : (
            <div className="space-y-2">
              {years.map((y: { id: string; name: string; startDate: string; endDate: string; isOpen: boolean }) => (
                <div key={y.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><p className="font-medium text-gray-900">{y.name}</p><p className="text-sm text-gray-500">{y.startDate} to {y.endDate}</p></div>
                  <span className={`px-2 py-1 text-xs rounded-full ${y.isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{y.isOpen ? "Open" : "Closed"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Periods</h3>
          {isLoading ? <p className="text-gray-500">Loading...</p> : periods.length === 0 ? <p className="text-gray-500 text-center py-4">No periods</p> : (
            <div className="space-y-2">
              {periods.map((p: { id: string; name: string; startDate: string; endDate: string; status: string }) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><p className="font-medium text-gray-900">{p.name}</p><p className="text-sm text-gray-500">{p.startDate} to {p.endDate}</p></div>
                  <span className={`px-2 py-1 text-xs rounded-full ${p.status === "OPEN" ? "bg-green-100 text-green-700" : p.status === "SOFT_CLOSED" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
