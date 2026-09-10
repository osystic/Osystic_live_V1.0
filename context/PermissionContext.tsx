"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type PermCode =
  | "INCOME_READ" | "INCOME_CREATE" | "INCOME_UPDATE" | "INCOME_DELETE"
  | "EXPENSE_READ" | "EXPENSE_CREATE" | "EXPENSE_UPDATE" | "EXPENSE_DELETE"
  | "INVOICE_READ" | "INVOICE_CREATE" | "INVOICE_UPDATE" | "INVOICE_DELETE"
  | "PAYMENT_RECEIPT_READ" | "PAYMENT_RECEIPT_CREATE" | "PAYMENT_RECEIPT_UPDATE"
  | "CREDIT_NOTE_READ" | "CREDIT_NOTE_CREATE" | "CREDIT_NOTE_UPDATE"
  | "VENDOR_READ" | "VENDOR_CREATE" | "VENDOR_UPDATE" | "VENDOR_DELETE"
  | "VENDOR_BILL_READ" | "VENDOR_BILL_CREATE" | "VENDOR_BILL_UPDATE" | "VENDOR_BILL_DELETE"
  | "VENDOR_PAYMENT_READ" | "VENDOR_PAYMENT_CREATE" | "VENDOR_PAYMENT_UPDATE"
  | "BANK_READ" | "BANK_CREATE" | "BANK_UPDATE" | "BANK_DELETE" | "BANK_RECONCILE" | "BANK_TRANSFER"
  | "COA_READ" | "COA_CREATE" | "COA_UPDATE" | "COA_DELETE"
  | "JOURNAL_READ" | "JOURNAL_CREATE" | "JOURNAL_UPDATE" | "JOURNAL_DELETE"
  | "PERIOD_READ" | "PERIOD_MANAGE" | "PERIOD_CLOSE" | "PERIOD_REOPEN"
  | "TAX_READ" | "TAX_MANAGE" | "TAX_CREATE"
  | "BUDGET_READ" | "BUDGET_CREATE" | "BUDGET_UPDATE" | "BUDGET_APPROVE"
  | "PROJECT_READ" | "PROJECT_CREATE" | "PROJECT_UPDATE" | "PROJECT_DELETE"
  | "REPORT_READ" | "REPORT_CREATE" | "REPORT_EXPORT"
  | "SETTINGS_READ" | "SETTINGS_MANAGE"
  | "ADMIN_USERS" | "ADMIN_AUDIT"
  | "APPROVE_INCOME" | "APPROVE_EXPENSE" | "APPROVE_INVOICE"
  | "CLIENT_READ" | "CLIENT_CREATE" | "CLIENT_UPDATE" | "CLIENT_DELETE"
  | "GL_READ"
  | "FIXED_ASSET_READ" | "FIXED_ASSET_CREATE" | "FIXED_ASSET_UPDATE"
  | "PAYROLL_READ" | "PAYROLL_CREATE" | "PAYROLL_UPDATE"
  | "PAYROLL_APPROVE" | "PAYROLL_POST"
  | "SUBSCRIPTION_READ" | "SUBSCRIPTION_CREATE" | "SUBSCRIPTION_UPDATE"
  | "CONTRACTOR_READ" | "CONTRACTOR_CREATE" | "CONTRACTOR_UPDATE"
  | "COMMISSION_READ" | "COMMISSION_CREATE" | "COMMISSION_UPDATE";

interface PermissionContextType {
  role: string;
  can: (perm: PermCode) => boolean;
  hasPermission: (perm: string) => boolean;
  isFinanceUser: boolean;
}

const PermissionContext = createContext<PermissionContextType>({
  role: "developer",
  can: () => false,
  hasPermission: () => false,
  isFinanceUser: false,
});

export function PermissionProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const role = auth.role;
  const isAdmin = auth.isAdmin;

  const can = (perm: PermCode): boolean => {
    if (isAdmin) return true;
    return auth.hasPermission(perm);
  };

  const hasPermission = (perm: string): boolean => {
    if (isAdmin) return true;
    return auth.hasPermission(perm);
  };

  const isFinanceUser = can('JOURNAL_CREATE') || can('INCOME_CREATE');

  return (
    <PermissionContext.Provider value={{ role, can, hasPermission, isFinanceUser }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionContext);
}

export default PermissionContext;
