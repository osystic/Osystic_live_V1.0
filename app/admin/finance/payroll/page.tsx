"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Banknote } from "lucide-react";
import toast from "react-hot-toast";

export default function PayrollPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ periodStart: "", periodEnd: "", totalGross: 0, totalDeductions: 0, totalNet: 0 });
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [empForm, setEmpForm] = useState({ employeeCode: "", name: "", email: "", department: "", designation: "", basicSalary: 0, currency: "PKR" });
  const { data, isLoading } = useQuery({ queryKey: ["payroll"], queryFn: async () => { const r = await fetch("/api/admin/finance/payroll"); return r.json(); } });

  const computedTotalNet = form.totalGross - form.totalDeductions;

  const create = useMutation({ mutationFn: async (f: typeof form) => { const r = await fetch("/api/admin/finance/payroll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, totalNet: f.totalGross - f.totalDeductions, action: "create_run" }) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payroll"] }); setShowForm(false); toast.success("Payroll run created"); setForm({ periodStart: "", periodEnd: "", totalGross: 0, totalDeductions: 0, totalNet: 0 }); },
    onError: () => toast.error("Failed"),
  });

  const createEmployee = useMutation({ mutationFn: async (f: typeof empForm) => { const r = await fetch("/api/admin/finance/payroll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, action: "create_employee" }) }); if (!r.ok) throw new Error("Failed"); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["payroll"] }); setShowEmpForm(false); toast.success("Employee created"); setEmpForm({ employeeCode: "", name: "", email: "", department: "", designation: "", basicSalary: 0, currency: "PKR" }); },
    onError: () => toast.error("Failed"),
  });

  const runs = data?.runs || [];
  const emps = data?.employees || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Payroll</h1><p className="text-gray-500 mt-1">Employee payroll management</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus size={18} /> New Payroll Run</button>
          <button onClick={() => setShowEmpForm(!showEmpForm)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><Plus size={18} /> Add Employee</button>
        </div>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Payroll Run</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" value={form.periodStart} onChange={e => setForm({ ...form, periodStart: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.periodEnd} onChange={e => setForm({ ...form, periodEnd: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Total Gross" value={form.totalGross || ""} onChange={e => setForm({ ...form, totalGross: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Total Deductions" value={form.totalDeductions || ""} onChange={e => setForm({ ...form, totalDeductions: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg border">
              <span className="text-sm text-gray-500 mr-2">Total Net:</span>
              <span className="text-lg font-bold text-green-600">${computedTotalNet.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{create.isPending ? "Creating..." : "Create Run"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      {showEmpForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Employee</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Employee Code" value={empForm.employeeCode} onChange={e => setEmpForm({ ...empForm, employeeCode: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Name" value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Email" value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Department" value={empForm.department} onChange={e => setEmpForm({ ...empForm, department: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Designation" value={empForm.designation} onChange={e => setEmpForm({ ...empForm, designation: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Basic Salary" value={empForm.basicSalary || ""} onChange={e => setEmpForm({ ...empForm, basicSalary: +e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={empForm.currency} onChange={e => setEmpForm({ ...empForm, currency: e.target.value })} className="border rounded-lg px-3 py-2"><option>PKR</option><option>USD</option></select>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => createEmployee.mutate(empForm)} disabled={createEmployee.isPending} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">{createEmployee.isPending ? "Creating..." : "Create Employee"}</button>
            <button onClick={() => setShowEmpForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Payroll Runs</h3>
          {isLoading ? <p className="text-gray-500">Loading...</p> : runs.length === 0 ? <p className="text-gray-500 text-center py-4">No payroll runs</p> : (
            <div className="space-y-2">
              {runs.map((r: { id: string; runNumber: string; periodStart: string; periodEnd: string; totalNet: number; status: string }) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><p className="font-medium text-gray-900">{r.runNumber}</p><p className="text-sm text-gray-500">{r.periodStart} to {r.periodEnd}</p></div>
                  <div className="text-right"><p className="font-semibold text-gray-900">${Number(r.totalNet).toLocaleString()}</p><span className={`px-2 py-1 text-xs rounded-full ${r.status === "POSTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{r.status}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Employees</h3>
          {emps.length === 0 ? <p className="text-gray-500 text-center py-4">No employees</p> : (
            <div className="space-y-2">
              {emps.map((e: { id: string; employeeCode: string; name: string; designation: string; basicSalary: number }) => (
                <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><p className="font-medium text-gray-900">{e.name}</p><p className="text-sm text-gray-500">{e.employeeCode} - {e.designation}</p></div>
                  <p className="font-semibold text-gray-900">${Number(e.basicSalary || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
