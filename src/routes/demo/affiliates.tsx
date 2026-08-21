import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "@/demo/components/app-shell";
import { CrudPage } from "@/demo/components/crud-page";
import { Badge } from "@/demo/components/ui/badge";
import { Card, CardContent } from "@/demo/components/ui/card";
import { formatDate, formatMoney, formatNumber, useTable } from "@/demo/lib/crm";
import { AFFILIATE_STATUSES } from "@/demo/lib/clinic";
import { Copy, Handshake, Link2, Share2, Users, Wallet } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/demo/affiliates")({
  head: () => ({
    meta: [
      { title: "همکاران فروش | DaalCRM" },
      {
        name: "description",
        content: "مدیریت برنامه معرفی، لینک ارجاع و کمیسیون همکاران فروش.",
      },
      { property: "og:title", content: "همکاران فروش | DaalCRM" },
    ],
  }),
  component: AffiliatesPage,
});

type Affiliate = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  code: string;
  commission_percent: number;
  status: string;
  bank_account: string | null;
  created_at: string;
};

type Referral = {
  id: string;
  affiliate_id: string;
  contact_id: string | null;
  company_id: string | null;
  status: string;
  commission_percent: number | null;
  converted_value: number;
  commission_amount: number;
  meeting_at: string | null;
  introduction_channel: string;
  referred_at: string;
  affiliates?: { name: string; code: string } | null;
  contacts?: { full_name: string } | null;
  companies?: { name: string } | null;
};

const REFERRAL_STATUSES = [
  { value: "introduced", label: "معرفی اولیه" },
  { value: "meeting_scheduled", label: "جلسه هماهنگ شد" },
  { value: "meeting_held", label: "جلسه برگزار شد" },
  { value: "proposal", label: "پیشنهاد ارسال شد" },
  { value: "won", label: "قرارداد منعقد شد" },
  { value: "commission_due", label: "کمیسیون قابل پرداخت" },
  { value: "paid", label: "کمیسیون پرداخت شد" },
  { value: "lost", label: "نتیجه نداشت" },
  { value: "lead", label: "ثبت از لینک" },
  { value: "qualified", label: "واجد شرایط" },
  { value: "converted", label: "تبدیل‌شده" },
  { value: "rejected", label: "رد شده" },
];

function copyReferralLink(code: string) {
  const link = `${window.location.origin}/auth?ref=${encodeURIComponent(code)}`;
  navigator.clipboard
    ?.writeText(link)
    .then(() => toast.success("لینک ارجاع کپی شد"))
    .catch(() => toast.error(link));
}

