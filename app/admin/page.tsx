"use client";

import Link from "next/link";
import { ArrowRight, Landmark, Sparkles, Users } from "lucide-react";

const modules = [
  {
    title: "Finance Management System",
    description: "Accounting, invoicing, payroll, budgets, tax and financial reporting.",
    href: "/dashboard",
    icon: Landmark,
    accent: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    title: "EMS",
    description: "Employee records, payroll runs and people operations.",
    href: "/dashboard/payroll",
    icon: Users,
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    title: "Case Studies Generate",
    description: "Generate, edit and publish AI-powered case studies from GitHub repositories.",
    href: "/admin/case-studies",
    icon: Sparkles,
    accent: "bg-violet-50 text-violet-600 border-violet-100",
  },
];

export default function AdminHomePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Modules</h1>
        <p className="text-sm text-gray-500 mt-1">Select a module to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.href}
              href={module.href}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-4 ${module.accent}`}>
                <Icon size={22} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-gray-900">{module.title}</h2>
                <ArrowRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{module.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
