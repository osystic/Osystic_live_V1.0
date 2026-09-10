import { z } from "zod";

export const invoiceSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  description: z.string().optional(),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().optional(),
  currency: z.string().default("USD"),
  subtotal: z.number().min(0),
  taxAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  totalAmount: z.number().min(0),
  notes: z.string().optional(),
  projectId: z.string().uuid().optional(),
});

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  expenseDate: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  projectId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
});

export const incomeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  incomeDate: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  projectId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
});

export const vendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxRegistration: z.string().optional(),
  ntn: z.string().optional(),
  paymentTerms: z.string().default("Net 30"),
});

export const budgetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  totalAmount: z.number().positive("Amount must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  projectId: z.string().uuid().optional(),
  department: z.string().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxRegistration: z.string().optional(),
  currency: z.string().default("USD"),
  paymentTerms: z.string().default("Net 30"),
});

export const accountSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
  parentId: z.string().uuid().optional(),
  description: z.string().optional(),
  currency: z.string().default("PKR"),
});

export const journalEntrySchema = z.object({
  description: z.string().min(1, "Description is required"),
  entryDate: z.string().min(1, "Date is required"),
  currency: z.string().default("PKR"),
  lines: z.array(z.object({
    accountId: z.string().uuid("Account is required"),
    description: z.string().optional(),
    debit: z.number().min(0).default(0),
    credit: z.number().min(0).default(0),
  })).min(2, "At least 2 lines required"),
});