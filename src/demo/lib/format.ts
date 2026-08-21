/**
 * فرمت‌کننده‌های متمرکز فارسی — عدد، پول، تاریخ شمسی.
 * همهٔ صفحات باید از اینجا (یا re-export در crm) استفاده کنند.
 */

const CURRENCY_LABELS: Record<string, string> = {
  IRT: "تومان",
  IRR: "ریال",
  USD: "دلار",
  EUR: "یورو",
};

export function currencyLabel(code?: string | null): string {
  return CURRENCY_LABELS[code || "IRT"] ?? (code || "تومان");
}

const faNumber = new Intl.NumberFormat("fa-IR");
const faNumberCompact = new Intl.NumberFormat("fa-IR", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

/** تقویم شمسی اجباری */
const FA_DATE = "fa-IR-u-ca-persian";

export function formatPersianNumber(value: number | null | undefined): string {
  return faNumber.format(Number(value ?? 0));
}

export const formatNumber = formatPersianNumber;

/** ارقام لاتین → فارسی (برای موبایل و متن‌های مختلط) */
export function toPersianDigits(value: string | number | null | undefined): string {
  if (value == null || value === "") return "";
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)] ?? d);
}

export function formatToman(value: number | null | undefined, currency?: string | null): string {
  return `${faNumber.format(Number(value ?? 0))} ${currencyLabel(currency)}`;
}

export const formatMoney = formatToman;

export function formatTomanCompact(
  value: number | null | undefined,
  currency?: string | null,
): string {
  const n = Number(value ?? 0);
  const unit = currencyLabel(currency);
  if (!Number.isFinite(n)) return `۰ ${unit}`;
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) {
    const v = n / 1_000_000_000;
    return `${faNumber.format(Number(v.toFixed(1)))} میلیارد ${unit}`;
  }
  if (abs >= 1_000_000) {
    const v = n / 1_000_000;
    return `${faNumber.format(Number(v.toFixed(1)))} میلیون ${unit}`;
  }
  if (abs >= 100_000) {
    return `${faNumberCompact.format(n)} ${unit}`;
  }
  return `${faNumber.format(n)} ${unit}`;
}

export function formatPersianDate(value?: string | Date | null): string {
  if (!value) return "—";
  try {
    const d = typeof value === "string" ? new Date(value) : value;
    return new Intl.DateTimeFormat(FA_DATE, { dateStyle: "medium" }).format(d);
  } catch {
    return "—";
  }
}

export const formatDate = formatPersianDate;

export function formatPersianDateTime(value?: string | Date | null): string {
  if (!value) return "—";
  try {
    const d = typeof value === "string" ? new Date(value) : value;
    return new Intl.DateTimeFormat(FA_DATE, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "—";
  }
}

export function formatPersianTime(value?: string | Date | null): string {
  if (!value) return "—";
  try {
    const d = typeof value === "string" ? new Date(value) : value;
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return "—";
  }
}

export function formatRelativePersianTime(value?: string | Date | null): string {
  if (!value) return "—";
  try {
    const d = typeof value === "string" ? new Date(value) : value;
    const diffMs = d.getTime() - Date.now();
    const rtf = new Intl.RelativeTimeFormat("fa-IR", { numeric: "auto" });
    const mins = Math.round(diffMs / 60_000);
    if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
    const hours = Math.round(mins / 60);
    if (Math.abs(hours) < 48) return rtf.format(hours, "hour");
    const days = Math.round(hours / 24);
    return rtf.format(days, "day");
  } catch {
    return "—";
  }
}
