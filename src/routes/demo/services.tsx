import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/demo/components/crud-page";
import { Badge } from "@/demo/components/ui/badge";
import { formatMoney, formatNumber } from "@/demo/lib/crm";
import { SERVICE_CATEGORIES } from "@/demo/lib/clinic";

export const Route = createFileRoute("/demo/services")({
  head: () => ({
    meta: [
      { title: "خدمات و محصولات | DaalCRM" },
      { name: "description", content: "مدیریت خدمات، محصولات، تعرفه و توضیحات قابل فروش." },
      { property: "og:title", content: "خدمات و محصولات | DaalCRM" },
      { property: "og:description", content: "مدیریت خدمات، مدت زمان و تعرفه." },
    ],
  }),
  component: ServicesPage,
});

type Service = {
  id: string;
  name: string;
  category: string | null;
  duration_min: number;
  price: number;
  is_active: boolean;
};

function ServicesPage() {
  return (
    <CrudPage<Service>
      table="services"
      title="خدمات و محصولات"
      description="تعرفه، مدت زمان و دسته‌بندی پیشنهادهای فروش"
      addLabel="خدمت یا محصول جدید"
      emptyText="هنوز خدمت یا محصولی تعریف نشده است."
      searchKeys={["name", "category"]}
      filters={[{ key: "category", label: "دسته", options: SERVICE_CATEGORIES }]}
      fields={[
        {
          name: "name",
          label: "نام خدمت یا محصول",
          required: true,
          placeholder: "مثلاً پشتیبانی سالانه",
        },
        { name: "category", label: "دسته‌بندی", type: "select", options: SERVICE_CATEGORIES },
        { name: "duration_min", label: "مدت (دقیقه)", type: "number", required: true },
        { name: "price", label: "تعرفه (تومان)", type: "number", required: true },
        { name: "description", label: "توضیحات", type: "textarea" },
      ]}
      columns={[
        { key: "name", label: "نام خدمت" },
        {
          key: "category",
          label: "دسته",
          render: (r) => (r.category ? <Badge variant="secondary">{r.category}</Badge> : "—"),
        },
        {
          key: "duration_min",
          label: "مدت",
          render: (r) => `${formatNumber(r.duration_min)} دقیقه`,
        },
        { key: "price", label: "تعرفه", render: (r) => formatMoney(r.price) },
      ]}
    />
  );
}
