"use client";
import { useQuery } from "@tanstack/react-query";
import { Landmark } from "lucide-react";

export default function GeneralLedgerPage() {
  const { data, isLoading } = useQuery({ queryKey: ["general-ledger"], queryFn: async () => { const r = await fetch("/api/admin/finance/general-ledger"); return r.json(); } });
  const ledger = data?.ledger || [];

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">General Ledger</h1><p className="text-gray-500 mt-1">All journal line entries by account</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : ledger.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><Landmark size={48} className="mx-auto text-gray-300 mb-2" />No ledger entries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Entry #</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Account</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Debit</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Credit</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {ledger.slice(0, 50).map((l: { id: string; entryDate: string; entryNumber: string; accountCode: string; accountName: string; entryDescription: string; debit: number; credit: number; status: string }) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-600">{l.entryDate}</td>
                    <td className="px-3 py-2 text-sm font-mono text-gray-900">{l.entryNumber}</td>
                    <td className="px-3 py-2 text-sm"><span className="font-mono text-gray-500 mr-1">{l.accountCode}</span>{l.accountName}</td>
                    <td className="px-3 py-2 text-sm text-gray-600">{l.entryDescription}</td>
                    <td className="px-3 py-2 text-sm text-right font-semibold text-gray-900">{Number(l.debit) > 0 ? `$${Number(l.debit).toLocaleString()}` : ""}</td>
                    <td className="px-3 py-2 text-sm text-right font-semibold text-gray-900">{Number(l.credit) > 0 ? `$${Number(l.credit).toLocaleString()}` : ""}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-1 text-xs rounded-full ${l.status === "POSTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
