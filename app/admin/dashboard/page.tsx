"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingUp, TrendingDown, Wallet, FileText, Users, AlertCircle, Clock } from "lucide-react";

async function fetchDashboard() {
  const res = await fetch("/api/admin/finance/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700">Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your financial position</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`$${(stats.totalRevenue || 0).toLocaleString()}`} icon={<TrendingUp size={24} className="text-green-600" />} color="bg-green-50" />
        <StatCard label="Total Expenses" value={`$${(stats.totalExpenses || 0).toLocaleString()}`} icon={<TrendingDown size={24} className="text-red-600" />} color="bg-red-50" />
        <StatCard label="Outstanding AR" value={`$${(stats.outstandingAR || 0).toLocaleString()}`} icon={<FileText size={24} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Outstanding AP" value={`$${(stats.outstandingAP || 0).toLocaleString()}`} icon={<Wallet size={24} className="text-orange-600" />} color="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Net Profit" value={`$${(stats.netProfit || 0).toLocaleString()}`} icon={<DollarSign size={24} className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard label="Active Projects" value={String(stats.activeProjects || 0)} icon={<Users size={24} className="text-purple-600" />} color="bg-purple-50" />
        <StatCard label="Pending Approvals" value={String(stats.pendingApprovals || 0)} icon={<Clock size={24} className="text-yellow-600" />} color="bg-yellow-50" />
        <StatCard label="Overdue Invoices" value={String(stats.overdueInvoices || 0)} icon={<AlertCircle size={24} className="text-red-600" />} color="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {(data?.recentTransactions || []).slice(0, 5).map((tx: { id: string; description: string; amount: number; type: string; date: string }) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
                <span className={`text-sm font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {tx.type === "income" ? "+" : "-"}${Math.abs(tx.amount).toLocaleString()}
                </span>
              </div>
            ))}
            {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Items</h3>
          <div className="space-y-3">
            {(data?.pendingItems || []).slice(0, 5).map((item: { id: string; type: string; description: string; amount: number }) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.description}</p>
                  <p className="text-xs text-gray-500">{item.type}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">${item.amount.toLocaleString()}</span>
              </div>
            ))}
            {(!data?.pendingItems || data.pendingItems.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No pending items</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
