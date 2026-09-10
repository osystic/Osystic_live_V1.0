"use client";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, FileText, TrendingUp, TrendingDown } from "lucide-react";

export default function ReportsPage() {
  const { data: pnl, isLoading: pnlLoading } = useQuery({ queryKey: ["report-pnl"], queryFn: async () => { const r = await fetch("/api/admin/finance/reports?type=pnl"); return r.json(); } });
  const { data: arAging, isLoading: arLoading } = useQuery({ queryKey: ["report-ar"], queryFn: async () => { const r = await fetch("/api/admin/finance/reports?type=ar_aging"); return r.json(); } });

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Reports</h1><p className="text-gray-500 mt-1">Financial reports and analytics</p></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg"><TrendingUp size={20} className="text-green-600" /></div>
            <h3 className="font-semibold text-gray-900">Revenue</h3>
          </div>
          {pnlLoading ? <p className="text-gray-400">Loading...</p> : <p className="text-2xl font-bold text-gray-900">${Number(pnl?.revenue || 0).toLocaleString()}</p>}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg"><TrendingDown size={20} className="text-red-600" /></div>
            <h3 className="font-semibold text-gray-900">Expenses</h3>
          </div>
          {pnlLoading ? <p className="text-gray-400">Loading...</p> : <p className="text-2xl font-bold text-gray-900">${Number(pnl?.expenses || 0).toLocaleString()}</p>}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg"><BarChart3 size={20} className="text-blue-600" /></div>
            <h3 className="font-semibold text-gray-900">Net Profit</h3>
          </div>
          {pnlLoading ? <p className="text-gray-400">Loading...</p> : <p className={`text-2xl font-bold ${Number(pnl?.netProfit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>${Number(pnl?.netProfit || 0).toLocaleString()}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit & Loss Summary</h3>
          {pnlLoading ? <p className="text-gray-400">Loading...</p> : <div className="space-y-3">
            <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Total Revenue</span><span className="font-semibold text-green-600">${Number(pnl?.revenue || 0).toLocaleString()}</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-gray-600">Total Expenses</span><span className="font-semibold text-red-600">${Number(pnl?.expenses || 0).toLocaleString()}</span></div>
            <div className="flex justify-between py-2 font-bold"><span>Net Profit</span><span className={Number(pnl?.netProfit || 0) >= 0 ? "text-green-600" : "text-red-600"}>${Number(pnl?.netProfit || 0).toLocaleString()}</span></div>
          </div>}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AR Aging</h3>
          {arLoading ? <p className="text-gray-400">Loading...</p> : arAging?.invoices?.length > 0 ? (
            <div className="space-y-2">
              {arAging.invoices.slice(0, 5).map((inv: { id: string; invoiceNumber: string; clientName: string; outstandingAmount: number }) => (
                <div key={inv.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div><p className="text-sm font-medium">{inv.invoiceNumber}</p><p className="text-xs text-gray-500">{inv.clientName}</p></div>
                  <span className="text-sm font-semibold text-red-600">${Number(inv.outstandingAmount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-center py-4">No outstanding invoices</p>}
        </div>
      </div>
    </div>
  );
}
