export type Role = "admin" | "manager" | "reception" | "practitioner" | "marketing" | "agent";

export type PublicUser = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: Role;
  is_active: boolean;
  created_at: string;
};

export type FilterOp = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "ilike" | "in";

export type RowFilter = {
  column: string;
  op: FilterOp;
  value: unknown;
};

export type ListInput = {
  table: string;
  select?: string;
  orderBy?: string;
  ascending?: boolean;
  filters?: RowFilter[];
  limit?: number;
  offset?: number;
};

export type UpsertInput = {
  table: string;
  values: Record<string, unknown>;
};

export type UpdateInput = {
  table: string;
  id: string;
  values: Record<string, unknown>;
};

export type InsertInput = {
  table: string;
  values: Record<string, unknown>;
};

export type DeleteInput = {
  table: string;
  id: string;
};

export type IntegrationTestResult = {
  ok: boolean;
  message: string;
  detail?: string;
};

export type ReportInput = {
  report: string;
  from?: string | null;
  to?: string | null;
};

export type ReportResult = {
  report: string;
  columns: string[];
  rows: Record<string, unknown>[];
};
