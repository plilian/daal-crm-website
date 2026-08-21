import { createServerFn } from "@tanstack/react-start";
import {
  clearDemoAccess,
  createDemoLead,
  getDemoReport,
  getDemoUser,
  isDemoRequest,
  listDemoRows,
  startDemo,
} from "./demo.server";
import type { DemoLeadInput } from "./demo.server";
import type {
  DeleteInput,
  InsertInput,
  IntegrationTestResult,
  ListInput,
  PublicUser,
  ReportInput,
  ReportResult,
  Role,
  UpdateInput,
  UpsertInput,
} from "./types";

const READ_ONLY_MESSAGE = "دموی عمومی فقط برای مشاهده است و امکان تغییر اطلاعات ندارد.";

function readOnlyError(): never {
  throw new Error(READ_ONLY_MESSAGE);
}

export const getMe = createServerFn({ method: "POST" }).handler(async (): Promise<PublicUser> => {
  return getDemoUser();
});

export const getDemoAccessFn = createServerFn({ method: "POST" }).handler(async () => {
  return isDemoRequest();
});

export const startDemoFn = createServerFn({ method: "POST", strict: false })
  .validator((input: DemoLeadInput) => input)
  .handler(async ({ data }) => startDemo(data));

export const requestDemoFn = createServerFn({ method: "POST", strict: false })
  .validator((input: DemoLeadInput) => input)
  .handler(async ({ data }) => createDemoLead(data));

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  clearDemoAccess();
  return { ok: true };
});

export const getDbStatusFn = createServerFn({ method: "POST" }).handler(async () => ({
  configured: true,
}));

export const listRowsFn = createServerFn({ method: "POST", strict: false })
  .validator((input: ListInput) => input)
  .handler(async ({ data }) => listDemoRows(data));

export const getRowFn = createServerFn({ method: "POST", strict: false })
  .validator((input: { table: string; id: string; select?: string }) => input)
  .handler(async ({ data }) => {
    const input: ListInput = {
      table: data.table,
      filters: [{ column: "id", op: "eq", value: data.id }],
      limit: 1,
    };
    if (data.select !== undefined) input.select = data.select;
    const rows = listDemoRows(input);
    return rows[0] ?? null;
  });

export const insertRowFn = createServerFn({ method: "POST", strict: false })
  .validator((input: InsertInput) => input)
  .handler(async () => readOnlyError());

export const upsertRowFn = createServerFn({ method: "POST", strict: false })
  .validator((input: UpsertInput) => input)
  .handler(async () => readOnlyError());

export const updateRowFn = createServerFn({ method: "POST", strict: false })
  .validator((input: UpdateInput) => input)
  .handler(async () => readOnlyError());

export const deleteRowFn = createServerFn({ method: "POST", strict: false })
  .validator((input: DeleteInput) => input)
  .handler(async () => readOnlyError());

export const changeUserRoleFn = createServerFn({ method: "POST" })
  .validator((input: { userId: string; role: Role }) => input)
  .handler(async () => readOnlyError());

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((input: { fullName?: string; phone?: string }) => input)
  .handler(async () => readOnlyError());

export const syncContactToHesabfaFn = createServerFn({ method: "POST" })
  .validator((input: { contactId: string }) => input)
  .handler(async (): Promise<IntegrationTestResult> => ({
    ok: false,
    message: READ_ONLY_MESSAGE,
  }));

export const createZarinpalPaymentFn = createServerFn({ method: "POST" })
  .validator((input: { invoiceId: string }) => input)
  .handler(async (): Promise<{ paymentUrl: string }> => readOnlyError());

export const testIntegrationFn = createServerFn({ method: "POST" })
  .validator((input: { kind: string }) => input)
  .handler(async (): Promise<IntegrationTestResult> => ({
    ok: false,
    message: READ_ONLY_MESSAGE,
  }));

export const runReportFn = createServerFn({ method: "POST", strict: false })
  .validator((input: ReportInput) => input)
  .handler(async ({ data }): Promise<ReportResult> => getDemoReport(data.report));

export type {
  DeleteInput,
  InsertInput,
  IntegrationTestResult,
  ListInput,
  PublicUser,
  ReportInput,
  ReportResult,
  Role,
  UpdateInput,
  UpsertInput,
};
