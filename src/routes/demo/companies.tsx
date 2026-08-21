import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/demo/components/crud-page";
import { B2BIntroducers } from "@/demo/components/b2b-introducers";
import { formatDate } from "@/demo/lib/crm";

export const Route = createFileRoute("/demo/companies")({
  head: () => ({
    meta: [
      { title: "شرکت‌ها | DaalCRM" },
      { name: "description", content: "مدیریت شرکت‌ها و سازمان‌های مشتری با اطلاعات تماس و صنعت." },
      { property: "og:title", content: "شرکت‌ها | DaalCRM" },
      { property: "og:description", content: "مدیریت سازمان‌های مشتری." },
    ],
  }),
  component: Companies,
});

type Company = {
  id: string;
  name: string;
  industry: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  created_at: string;
};

function Companies() {
  return (
    <CrudPage<Company>
      table="companies"
      title="شرکت‌ها"
      description="سازمان‌هایی که با آن‌ها کار می‌کنید"
      addLabel="شرکت جدید"
      fields={[
        { name: "name", label: "نام شرکت", required: true },
        { name: "industry", label: "صنعت" },
        { name: "city", label: "شهر" },
        { name: "phone", label: "تلفن" },
        { name: "website", label: "وب‌سایت" },
        {
          name: "size",
          label: "اندازه سازمان",
          type: "select",
          options: [
            { value: "1-10", label: "۱ تا ۱۰ نفر" },
            { value: "11-50", label: "۱۱ تا ۵۰ نفر" },
            { value: "51-200", label: "۵۱ تا ۲۰۰ نفر" },
            { value: "200+", label: "بیش از ۲۰۰ نفر" },
          ],
        },
        { name: "notes", label: "یادداشت", type: "textarea" },
      ]}
      columns={[
        { key: "name", label: "نام" },
        { key: "industry", label: "صنعت" },
        { key: "city", label: "شهر" },
        { key: "phone", label: "تلفن" },
        { key: "created_at", label: "تاریخ ثبت", render: (r) => formatDate(r.created_at) },
      ]}
      detailExtra={(company) => (
        <B2BIntroducers entityType="company" entityId={company.id} entityLabel={company.name} />
      )}
      emptyText="هنوز شرکتی ثبت نشده است."
    />
  );
}
