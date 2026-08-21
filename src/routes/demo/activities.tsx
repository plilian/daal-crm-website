import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CrudPage } from "@/demo/components/crud-page";
import {
  ACTIVITY_LABELS,
  ACTIVITY_STATUSES,
  ACTIVITY_STATUS_LABELS,
  formatDate,
  useTable,
  useUpsertRow,
  type ActivityStatus,
} from "@/demo/lib/crm";
import { Badge } from "@/demo/components/ui/badge";
import { useAuth } from "@/demo/hooks/use-auth";

export const Route = createFileRoute("/demo/activities")({
  head: () => ({
    meta: [
      { title: "پیگیری‌ها | DaalCRM" },
      { name: "description", content: "ثبت تماس، جلسه، پیامک، ایمیل و وظایف تیم فروش." },
      { property: "og:title", content: "پیگیری‌ها | DaalCRM" },
      { property: "og:description", content: "مدیریت وظایف و تعاملات با مشتری." },
    ],
  }),
  component: Activities,
});

type Activity = {
  id: string;
  subject: string;
  type: string;
  due_at: string | null;
  done: boolean;
  status: ActivityStatus | string;
  contact_id: string | null;
  deal_id: string | null;
  invoice_id: string | null;
  body: string | null;
  contacts?: { full_name: string } | null;
  deals?: { title: string } | null;
  invoices?: { invoice_no: number } | null;
};

function resolveStatus(row: Activity): string {
  if (row.status) return row.status;
  return row.done ? "done" : "in_progress";
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "done":
      return "bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/15";
    case "cancelled":
      return "bg-rose-600/10 text-rose-700 hover:bg-rose-600/10";
    case "deferred":
      return "bg-slate-500/10 text-slate-700 hover:bg-slate-500/10";
    default:
      return "border border-amber-500/40 bg-amber-500/10 text-amber-800 hover:bg-amber-500/10";
  }
}

function Activities() {
  const { data: contacts } = useTable<{ id: string; full_name: string }>("contacts", {
    select: "id, full_name",
  });
  const { data: deals } = useTable<{ id: string; title: string }>("deals", {
    select: "id, title",
  });
  const { data: invoices } = useTable<{ id: string; invoice_no: number }>("invoices", {
    select: "id, invoice_no",
  });
  const contactOptions = useMemo(
    () => (contacts ?? []).map((c) => ({ value: c.id, label: c.full_name })),
    [contacts],
  );
  const dealOptions = useMemo(
    () => [
      { value: "", label: "— بدون معامله / سفارش —" },
      ...(deals ?? []).map((deal) => ({ value: deal.id, label: deal.title })),
    ],
    [deals],
  );
  const invoiceOptions = useMemo(
    () => [
      { value: "", label: "— بدون فاکتور —" },
      ...(invoices ?? []).map((invoice) => ({
        value: invoice.id,
        label: `فاکتور #${invoice.invoice_no}`,
      })),
    ],
    [invoices],
  );
  const upsert = useUpsertRow("activities", "وضعیت به‌روزرسانی شد");
  const { isDemo } = useAuth();

  return (
    <CrudPage<Activity>
      table="activities"
      title="پیگیری‌ها و فعالیت‌ها"
      description="هر تماس، وظیفه و جلسه را به مخاطب، سفارش و در صورت نیاز فاکتور وصل کنید."
      addLabel="پیگیری جدید"
      select="id, subject, type, due_at, done, status, contact_id, deal_id, invoice_id, body, contacts(full_name), deals(title), invoices(invoice_no)"
      searchKeys={["subject", "body"]}
      filters={[
        {
          key: "status",
          label: "وضعیت",
          options: ACTIVITY_STATUSES.map((s) => ({ value: s.value, label: s.label })),
        },
      ]}
      fields={[
        { name: "subject", label: "موضوع", required: true },
        {
          name: "type",
          label: "نوع",
          type: "select",
          options: Object.entries(ACTIVITY_LABELS).map(([value, label]) => ({ value, label })),
        },
        {
          name: "contact_id",
          label: "مخاطب",
          type: "select",
          options: [{ value: "", label: "— بدون مخاطب —" }, ...contactOptions],
        },
        { name: "deal_id", label: "معامله / سفارش", type: "select", options: dealOptions },
        { name: "invoice_id", label: "فاکتور", type: "select", options: invoiceOptions },
        { name: "due_at", label: "موعد انجام", type: "datetime-local" },
        {
          name: "status",
          label: "وضعیت",
          type: "select",
          options: ACTIVITY_STATUSES.map((s) => ({ value: s.value, label: s.label })),
          required: true,
        },
        { name: "body", label: "توضیحات", type: "textarea" },
      ]}
      columns={[
        { key: "subject", label: "موضوع" },
        {
          key: "type",
          label: "نوع",
          render: (r) => <Badge variant="secondary">{ACTIVITY_LABELS[r.type] ?? r.type}</Badge>,
        },
        {
          key: "contact",
          label: "مخاطب",
          render: (r) => r.contacts?.full_name ?? "—",
        },
        { key: "deal", label: "سفارش", render: (r) => r.deals?.title ?? "—" },
        {
          key: "invoice",
          label: "فاکتور",
          render: (r) => (r.invoices?.invoice_no ? `#${r.invoices.invoice_no}` : "—"),
        },
        { key: "due_at", label: "موعد", render: (r) => formatDate(r.due_at) },
        {
          key: "status",
          label: "وضعیت",
          render: (r) => {
            const status = resolveStatus(r);
            return (
              <Badge className={statusBadgeClass(status)}>
                {ACTIVITY_STATUS_LABELS[status] ?? status}
              </Badge>
            );
          },
        },
        {
          key: "set_status",
          label: "تغییر وضعیت",
          render: (r) => {
            const status = resolveStatus(r);
            return (
              <select
                aria-label="تغییر وضعیت پیگیری"
                className="h-8 max-w-[10.5rem] rounded-lg border border-input bg-background px-2 text-xs text-foreground"
                value={status}
                disabled={isDemo || upsert.isPending}
                onChange={(e) => {
                  upsert.mutate({ id: r.id, status: e.target.value });
                }}
              >
                {ACTIVITY_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            );
          },
        },
      ]}
      emptyText="هنوز پیگیری‌ای ثبت نشده است."
    />
  );
}
