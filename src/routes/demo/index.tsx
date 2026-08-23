import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpLeft, CheckCircle2, Eye, ShieldCheck } from "lucide-react";
import { getDemoAccessFn, startDemoFn } from "@/demo/server/functions";
import { BrandMark } from "@/demo/components/brand-mark";
import { ThemeToggle } from "@/demo/components/app-shell";
import { Button } from "@/demo/components/ui/button";
import { Input } from "@/demo/components/ui/input";
import { Label } from "@/demo/components/ui/label";
import { Textarea } from "@/demo/components/ui/textarea";
import { toast } from "sonner";
import {
  canonicalLinks,
  getDemoStructuredData,
  OFFICIAL_DAAL_URL,
  publicSocialMeta,
} from "@/demo/lib/seo";

export const Route = createFileRoute("/demo/")({
  beforeLoad: async () => {
    if (await getDemoAccessFn()) throw redirect({ to: "/demo/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "مشاهده CRM دال | دموی سامانه مدیریت مشتریان" },
      {
        name: "description",
        content:
          "مشخصات خود را وارد کنید و محیط واقعی CRM دال را با داده‌های نمونه و دسترسی فقط مشاهده ببینید.",
      },
      { name: "robots", content: "noindex,nofollow,noarchive" },
      ...publicSocialMeta({
        title: "مشاهده CRM دال | دموی سامانه مدیریت مشتریان",
        description: "ورود به محیط واقعی CRM دال با داده‌های نمونه و دسترسی فقط مشاهده.",
        pathname: "/demo",
      }),
    ],
    links: canonicalLinks("/demo"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(getDemoStructuredData("/demo")) },
    ],
  }),
  component: DemoGatePage,
});

type DemoForm = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  teamSize: string;
  useCase: string;
  message: string;
  website: string;
};

const initialForm: DemoForm = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  teamSize: "",
  useCase: "",
  message: "",
  website: "",
};

function DemoGatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<DemoForm>(initialForm);
  const [loading, setLoading] = useState(false);

  function update(field: keyof DemoForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.email.trim() && !form.phone.trim()) {
      toast.error("حداقل ایمیل یا شماره تماس را وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      await startDemoFn({ data: form });
      toast.success("دمو آماده است");
      navigate({ to: "/demo/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "باز کردن دمو انجام نشد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="marketing-page demo-gate-page min-h-svh bg-[#f7f2ea] text-[#1f1410] dark:bg-[#1f1410] dark:text-[#fff8ef]">
      <header className="border-b border-slate-200/80 bg-[#f7f2ea]/95 dark:border-slate-800 dark:bg-[#1f1410]/95">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <BrandMark
                className="size-9 rounded-xl p-1"
                markClassName="rounded-lg text-xs"
                decorative
              />
              <span className="brand-mark text-base tracking-tight">دال</span>
            </Link>
            <a
              href={OFFICIAL_DAAL_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden border-s border-slate-200 ps-3 text-[11px] text-slate-500 underline-offset-4 hover:text-slate-950 hover:underline sm:inline-flex dark:border-slate-700 dark:hover:text-white"
            >
              محصول گروه فناوری دال · daalgp.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link to="/" className="gap-1.5">
                <ArrowLeft className="size-3.5" /> بازگشت
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <section className="max-w-md lg:sticky lg:top-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm font-bold text-primary">دموی واقعی محصول</p>
            <a
              href={OFFICIAL_DAAL_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-medium text-slate-500 underline underline-offset-4 hover:text-primary dark:text-slate-400"
            >
              محصول گروه فناوری دال · daalgp.com
            </a>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-[1.25] tracking-tight sm:text-4xl">
            قبل از خرید، مسیر فروش را با دادهٔ نمونه ببینید.
          </h1>
          <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
            فرم کوتاه را تکمیل کنید و وارد همان فضای واقعی DaalCRM شوید. صفحه‌ها واقعی‌اند، داده‌ها
            نمونه‌اند و در این محیط هیچ تغییری ذخیره نمی‌شود.
          </p>
          <div className="mt-9 space-y-5">
            <Feature
              icon={Eye}
              title="از سرنخ تا دریافت"
              text="داشبورد، مخاطب، شرکت، معامله، پیگیری، فاکتور، پرداخت و گزارش را در یک مسیر ببینید."
            />
            <Feature
              icon={ShieldCheck}
              title="فقط مشاهده، بدون تغییر"
              text="ثبت، حذف، ارسال پیام، اتصال بیرونی و پرداخت واقعی در محیط دمو غیرفعال است."
            />
            <Feature
              icon={CheckCircle2}
              title="دادهٔ نمونهٔ آماده"
              text="صفحه‌ها خالی نیستند؛ یک سناریوی فروش با مشتری، سفارش، فروشنده، فاکتور و پرداخت آماده است."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-40px_rgb(31_20_16_/_0.55)] sm:p-10">
          <form className="space-y-5" onSubmit={submit}>
            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                مشخصات تماس برای بازکردن دمو
              </h2>
              <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                نام و نام شرکت را وارد کنید؛ برای بازشدن دمو، ایمیل یا شماره تماس کافی است. بعد از
                ارسال فرم، مستقیم وارد محیط نمونه می‌شوید.
              </p>
            </div>
            <div className="hidden" aria-hidden="true">
              <Input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => update("website", event.target.value)}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="نام و نام خانوادگی"
                id="fullName"
                value={form.fullName}
                required
                onChange={(value) => update("fullName", value)}
                placeholder="علی علیزاده"
              />
              <Field
                label="نام شرکت"
                id="company"
                value={form.company}
                required
                onChange={(value) => update("company", value)}
                placeholder="گروه فناوری دال"
              />
              <Field
                label="ایمیل"
                id="email"
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(value) => update("email", value)}
                placeholder="name@company.ir"
              />
              <Field
                label="شماره تماس"
                id="phone"
                dir="ltr"
                value={form.phone}
                onChange={(value) => update("phone", value)}
                placeholder="۰۹۱۲۱۲۳۴۵۶۷"
              />
              <SelectField
                label="تعداد کاربران"
                id="teamSize"
                value={form.teamSize}
                onChange={(value) => update("teamSize", value)}
                options={["۱ تا ۵ نفر", "۶ تا ۲۰ نفر", "۲۱ تا ۵۰ نفر", "بیش از ۵۰ نفر"]}
              />
              <SelectField
                label="نیاز اصلی"
                id="useCase"
                value={form.useCase}
                onChange={(value) => update("useCase", value)}
                options={[
                  "مدیریت سرنخ و قیف فروش",
                  "پیگیری تیم فروش",
                  "راه‌اندازی روی سرور سازمان",
                  "گزارش‌گیری و مدیریت عملکرد",
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">
                توضیحات تکمیلی <span className="font-normal text-muted-foreground">(اختیاری)</span>
              </Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
                placeholder="کدام بخش CRM برای شما مهم‌تر است؟"
                rows={4}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 rounded-full"
              disabled={loading}
            >
              {loading ? "در حال آماده‌سازی…" : "مشاهدهٔ دموی CRM"}
              <ArrowUpLeft className="size-4" />
            </Button>
            <p className="text-center text-[11px] leading-5 text-muted-foreground">
              محیط بعدی فقط برای مشاهده است؛ اطلاعات نمونه قابل تغییر یا استفادهٔ عملی نیست.
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  dir,
  required = false,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  dir?: "ltr" | "rtl";
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ms-1 text-destructive">*</span> : null}
      </Label>
      <Input
        id={id}
        type={type}
        dir={dir}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({
  label,
  id,
  value,
  onChange,
  options,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
      >
        <option value="">انتخاب کنید</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Eye; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
        <Icon className="size-4" />
      </span>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">{text}</p>
      </div>
    </div>
  );
}
