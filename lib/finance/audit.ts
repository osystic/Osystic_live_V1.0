export async function logAuditEvent(params: {
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  severity?: string;
  sourceModule?: string;
  projectId?: string;
  amount?: number;
  amountCurrency?: string;
}): Promise<void> {
  try {
    await fetch("/api/admin/finance/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}