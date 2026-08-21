import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CrudPage } from "@/demo/components/crud-page";
import { formatDate } from "@/demo/lib/crm";
import { Button } from "@/demo/components/ui/button";
import { syncContactToHesabfaFn } from "@/demo/server/functions";
import { useAuth } from "@/demo/hooks/use-auth";
import { toast } from "sonner";
import { Calculator, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/demo/contacts")({
  head: () => ({
    meta: [
      { title: "مخاطبین | DaalCRM" },
      { name: "description", content: "مدیریت مخاطبین، سرنخ‌ها و اطلاعات تماس مشتریان." },
      { property: "og:title", content: "مخاطبین | DaalCRM" },
      { property: "og:description", content: "مدیریت مخاطبین و سرنخ‌های فروش." },
    ],
  }),
  component: Contacts,
});

type Contact = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  source: string | null;
  created_at: string;
};

function HesabfaSync({ contact }: { contact: Contact }) {
  const { isDemo } = useAuth();
  const [pending, setPending] = useState(false);

  async function sync() {
    setPending(true);
    try {
      const result = await syncContactToHesabfaFn({ data: { contactId: contact.id } });
      if (result.ok) toast.success(result.message, { description: result.detail });
      else toast.error(result.message, { description: result.detail });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "همگام‌سازی با حسابفا انجام نشد.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <div className="flex items-start gap-3">
        <Calculator className="mt-0.5 size-4 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">حسابفا</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            این مخاطب را در نرم‌افزار حسابداری حسابفا ثبت یا به‌روزرسانی کنید.
          </p>
        </div>
      </div>
      {isDemo ? (
        <p className="mt-3 text-xs text-muted-foreground">
          در دموی عمومی، همگام‌سازی واقعی انجام نمی‌شود.
        </p>
      ) : (
        <Button className="mt-3 w-full gap-2" variant="outline" onClick={sync} disabled={pending}>
          <RefreshCw className={`size-4 ${pending ? "animate-spin" : ""}`} />
          {pending ? "در حال همگام‌سازی…" : "همگام‌سازی با حسابفا"}
        </Button>
      )}
    </div>
  );
}

const SOURCES = [
  { value: "وب‌سایت", label: "وب‌سایت" },
  { value: "اینستاگرام", label: "اینستاگرام" },
  { value: "معرفی", label: "معرفی" },
  { value: "تماس ورودی", label: "تماس ورودی" },
  { value: "نمایشگاه", label: "نمایشگاه" },
  { value: "سایر", label: "سایر" },
];

function Contacts() {
  return (
    <CrudPage<Contact>
      table="contacts"
      title="مخاطبین"
      description="همه مشتریان و سرنخ‌های شما در یک جا"
      addLabel="مخاطب جدید"
      searchKeys={["full_name", "email", "phone", "job_title", "source"]}
      filters={[{ key: "source", label: "منابع", options: SOURCES }]}

      fields={[
        { name: "full_name", label: "نام و نام خانوادگی", required: true },
        { name: "email", label: "ایمیل", type: "email" },
        { name: "phone", label: "شماره تماس" },
        { name: "job_title", label: "سمت" },
        {
          name: "source",
          label: "منبع آشنایی",
          type: "select",
          options: SOURCES,
        },
        { name: "notes", label: "یادداشت", type: "textarea" },
      ]}
      columns={[
        { key: "full_name", label: "نام" },
        { key: "phone", label: "تماس" },
        { key: "email", label: "ایمیل" },
        { key: "job_title", label: "سمت" },
        { key: "source", label: "منبع" },
        { key: "created_at", label: "تاریخ ثبت", render: (r) => formatDate(r.created_at) },
      ]}

      detailExtra={(contact) => <HesabfaSync contact={contact} />}

      emptyText="هنوز مخاطبی ثبت نشده است."
    />
  );
}
