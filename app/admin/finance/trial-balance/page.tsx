"use client";
import { useQuery } from "@tanstack/react-query";
import { Calculator } from "lucide-react";

export default function TrialBalancePage() {
  const { data, isLoading } = useQuery({ queryKey: ["trial-balance"], queryFn: async () => { const r = await fetch("/api/admin/finance/trial-balance"); return r.json(); } });
  const rows = data?.trialBalance || [];
  const totalDebit = rows.reduce((s: number, r: { totalDebit: number }) => s + Number(r.totalDebit), 0);
  const totalCredit = rows.reduce((s: number, r: { totalCredit: number }) => s + Number(r.totalCredit), 0);

  const typeColors: Record<string, string> = { asset: "text-blue-600", liability: "text-red-600", equity: "text-purple-600", revenue: "text-green-600", expense: "text-orange-600" };

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Trial Balance</h1><p className="text-gray-500 mt-1">Debit and credit balances by account</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? <div className="p-6 text-center text-gray-500">Loading...</div> : rows.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><Calculator size={48} className="mx-auto text-gray-300 mb-2" />No accounts with transactions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Account</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Debit</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Credit</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Balance</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {rows.slice(0, 50).map((r: { accountId: string; accountCode: string; accountName: string; accountType: string; totalDebit: number; totalCredit: number }) => (
                  <tr key={r.accountId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-mono text-gray-900">{r.accountCode}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{r.accountName}</td>
                    <td className="px-4 py-2"><span className={`text-xs font-semibold capitalize ${typeColors[r.accountType] || ""}`}>{r.accountType}</span></td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">{Number(r.totalDebit) > 0 ? `$${Number(r.totalDebit).toLocaleString()}` : ""}</td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">{Number(r.totalCredit) > 0 ? `$${Number(r.totalCredit).toLocaleString()}` : ""}</td>
                    <td className="px-4 py-2 text-sm text-right font-bold">${Math.abs(Number(r.totalDebit) - Number(r.totalCredit)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t font-bold">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-sm text-right">Total</td>
                  <td className="px-4 py-3 text-sm text-right">${totalDebit.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">${totalCredit.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-sm text-right ${Math.abs(totalDebit - totalCredit) < 0.01 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(totalDebit - totalCredit) < 0.01 ? "Balanced" : `$${Math.abs(totalDebit - totalCredit).toLocaleString()} diff`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
