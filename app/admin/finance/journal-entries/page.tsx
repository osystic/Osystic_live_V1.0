"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface JournalLine {
  accountId: string;
  description: string;
  debit: number;
  credit: number;
}

export default function JournalEntriesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: "", entryDate: "", currency: "PKR", lines: [{ accountId: "", description: "", debit: 0, credit: 0 }, { accountId: "", description: "", debit: 0, credit: 0 }] as JournalLine[] });

  const { data, isLoading } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: async () => { const r = await fetch("/api/admin/finance/journal-entries"); return r.json(); },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: typeof form) => {
      const r = await fetch("/api/admin/finance/journal-entries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!r.ok) { const err = await r.json(); throw new Error(err.error || "Failed"); }
      return r.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["journal-entries"] }); setShowForm(false); toast.success("Journal entry created"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const entries = data?.entries || [];
  const totalDebit = form.lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = form.lines.reduce((s, l) => s + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const updateLine = (index: number, field: keyof JournalLine, value: string | number) => {
    const newLines = [...form.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setForm({ ...form, lines: newLines });
  };

  const addLine = () => setForm({ ...form, lines: [...form.lines, { accountId: "", description: "", debit: 0, credit: 0 }] });
  const removeLine = (index: number) => { if (form.lines.length > 2) setForm({ ...form, lines: form.lines.filter((_, i) => i !== index) }); };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Journal Entries</h1>
          <p className="text-gray-500 mt-1">Double-entry bookkeeping</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> New Entry
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">New Journal Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="date" value={form.entryDate} onChange={e => setForm({ ...form, entryDate: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>

          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase">
              <div className="col-span-4">Account ID</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2">Debit</div>
              <div className="col-span-2">Credit</div>
              <div className="col-span-1"></div>
            </div>
            {form.lines.map((line, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <input placeholder="Account ID" value={line.accountId} onChange={e => updateLine(i, "accountId", e.target.value)} className="col-span-4 border rounded px-2 py-1.5 text-sm" />
                <input placeholder="Desc" value={line.description} onChange={e => updateLine(i, "description", e.target.value)} className="col-span-3 border rounded px-2 py-1.5 text-sm" />
                <input type="number" placeholder="0" value={line.debit || ""} onChange={e => updateLine(i, "debit", +e.target.value)} className="col-span-2 border rounded px-2 py-1.5 text-sm" />
                <input type="number" placeholder="0" value={line.credit || ""} onChange={e => updateLine(i, "credit", +e.target.value)} className="col-span-2 border rounded px-2 py-1.5 text-sm" />
                <button onClick={() => removeLine(i)} className="col-span-1 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          <button onClick={addLine} className="text-sm text-blue-600 hover:text-blue-700 mb-4">+ Add Line</button>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex gap-6 text-sm">
              <span>Debit: <strong className={totalDebit === totalCredit ? "text-green-600" : "text-red-600"}>${totalDebit.toLocaleString()}</strong></span>
              <span>Credit: <strong className={totalDebit === totalCredit ? "text-green-600" : "text-red-600"}>${totalCredit.toLocaleString()}</strong></span>
              {!isBalanced && <span className="text-red-500 font-semibold">Not balanced</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !isBalanced} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {createMutation.isPending ? "Creating..." : "Create Entry"}
              </button>
              <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <FileText size={48} className="mx-auto text-gray-300 mb-2" />
            No journal entries yet.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Entry #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Debit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Credit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry: { id: string; entryNumber: string; description: string; entryDate: string; totalDebit: number; totalCredit: number; status: string }) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{entry.entryNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{entry.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{entry.entryDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Number(entry.totalDebit).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Number(entry.totalCredit).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${entry.status === "POSTED" ? "bg-green-100 text-green-700" : entry.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{entry.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
