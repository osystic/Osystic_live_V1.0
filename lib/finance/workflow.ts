export type WorkflowModule = 'expense' | 'income' | 'invoice' | 'vendor_bill' | 'journal_entry' | 'credit_note' | 'payment' | 'budget' | 'payroll';
export type WorkflowAction = 'submit' | 'verify' | 'approve' | 'post' | 'reject' | 'reverse' | 'reopen' | 'issue' | 'cancel' | 'void';

const MODULES: Record<WorkflowModule, { initial: string; transitions: Record<string, string[]> }> = {
  expense: { initial: "DRAFT", transitions: { DRAFT: ["SUBMITTED","REJECTED"], SUBMITTED: ["VERIFIED","REJECTED"], VERIFIED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] } },
  income: { initial: "DRAFT", transitions: { DRAFT: ["SUBMITTED","REJECTED"], SUBMITTED: ["VERIFIED","REJECTED"], VERIFIED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] } },
  invoice: { initial: "DRAFT", transitions: { DRAFT: ["SUBMITTED","VOID"], SUBMITTED: ["APPROVED","REJECTED"], APPROVED: ["ISSUED"], ISSUED: ["PAID","PARTIALLY_PAID","OVERDUE","VOID"], PARTIALLY_PAID: ["PAID","OVERDUE"], PAID: ["REVERSED"] } },
  vendor_bill: { initial: "DRAFT", transitions: { DRAFT: ["SUBMITTED","REJECTED"], SUBMITTED: ["VERIFIED","REJECTED"], VERIFIED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] } },
  journal_entry: { initial: "DRAFT", transitions: { DRAFT: ["SUBMITTED","REJECTED"], SUBMITTED: ["VERIFIED","REJECTED"], VERIFIED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] } },
  credit_note: { initial: "DRAFT", transitions: { DRAFT: ["SUBMITTED","VOID"], SUBMITTED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] } },
  payment: { initial: "DRAFT", transitions: { DRAFT: ["SUBMITTED","REJECTED"], SUBMITTED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] } },
  budget: { initial: "DRAFT", transitions: { DRAFT: ["SUBMITTED","REJECTED"], SUBMITTED: ["APPROVED","REJECTED"] } },
  payroll: { initial: "DRAFT", transitions: { DRAFT: ["SUBMITTED","REJECTED"], SUBMITTED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] } },
};

export function canTransition(module: WorkflowModule, currentStatus: string, action: WorkflowAction): boolean {
  const config = MODULES[module];
  if (!config) return false;
  const allowed = config.transitions[currentStatus];
  if (!allowed) return false;
  const targetStatus = actionToStatus(action);
  return allowed.includes(targetStatus);
}

function actionToStatus(action: WorkflowAction): string {
  const map: Record<WorkflowAction, string> = {
    submit: "SUBMITTED", verify: "VERIFIED", approve: "APPROVED",
    post: "POSTED", reject: "REJECTED", reverse: "REVERSED",
    reopen: "DRAFT", issue: "ISSUED", cancel: "CANCELLED", void: "VOID",
  };
  return map[action] || action.toUpperCase();
}

export async function callWorkflow(
  module: WorkflowModule,
  recordId: string,
  action: WorkflowAction,
  reason?: string
): Promise<{ success: boolean; status?: string; message?: string; error?: string }> {
  try {
    const res = await fetch("/api/admin/finance/workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module, recordId, action, reason }),
    });
    return await res.json();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}