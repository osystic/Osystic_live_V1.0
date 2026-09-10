"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Settings, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const qc = useQueryClient();
  const [showRateForm, setShowRateForm] = useState(false);
  const [rateForm, setRateForm] = useState({ fromCurrency: "", toCurrency: "", rate: 0, effectiveDate: "" });
  const { data, isLoading } = useQuery({ queryKey: ["exchange-rates"], queryFn: async () => { const r = await fetch("/api/admin/finance/exchange-rates"); return r.json(); } });

  const createRate = useMutation({ mutationFn: async (f: typeof rateForm) => { const r = await fetch("/api/admin/finance/exchange-rates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["exchange-rates"] }); setShowRateForm(false); toast.success("Rate added"); setRateForm({ fromCurrency: "", toCurrency: "", rate: 0, effectiveDate: "" }); },
    onError: () => toast.error("Failed"),
  });

  const rates = data?.rates || [];

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-gray-500 mt-1">System configuration</p></div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Exchange Rates</h3>
          <button onClick={() => setShowRateForm(!showRateForm)} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm"><Plus size={16} /> Add Rate</button>
        </div>
        {showRateForm && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <input placeholder="From" value={rateForm.fromCurrency} onChange={e => setRateForm({ ...rateForm, fromCurrency: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input placeholder="To" value={rateForm.toCurrency} onChange={e => setRateForm({ ...rateForm, toCurrency: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Rate" value={rateForm.rate || ""} onChange={e => setRateForm({ ...rateForm, rate: +e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input type="date" value={rateForm.effectiveDate} onChange={e => setRateForm({ ...rateForm, effectiveDate: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <button onClick={() => createRate.mutate(rateForm)} className="bg-blue-600 text-white px-3 py-2 rounded text-sm">Save</button>
          </div>
        )}
        {isLoading ? <p className="text-gray-500">Loading...</p> : rates.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No exchange rates configured</p>
        ) : (
          <table className="w-full">
            <thead className="border-b"><tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">From</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">To</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Rate</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Effective Date</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {rates.map((r: { id: string; fromCurrency: string; toCurrency: string; rate: number; effectiveDate: string }) => (
                <tr key={r.id}>
                  <td className="px-3 py-2 text-sm font-medium">{r.fromCurrency}</td>
                  <td className="px-3 py-2 text-sm">{r.toCurrency}</td>
                  <td className="px-3 py-2 text-sm text-right font-semibold">{Number(r.rate).toFixed(4)}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{r.effectiveDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