function AffiliatesPage() {
  const { data: affiliates } = useTable<Affiliate>("affiliates");
  const { data: companies } = useTable<{ id: string; name: string }>("companies", {
    select: "id, name",
  });
  const { data: contacts } = useTable<{ id: string; full_name: string }>("contacts", {
    select: "id, full_name",
  });
  const referralOptions = useMemo(
    () => [
      { value: "", label: "انتخاب معرف" },
      ...(affiliates ?? []).map((affiliate) => ({ value: affiliate.id, label: affiliate.name })),
    ],
    [affiliates],
  );
  const companyOptions = useMemo(
    () => [
      { value: "", label: "بدون اتصال به شرکت" },
      ...(companies ?? []).map((company) => ({ value: company.id, label: company.name })),
    ],
    [companies],
  );
  const contactOptions = useMemo(
    () => [
      { value: "", label: "بدون اتصال به سرنخ" },
      ...(contacts ?? []).map((contact) => ({ value: contact.id, label: contact.full_name })),
    ],
    [contacts],
  );
  const { data: referrals } = useTable<Referral>("affiliate_referrals", {
    select:
      "id, affiliate_id, contact_id, company_id, status, commission_percent, converted_value, commission_amount, meeting_at, introduction_channel, referred_at, affiliates(name, code), contacts(full_name), companies(name)",
  });
  const activeCount = (affiliates ?? []).filter((item) => item.status === "active").length;
  const converted = (referrals ?? []).filter((item) =>
    ["won", "converted", "commission_due", "paid"].includes(item.status),
  );
  const commissionDue = (referrals ?? [])
    .filter((item) => ["won", "converted", "commission_due"].includes(item.status))
    .reduce((sum, item) => sum + Number(item.commission_amount ?? 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="برنامه همکاران فروش"
        description="معرف‌ها می‌توانند با لینک یا با معرفی مستقیم شرکت و هماهنگی جلسه، فرصت B2B بسازند و سهم کمیسیون‌شان را شفاف ببینند."
        action={<Handshake className="size-5 text-primary" aria-hidden />}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="همکار فعال" value={formatNumber(activeCount)} icon={Users} />
        <Metric label="تبدیل‌شده" value={formatNumber(converted.length)} icon={Share2} />
        <Metric label="کمیسیون در انتظار" value={formatMoney(commissionDue)} icon={Wallet} />
      </div>

      <CrudPage<Affiliate>
        table="affiliates"
        title="همکاران فروش"
        description="شخص، شرکت همکار یا مشاوری که فرصت فروش را معرفی می‌کند."
        addLabel="همکار جدید"
        emptyText="هنوز همکار فروشی ثبت نشده است."
        searchKeys={["name", "email", "phone", "code"]}
        filters={[{ key: "status", label: "وضعیت", options: [...AFFILIATE_STATUSES] }]}
        fields={[
          { name: "name", label: "نام همکار یا مجموعه", required: true },
          { name: "email", label: "ایمیل", type: "email" },
          { name: "phone", label: "شماره تماس" },
          { name: "code", label: "کد ارجاع", required: true, placeholder: "PARTNER-01" },
          { name: "commission_percent", label: "درصد کمیسیون", type: "number", required: true },
          { name: "status", label: "وضعیت", type: "select", options: [...AFFILIATE_STATUSES] },
          { name: "bank_account", label: "شماره شبا" },
          { name: "notes", label: "یادداشت", type: "textarea" },
        ]}
        columns={[
          { key: "name", label: "همکار" },
          {
            key: "code",
            label: "لینک اختیاری",
            render: (row) => (
              <button
                type="button"
                onClick={() => copyReferralLink(row.code)}
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
                title="کپی لینک ارجاع"
              >
                <span dir="ltr">{row.code}</span>
                <Copy className="size-3.5" />
              </button>
            ),
          },
          {
            key: "commission_percent",
            label: "کمیسیون",
            render: (row) => `${formatNumber(row.commission_percent)}٪`,
          },
          {
            key: "status",
            label: "وضعیت",
            render: (row) => (
              <Badge variant={row.status === "active" ? "secondary" : "outline"}>
                {AFFILIATE_STATUSES.find((item) => item.value === row.status)?.label ?? row.status}
              </Badge>
            ),
          },
          { key: "created_at", label: "تاریخ ثبت", render: (row) => formatDate(row.created_at) },
        ]}
      />

      <CrudPage<Referral>
        table="affiliate_referrals"
        title="معرفی‌ها و سهم کمیسیون"
        description="برای معرفی B2B یک شرکت یا سرنخ را انتخاب کنید؛ یک مورد می‌تواند حداکثر سه معرف مستقل داشته باشد."
        addLabel="ثبت معرفی B2B"
        emptyText="هنوز معرفی فروشی ثبت نشده است."
        select="id, affiliate_id, contact_id, company_id, status, commission_percent, converted_value, commission_amount, meeting_at, introduction_channel, referred_at, affiliates(name, code), contacts(full_name), companies(name)"
        searchKeys={["status"]}
        filters={[{ key: "status", label: "وضعیت", options: REFERRAL_STATUSES }]}
        fields={[
          {
            name: "affiliate_id",
            label: "همکار فروش",
            type: "select",
            options: referralOptions,
            required: true,
          },
          {
            name: "company_id",
            label: "شرکت معرفی‌شده (فقط یکی از شرکت یا سرنخ)",
            type: "select",
            options: companyOptions,
          },
          {
            name: "contact_id",
            label: "سرنخ معرفی‌شده (فقط یکی از شرکت یا سرنخ)",
            type: "select",
            options: contactOptions,
          },
          { name: "status", label: "وضعیت", type: "select", options: REFERRAL_STATUSES },
          { name: "commission_percent", label: "درصد کمیسیون", type: "number" },
          { name: "converted_value", label: "ارزش قرارداد (تومان)", type: "number" },
          { name: "commission_amount", label: "کمیسیون (تومان)", type: "number" },
          { name: "meeting_at", label: "زمان جلسه", type: "datetime-local" },
          { name: "meeting_note", label: "یادداشت جلسه", type: "textarea" },
          { name: "source_url", label: "لینک ارجاع (اختیاری)" },
          { name: "notes", label: "یادداشت", type: "textarea" },
        ]}
        columns={[
          { key: "affiliate", label: "همکار", render: (row) => row.affiliates?.name ?? "—" },
          {
            key: "target",
            label: "فرصت معرفی‌شده",
            render: (row) => row.companies?.name ?? row.contacts?.full_name ?? "لینک آنلاین",
          },
          {
            key: "status",
            label: "وضعیت",
            render: (row) =>
              REFERRAL_STATUSES.find((item) => item.value === row.status)?.label ?? row.status,
          },
          {
            key: "commission_percent",
            label: "سهم",
            render: (row) =>
              row.commission_percent == null ? "—" : `${formatNumber(row.commission_percent)}٪`,
          },
          {
            key: "converted_value",
            label: "ارزش",
            render: (row) => formatMoney(row.converted_value),
          },
          {
            key: "commission_amount",
            label: "کمیسیون",
            render: (row) => formatMoney(row.commission_amount),
          },
          {
            key: "meeting_at",
            label: "جلسه",
            render: (row) => (row.meeting_at ? formatDate(row.meeting_at) : "—"),
          },
          { key: "referred_at", label: "تاریخ", render: (row) => formatDate(row.referred_at) },
        ]}
      />
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Users;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
        </div>
        <Icon className="size-5 text-primary" />
      </CardContent>
    </Card>
  );
}
