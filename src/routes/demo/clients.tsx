import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/demo/components/crud-page";
import { B2BIntroducers } from "@/demo/components/b2b-introducers";
import { Badge } from "@/demo/components/ui/badge";
import { formatDate, toPersianDigits } from "@/demo/lib/crm";

export const Route = createFileRoute("/demo/clients")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "سرنخ‌ها | DaalCRM" },
      { name: "description", content: "ثبت، اولویت‌بندی و تبدیل سرنخ‌های فروش به مشتری." },
      { property: "og:title", content: "سرنخ‌ها | DaalCRM" },
      { property: "og:description", content: "سرنخ‌های ورودی و پیگیری اولیه فروش." },
    ],
  }),
  component: LeadsPage,
});

type Lead = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  created_at: string;
};

const SOURCES = [
  { value: "وب‌سایت", label: "وب‌سایت" },
  { value: "اینستاگرام", label: "اینستاگرام" },
  { value: "معرفی", label: "معرفی" },
  { value: "تماس ورودی", label: "تماس ورودی" },
  { value: "نمایشگاه", label: "نمایشگاه" },
  { value: "همکار فروش", label: "همکار فروش" },
  { value: "سایر", label: "سایر" },
];

function LeadsPage() {
  return (
    <CrudPage<Lead>
      syncUrlQuery
      table="contacts"
      title="سرنخ‌ها"
      description="ورودی‌های فروش را ثبت کنید و هیچ پیگیری‌ای را از دست ندهید."
      addLabel="سرنخ جدید"
      emptyText="هنوز سرنخی ثبت نشده است."
      searchKeys={["full_name", "phone", "email", "source"]}
      filters={[{ key: "source", label: "منبع ورود", options: SOURCES }]}
      fields={[
        { name: "full_name", label: "نام و نام خانوادگی", required: true },
        { name: "phone", label: "شماره تماس", required: true },
        { name: "email", label: "ایمیل", type: "email" },
        { name: "job_title", label: "سمت یا عنوان شغلی" },
        { name: "source", label: "منبع ورود", type: "select", options: SOURCES },
        { name: "notes", label: "یادداشت اولیه", type: "textarea" },
      ]}
      columns={[
        { key: "full_name", label: "نام" },
        {
          key: "phone",
          label: "تماس",
          render: (r) =>
            r.phone ? (
              <span dir="ltr" className="inline-block tabular-nums">
                {toPersianDigits(r.phone)}
              </span>
            ) : (
              "—"
            ),
        },
        {
          key: "source",
          label: "منبع ورود",
          render: (r) => (r.source ? <Badge variant="secondary">{r.source}</Badge> : "—"),
        },
        { key: "created_at", label: "تاریخ ثبت", render: (r) => formatDate(r.created_at) },
      ]}
      detailExtra={(lead) => (
        <B2BIntroducers entityType="contact" entityId={lead.id} entityLabel={lead.full_name} />
      )}
    />
  );
}
