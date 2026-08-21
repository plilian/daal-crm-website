import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listRowsFn, upsertRowFn, updateRowFn, deleteRowFn } from "@/demo/server/functions";

export {
  formatPersianNumber,
  formatNumber,
  toPersianDigits,
  formatToman,
  formatMoney,
  formatTomanCompact,
  formatPersianDate,
  formatDate,
  formatPersianDateTime,
  formatPersianTime,
  formatRelativePersianTime,
} from "./format";

export type Stage = "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export const STAGE_LABELS: Record<Stage, string> = {
  new: "سرنخ جدید",
  qualified: "واجد شرایط",
  proposal: "ارسال پیشنهاد",
  negotiation: "مذاکره",
  won: "برنده",
  lost: "از دست رفته",
};

export const STAGE_ORDER: Stage[] = ["new", "qualified", "proposal", "negotiation", "won", "lost"];

export const ACTIVITY_LABELS: Record<string, string> = {
  call: "تماس",
  sms: "پیامک",
  email: "ایمیل",
  meeting: "جلسه",
  note: "یادداشت",
  task: "وظیفه",
};

/** وضعیت پیگیری / فعالیت */
export const ACTIVITY_STATUSES = [
  { value: "in_progress", label: "در حال انجام" },
  { value: "done", label: "انجام شد" },
  { value: "deferred", label: "به تعویق افتاد" },
  { value: "cancelled", label: "لغو شد" },
] as const;

export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number]["value"];

export const ACTIVITY_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  ACTIVITY_STATUSES.map((s) => [s.value, s.label]),
);

export type TriggerType =
  "contact_created" | "deal_stage_changed" | "deal_won" | "activity_overdue" | "scheduled";

export type ActionType =
  "send_sms" | "send_email" | "create_task" | "call_webhook" | "ai_summarize";

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  contact_created: "ثبت مخاطب جدید",
  deal_stage_changed: "تغییر مرحله معامله",
  deal_won: "برنده شدن معامله",
  activity_overdue: "عقب‌افتادن وظیفه",
  scheduled: "زمان‌بندی‌شده (کرون)",
};

export const ACTION_LABELS: Record<ActionType, string> = {
  send_sms: "ارسال پیامک",
  send_email: "ارسال ایمیل",
  create_task: "ساخت وظیفه",
  call_webhook: "فراخوانی وب‌هوک",
  ai_summarize: "خلاصه‌سازی با هوش مصنوعی",
};

export const INTEGRATION_KIND_LABELS: Record<string, string> = {
  sms: "پیامک",
  email: "ایمیل",
  voip: "تماس و ویپ",
  postgres: "پایگاه‌داده",
};

/** واکشی ساده یک جدول */
export function useTable<T = Record<string, unknown>>(
  table: string,
  options?: { orderBy?: string; ascending?: boolean; select?: string },
) {
  return useQuery({
    queryKey: ["table", table, options?.select ?? "*"],
    queryFn: async () => {
      const data = await listRowsFn({
        data: {
          table,
          select: options?.select ?? "*",
          orderBy: options?.orderBy ?? "created_at",
          ascending: options?.ascending ?? false,
        },
      });
      return (data ?? []) as T[];
    },
  });
}

export function useUpsertRow(table: string, successMessage = "با موفقیت ذخیره شد") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const result = await upsertRowFn({ data: { table, values } });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table", table] });
      toast.success(successMessage);
    },
    onError: (error: Error) => toast.error(`خطا: ${error.message}`),
  });
}

/** به‌روزرسانی جزئی یک ردیف */
export function useUpdateRow(table: string, successMessage = "به‌روزرسانی شد") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const result = await updateRowFn({ data: { table, id, values } });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table", table] });
      toast.success(successMessage);
    },
    onError: (error: Error) => toast.error(`خطا: ${error.message}`),
  });
}

export function useDeleteRow(table: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteRowFn({ data: { table, id } });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table", table] });
      toast.success("حذف شد");
    },
    onError: (error: Error) => toast.error(`خطا در حذف: ${error.message}`),
  });
}
