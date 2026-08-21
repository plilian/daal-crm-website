import type { Role } from "@/demo/hooks/use-auth";
import {
  currencyLabel as formatCurrencyLabel,
  formatPersianDateTime,
  formatPersianTime,
} from "./format";

export type AppointmentStatus = "booked" | "confirmed" | "completed" | "cancelled" | "no_show";

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  booked: "برنامه‌ریزی‌شده",
  confirmed: "تأیید شده",
  completed: "انجام شده",
  cancelled: "لغو شده",
  no_show: "برگزار نشد",
};

export const APPOINTMENT_STATUS_OPTIONS = (
  Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatus[]
).map((value) => ({ value, label: APPOINTMENT_STATUS_LABELS[value] }));

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: "پیش‌نویس",
  unpaid: "پرداخت‌نشده",
  partial: "پرداخت جزئی",
  paid: "تسویه شده",
  void: "باطل",
};

export const PAYMENT_METHODS = [
  { value: "cash", label: "نقدی" },
  { value: "card", label: "کارت‌خوان" },
  { value: "transfer", label: "کارت به کارت / انتقال" },
  { value: "online", label: "درگاه آنلاین" },
  { value: "package", label: "اعتباری" },
];

export const CURRENCIES = [
  { value: "IRT", label: "تومان" },
  { value: "IRR", label: "ریال" },
  { value: "USD", label: "دلار" },
  { value: "EUR", label: "یورو" },
];

export function currencyLabel(code?: string | null): string {
  return formatCurrencyLabel(code);
}

/** متغیرهای قابل‌درج در قالب پیام و عنوان وظیفه اتوماسیون‌ها */
export const PLACEHOLDER_META: { token: string; label: string }[] = [
  { token: "{full_name}", label: "نام کامل" },
  { token: "{first_name}", label: "نام" },
  { token: "{last_name}", label: "نام خانوادگی" },
  { token: "{company}", label: "نام شرکت / سازمان" },
  { token: "{phone}", label: "شماره تماس" },
  { token: "{email}", label: "ایمیل" },
  { token: "{date}", label: "تاریخ امروز (شمسی)" },
  { token: "{deal}", label: "عنوان معامله" },
  { token: "{amount}", label: "مبلغ معامله" },
  { token: "{stage}", label: "مرحله معامله" },
];

export const SERVICE_CATEGORIES = [
  { value: "مشاوره", label: "مشاوره" },
  { value: "پیاده‌سازی", label: "پیاده‌سازی" },
  { value: "پشتیبانی", label: "پشتیبانی" },
  { value: "آموزش", label: "آموزش" },
  { value: "نرم‌افزار", label: "نرم‌افزار" },
  { value: "خدمات حرفه‌ای", label: "خدمات حرفه‌ای" },
  { value: "سایر", label: "سایر" },
];

export const SKIN_TYPES = [
  { value: "سازمان کوچک", label: "سازمان کوچک" },
  { value: "سازمان متوسط", label: "سازمان متوسط" },
  { value: "سازمان بزرگ", label: "سازمان بزرگ" },
  { value: "استراتژیک", label: "استراتژیک" },
  { value: "در حال ارزیابی", label: "در حال ارزیابی" },
];

export const AFFILIATE_STATUSES = [
  { value: "active", label: "فعال" },
  { value: "paused", label: "متوقف" },
  { value: "pending", label: "در انتظار بررسی" },
] as const;

export const CAMPAIGN_CHANNELS = [
  { value: "sms", label: "پیامک" },
  { value: "email", label: "ایمیل" },
];

export const CAMPAIGN_STATUSES = [
  { value: "draft", label: "پیش‌نویس" },
  { value: "scheduled", label: "زمان‌بندی‌شده" },
  { value: "sent", label: "ارسال شده" },
];

export const WEEKDAYS = [
  { value: "0", label: "شنبه" },
  { value: "1", label: "یکشنبه" },
  { value: "2", label: "دوشنبه" },
  { value: "3", label: "سه‌شنبه" },
  { value: "4", label: "چهارشنبه" },
  { value: "5", label: "پنجشنبه" },
  { value: "6", label: "جمعه" },
];

/** ساعت به وقت محلی */
export function formatTime(value?: string | null) {
  return formatPersianTime(value);
}

export function formatDateTime(value?: string | null) {
  return formatPersianDateTime(value);
}

/** yyyy-mm-dd محلی */
export function toDateKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function dayRange(dateKey: string) {
  const start = new Date(`${dateKey}T00:00:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

/** برچسب تاریخ شمسی برای یک روز */
export function jalaliDayLabel(dateKey: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${dateKey}T00:00:00`));
  } catch {
    return dateKey;
  }
}

/** دسترسی هر بخش بر اساس نقش */
export const SECTION_ROLES: Record<string, Role[]> = {
  finance: ["admin", "manager", "reception"],
  clinical: ["admin", "manager", "reception", "practitioner"],
  marketing: ["admin", "manager", "marketing"],
  adminOnly: ["admin", "manager"],
};
