import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CrudPage } from "@/demo/components/crud-page";
import { AccessDenied } from "@/demo/components/app-shell";
import { Badge } from "@/demo/components/ui/badge";
import { useAuth } from "@/demo/hooks/use-auth";
import { formatDate, formatNumber, useTable } from "@/demo/lib/crm";
import { CAMPAIGN_CHANNELS, CAMPAIGN_STATUSES } from "@/demo/lib/clinic";

export const Route = createFileRoute("/demo/campaigns")({
  head: () => ({
    meta: [
      { title: "کمپین‌های ارتباطی | DaalCRM" },
      {
        name: "description",
        content: "کمپین‌های پیامکی و ایمیلی برای پیگیری و فعال‌سازی مشتریان.",
      },
      { property: "og:title", content: "کمپین‌های ارتباطی | DaalCRM" },
      { property: "og:description", content: "کمپین پیامکی/ایمیلی و امتیاز وفاداری." },
    ],
  }),
  component: CampaignsPage,
});

type Campaign = {
  id: string;
  name: string;
  channel: string;
  status: string;
  scheduled_at: string | null;
  sent_count: number;
};

type Loyalty = {
  id: string;
  contact_id: string;
  points: number;
  reason: string | null;
  created_at: string;
  contacts?: { full_name: string } | null;
};

function CampaignsPage() {
  const { has, loading } = useAuth();
  const { data: contacts } = useTable<{ id: string; full_name: string }>("contacts", {
    select: "id, full_name",
  });
  const contactOptions = useMemo(
    () => (contacts ?? []).map((c) => ({ value: c.id, label: c.full_name })),
    [contacts],
  );

  if (loading) return <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>;
  if (!has("admin", "manager", "marketing")) return <AccessDenied />;

  return (
    <div className="space-y-12">
      <CrudPage<Campaign>
        table="campaigns"
        title="کمپین‌های بازاریابی"
        description="یک قالب کلی بنویسید؛ با متغیرهایی مثل نام و شماره، هر مخاطب پیام شخصی خودش را می‌گیرد"
        addLabel="کمپین جدید"
        emptyText="هنوز کمپینی ساخته نشده است."
        searchKeys={["name"]}
        filters={[{ key: "channel", label: "کانال", options: CAMPAIGN_CHANNELS }]}
        fields={[
          { name: "name", label: "نام کمپین", required: true },
          { name: "channel", label: "کانال", type: "select", options: CAMPAIGN_CHANNELS },
          { name: "status", label: "وضعیت", type: "select", options: CAMPAIGN_STATUSES },
          { name: "audience", label: "مخاطبان", placeholder: "همه مشتریان / سرنخ‌های گرم" },
          { name: "scheduled_at", label: "زمان ارسال", type: "datetime-local" },
          {
            name: "message",
            label: "متن پیام (قابل شخصی‌سازی)",
            type: "textarea",
            placeholders: true,
          },
        ]}
        columns={[
          { key: "name", label: "کمپین" },
          {
            key: "channel",
            label: "کانال",
            render: (r) => (
              <Badge variant="secondary">
                {CAMPAIGN_CHANNELS.find((c) => c.value === r.channel)?.label ?? r.channel}
              </Badge>
            ),
          },
          {
            key: "status",
            label: "وضعیت",
            render: (r) => CAMPAIGN_STATUSES.find((s) => s.value === r.status)?.label ?? r.status,
          },
          { key: "scheduled_at", label: "زمان ارسال", render: (r) => formatDate(r.scheduled_at) },
          { key: "sent_count", label: "ارسال‌شده", render: (r) => formatNumber(r.sent_count) },
        ]}
      />

      <CrudPage<Loyalty>
        table="loyalty_transactions"
        title="باشگاه مشتریان"
        description="ثبت و کسر امتیاز وفاداری مشتریان — در کمپین‌های مرتبط می‌توانید پیام شخصی بفرستید"
        addLabel="ثبت امتیاز"
        emptyText="هنوز امتیازی ثبت نشده است."
        select="id, contact_id, points, reason, created_at, contacts(full_name)"
        searchKeys={["reason"]}
        fields={[
          {
            name: "contact_id",
            label: "مخاطب",
            type: "select",
            options: contactOptions,
            required: true,
          },
          { name: "points", label: "امتیاز (منفی = کسر)", type: "number", required: true },
          { name: "reason", label: "بابت", placeholder: "مثلاً معرفی دوست" },
        ]}
        columns={[
          { key: "contact", label: "مخاطب", render: (r) => r.contacts?.full_name ?? "—" },
          {
            key: "points",
            label: "امتیاز",
            render: (r) => (
              <Badge variant={r.points >= 0 ? "secondary" : "destructive"}>
                {formatNumber(r.points)}
              </Badge>
            ),
          },
          { key: "reason", label: "بابت" },
          { key: "created_at", label: "تاریخ", render: (r) => formatDate(r.created_at) },
        ]}
      />
    </div>
  );
}
