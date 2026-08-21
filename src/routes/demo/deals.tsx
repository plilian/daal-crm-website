import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CrudPage } from "@/demo/components/crud-page";
import { DealBoard } from "@/demo/components/deal-board";
import { PageHeader } from "@/demo/components/app-shell";
import { Button } from "@/demo/components/ui/button";
import { formatDate, formatMoney, STAGE_LABELS, STAGE_ORDER, type Stage } from "@/demo/lib/crm";
import { CURRENCIES } from "@/demo/lib/clinic";
import { Badge } from "@/demo/components/ui/badge";
import { listRowsFn } from "@/demo/server/functions";
import { useAuth } from "@/demo/hooks/use-auth";
import { Kanban, TableProperties } from "lucide-react";

export const Route = createFileRoute("/demo/deals")({
  head: () => ({
    meta: [
      { title: "معاملات | DaalCRM" },
      {
        name: "description",
        content: "پیگیری معاملات و قیف فروش با نمای کانبان، مراحل، مبلغ و تاریخ بستن.",
      },
      { property: "og:title", content: "معاملات | DaalCRM" },
      { property: "og:description", content: "پیگیری قیف فروش و معاملات." },
    ],
  }),
  component: Deals,
});

type Deal = {
  id: string;
  title: string;
  amount: number;
  currency?: string | null;
  stage: Stage;
  probability: number;
  expected_close_date: string | null;
  contact_id: string | null;
  company_id: string | null;
  seller_id: string | null;
  contacts?: { full_name: string } | null;
  companies?: { name: string } | null;
  users?: { full_name: string } | null;
};

const STAGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  won: "default",
  lost: "destructive",
};

function Deals() {
  const [view, setView] = useState<"board" | "table">("board");
  const { has } = useAuth();
  const { data: contacts } = useQuery({
    queryKey: ["table", "contacts", "deal-options"],
    queryFn: async () =>
      (await listRowsFn({ data: { table: "contacts", select: "id, full_name" } })) as {
        id: string;
        full_name: string;
      }[],
  });
  const { data: companies } = useQuery({
    queryKey: ["table", "companies", "deal-options"],
    queryFn: async () =>
      (await listRowsFn({ data: { table: "companies", select: "id, name" } })) as {
        id: string;
        name: string;
      }[],
  });
  const usersQuery = useQuery({
    queryKey: ["table", "users", "deal-sellers"],
    queryFn: async () =>
      (await listRowsFn({ data: { table: "users", select: "id, full_name" } })) as {
        id: string;
        full_name: string;
      }[],
    enabled: has("admin", "manager"),
  });
  const contactOptions = useMemo(
    () => [
      { value: "", label: "— بدون مخاطب —" },
      ...(contacts ?? []).map((item) => ({ value: item.id, label: item.full_name })),
    ],
    [contacts],
  );
  const companyOptions = useMemo(
    () => [
      { value: "", label: "— بدون شرکت —" },
      ...(companies ?? []).map((item) => ({ value: item.id, label: item.name })),
    ],
    [companies],
  );
  const sellerOptions = useMemo(
    () => [
      { value: "", label: "— تخصیص خودکار به کاربر فعلی —" },
      ...(usersQuery.data ?? []).map((item) => ({ value: item.id, label: item.full_name })),
    ],
    [usersQuery.data],
  );

  const toggle = (
    <div className="flex rounded-lg border border-border p-1">
      <Button
        variant={view === "board" ? "secondary" : "ghost"}
        size="sm"
        className="gap-2"
        onClick={() => setView("board")}
      >
        <Kanban className="size-4" />
        کانبان
      </Button>
      <Button
        variant={view === "table" ? "secondary" : "ghost"}
        size="sm"
        className="gap-2"
        onClick={() => setView("table")}
      >
        <TableProperties className="size-4" />
        جدول
      </Button>
    </div>
  );

  if (view === "board") {
    return (
      <div>
        <PageHeader
          title="معاملات"
          description="معامله‌ها را با کشیدن و رها کردن بین مراحل جابه‌جا کنید"
          action={toggle}
        />
        <DealBoard />
      </div>
    );
  }

  return (
    <CrudPage<Deal>
      table="deals"
      title="معاملات"
      description="سفارش‌های فروش را از سرنخ تا قرارداد، فاکتور و دریافت وجه دنبال کنید"
      addLabel="معامله جدید"
      toolbarExtra={toggle}
      select="id, title, amount, currency, stage, probability, expected_close_date, contact_id, company_id, seller_id, contacts(full_name), companies(name), users(full_name)"
      searchKeys={["title", "seller_id"]}
      filters={[
        {
          key: "stage",
          label: "مراحل",
          options: STAGE_ORDER.map((s) => ({ value: s, label: STAGE_LABELS[s] })),
        },
      ]}
      fields={[
        { name: "title", label: "عنوان معامله", required: true },
        { name: "amount", label: "مبلغ", type: "number" },
        {
          name: "currency",
          label: "ارز",
          type: "select",
          options: CURRENCIES,
        },
        { name: "contact_id", label: "مخاطب", type: "select", options: contactOptions },
        { name: "company_id", label: "شرکت", type: "select", options: companyOptions },
        {
          name: "seller_id",
          label: "فروشنده / مسئول فروش",
          type: "select",
          options: sellerOptions,
        },
        {
          name: "stage",
          label: "مرحله",
          type: "select",
          options: STAGE_ORDER.map((s) => ({ value: s, label: STAGE_LABELS[s] })),
        },
        { name: "probability", label: "احتمال موفقیت (٪)", type: "number" },
        { name: "expected_close_date", label: "تاریخ پیش‌بینی بستن", type: "date" },
        { name: "notes", label: "یادداشت", type: "textarea" },
      ]}
      columns={[
        { key: "title", label: "عنوان" },
        { key: "amount", label: "مبلغ", render: (r) => formatMoney(r.amount, r.currency) },
        {
          key: "stage",
          label: "مرحله",
          render: (r) => (
            <Badge variant={STAGE_VARIANT[r.stage] ?? "secondary"}>
              {STAGE_LABELS[r.stage] ?? r.stage}
            </Badge>
          ),
        },
        { key: "seller", label: "فروشنده", render: (r) => r.users?.full_name ?? "ثبت نشده" },
        { key: "probability", label: "احتمال (٪)" },
        {
          key: "expected_close_date",
          label: "تاریخ بستن",
          render: (r) => formatDate(r.expected_close_date),
        },
      ]}
      emptyText="هنوز معامله‌ای ثبت نشده است."
    />
  );
}
