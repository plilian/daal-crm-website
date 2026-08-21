import { useEffect, useMemo, useState, type ComponentType } from "react";
import DatePickerImport from "react-multi-date-picker";
import TimePickerImport from "react-multi-date-picker/plugins/time_picker";
import DateObjectImport from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import { cn } from "@/demo/lib/utils";

/** CJS/ESM interop — Vite may hand us `{ default: Component }` */
function asComponent<T>(mod: unknown): T {
  let cur: unknown = mod;
  for (let i = 0; i < 3; i++) {
    if (!cur) break;
    if (typeof cur === "function") return cur as T;
    if (typeof cur === "object" && cur !== null && "$$typeof" in cur) return cur as T;
    if (typeof cur === "object" && cur !== null && "default" in cur) {
      cur = (cur as { default: unknown }).default;
      continue;
    }
    break;
  }
  return cur as T;
}

type DateObjectCtor = new (...args: never[]) => {
  convert: (c: unknown) => {
    setLocale: (l: unknown) => void;
    toDate: () => Date;
    format: (f: string) => string;
    convert: (c: unknown) => { toDate: () => Date; format: (f: string) => string };
  };
  toDate: () => Date;
  setLocale: (l: unknown) => void;
  format: (f: string) => string;
};

const DatePicker = asComponent<ComponentType<Record<string, unknown>>>(DatePickerImport);
const TimePicker = asComponent<ComponentType<Record<string, unknown>>>(TimePickerImport);
const DateObj = asComponent<DateObjectCtor>(DateObjectImport);

function toJalali(value?: string | null, withTime = false) {
  if (!value) return null;
  try {
    const raw = withTime && !value.includes("T") ? `${value}T00:00:00` : value;
    const g = new DateObj({ date: new Date(raw), calendar: gregorian } as never);
    if (Number.isNaN(g.toDate().getTime())) return null;
    const j = g.convert(persian);
    j.setLocale(persian_fa);
    return j;
  } catch {
    return null;
  }
}

function toGregorianIso(value: unknown, withTime: boolean): string {
  if (!value || Array.isArray(value)) return "";
  try {
    const obj =
      value && typeof value === "object" && "convert" in value
        ? (value as InstanceType<DateObjectCtor>)
        : new DateObj(value as never);
    const g = obj.convert(gregorian);
    if (withTime) {
      const d = g.toDate();
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${g.format("YYYY-MM-DD")}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    return g.format("YYYY-MM-DD");
  } catch {
    return "";
  }
}

const inputClass =
  "rmdp-input h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground";

/** انتخابگر تاریخ شمسی — مقدار ذخیره‌شده میلادی برای API */
export function JalaliDateField({
  name,
  defaultValue,
  required,
  withTime = false,
  className,
  onChange,
  value: controlled,
}: {
  name?: string;
  defaultValue?: string | null;
  required?: boolean;
  withTime?: boolean;
  className?: string;
  value?: string | null;
  onChange?: (iso: string) => void;
}) {
  const initial = useMemo(
    () => toJalali(controlled ?? defaultValue ?? null, withTime),
    // mount-only default
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [picked, setPicked] = useState(initial);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const iso = controlled !== undefined ? (controlled ?? "") : toGregorianIso(picked, withTime);

  return (
    <div className={cn("w-full", className)} dir="rtl">
      {name ? (
        <input type="hidden" name={name} value={iso} required={Boolean(required)} readOnly />
      ) : null}
      {!mounted ? (
        <input
          className={inputClass}
          readOnly
          dir="rtl"
          placeholder={withTime ? "۱۴۰۴/۰۱/۰۱ ۱۲:۰۰" : "۱۴۰۴/۰۱/۰۱"}
          value=""
          aria-label="تاریخ شمسی"
        />
      ) : (
        <DatePicker
          value={controlled !== undefined ? toJalali(controlled, withTime) : picked}
          onChange={(v: unknown) => {
            setPicked(v as typeof initial);
            onChange?.(toGregorianIso(v, withTime));
          }}
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          format={withTime ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD"}
          {...(withTime
            ? { plugins: [<TimePicker key="tp" position="bottom" hideSeconds />] }
            : {})}
          containerClassName="w-full"
          inputClass={inputClass}
          placeholder={withTime ? "۱۴۰۴/۰۱/۰۱ ۱۲:۰۰" : "۱۴۰۴/۰۱/۰۱"}
        />
      )}
    </div>
  );
}
