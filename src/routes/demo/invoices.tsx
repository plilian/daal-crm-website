import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createZarinpalPaymentFn,
  getRowFn,
  insertRowFn,
  listRowsFn,
  updateRowFn,
} from "@/demo/server/functions";
import { CrudPage } from "@/demo/components/crud-page";
import { AccessDenied } from "@/demo/components/app-shell";
import { Button } from "@/demo/components/ui/button";
import { Input } from "@/demo/components/ui/input";
import { Label } from "@/demo/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/demo/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/demo/hooks/use-auth";
import { formatDate, formatMoney, useTable } from "@/demo/lib/crm";
import { INVOICE_STATUS_LABELS, PAYMENT_METHODS, formatDateTime } from "@/demo/lib/clinic";
import { InvoiceStatusBadge } from "@/demo/components/status-badge";
import { CreditCard, Wallet } from "lucide-react";

export const Route = createFileRoute("/demo/invoices")({
  validateSearch: (search: Record<string, unknown>) => ({
    payment: typeof search["payment"] === "string" ? search["payment"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "پیش‌فاکتور و پرداخت | DaalCRM" },
      {
        name: "description",
        content: "صدور پیش‌فاکتور، ثبت پرداخت و پیگیری مانده حساب مشتریان.",
      },
      { property: "og:title", content: "فاکتور و پرداخت" },
      { property: "og:description", content: "صدور پیش‌فاکتور و ثبت پرداخت‌های فروش." },
    ],
  }),
  component: InvoicesPage,
});

type Invoice = {
  id: string;
  invoice_no: number;
  contact_id: string | null;
  subtotal: number;
  discount: number;
  total: number;
  paid_amount: number;
  status: string;
  issued_at: string;
  deal_id: string | null;
  seller_id: string | null;
  contacts?: { full_name: string } | null;
  deals?: { title: string } | null;
  users?: { full_name: string } | null;
};

type Payment = {
  id: string;
  invoice_id: string | null;
  amount: number;
  method: string;
  paid_at: string;
  reference: string | null;
  invoices?: { invoice_no: number } | null;
  contacts?: { full_name: string } | null;
};

type PaymentTransaction = {
  id: string;
  invoice_id: string;
  authority: string;
  amount: number;
  status: string;
  ref_id: string | null;
  created_at: string;
};

function InvoiceFlow({
  invoice,
  transactions,
}: {
  invoice: Invoice;
  transactions: PaymentTransaction[];
}) {
  const related = transactions.filter((transaction) => transaction.invoice_id === invoice.id);
  const outstanding = Math.max(Number(invoice.total ?? 0) - Number(invoice.paid_amount ?? 0), 0);
  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-3">
      <div>
        <p className="text-sm font-semibold text-foreground">مسیر فروش و دریافت</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          این فاکتور از کدام سفارش آمده و دریافت آن در چه وضعیتی است.
        </p>
      </div>
      <div className="grid gap-2 text-xs sm:grid-cols-2">
        <FlowValue label="سفارش / معامله" value={invoice.deals?.title ?? "ثبت نشده"} />
        <FlowValue label="فروشنده" value={invoice.users?.full_name ?? "ثبت نشده"} />
        <FlowValue label="مانده قابل دریافت" value={formatMoney(outstanding)} />
        <FlowValue
          label="تراکنش آنلاین"
          value={related.length ? `${related.length} درخواست` : "ندارد"}
        />
      </div>
      {related.length ? (
        <div className="space-y-2 border-t border-border/70 pt-3">
          {related.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">
                {transaction.status === "succeeded"
                  ? "موفق"
                  : transaction.status === "pending"
                    ? "در انتظار پرداخت"
                    : transaction.status === "canceled"
                      ? "لغوشده"
                      : "ناموفق"}
              </span>
              <span className="font-medium text-foreground">{formatMoney(transaction.amount)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FlowValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-medium text-foreground">{value}</p>
    </div>
  );
}

function PaymentDialog({ invoices }: { invoices: { id: string; label: string }[] }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (values: { invoice_id: string; amount: number; method: string }) => {
      const inv = await getRowFn({
        data: { table: "invoices", id: values.invoice_id, select: "paid_amount, total" },
      });
      if (!inv) throw new Error("فاکتور پیدا نشد");
      const row = inv as unknown as { paid_amount: number; total: number };

      await insertRowFn({ data: { table: "payments", values } });

      const paid = Number(row.paid_amount ?? 0) + values.amount;
      const status = paid >= Number(row.total ?? 0) ? "paid" : paid > 0 ? "partial" : "unpaid";
      await updateRowFn({
        data: { table: "invoices", id: values.invoice_id, values: { paid_amount: paid, status } },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table", "invoices"] });
      queryClient.invalidateQueries({ queryKey: ["table", "payments"] });
      toast.success("پرداخت ثبت شد");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(`خطا: ${e.message}`),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="size-4" />
          ثبت پرداخت
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ثبت پرداخت</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            mutation.mutate({
              invoice_id: String(fd.get("invoice_id") ?? ""),
              amount: Number(fd.get("amount") ?? 0),
              method: String(fd.get("method") ?? "cash"),
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="invoice_id">فاکتور</Label>
            <select
              id="invoice_id"
              name="invoice_id"
              required
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              {invoices.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">مبلغ (تومان)</Label>
            <Input id="amount" name="amount" type="number" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="method">روش پرداخت</Label>
            <select
              id="method"
              name="method"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            ثبت پرداخت
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ZarinpalPaymentDialog({ invoices }: { invoices: { id: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function startPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      const result = await createZarinpalPaymentFn({
        data: { invoiceId: String(fd.get("zarinpal_invoice_id") ?? "") },
      });
      window.location.assign(result.paymentUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "لینک پرداخت ساخته نشد.");
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="outline">
          <CreditCard className="size-4" />
          پرداخت آنلاین
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>پرداخت آنلاین با زرین‌پال</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={startPayment}>
          <div className="space-y-2">
            <Label htmlFor="zarinpal_invoice_id">فاکتور</Label>
            <select
              id="zarinpal_invoice_id"
              name="zarinpal_invoice_id"
              required
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              {invoices.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs leading-6 text-muted-foreground">
            مبلغ ماندهٔ فاکتور از CRM خوانده می‌شود و بعد از بازگشت از درگاه، فقط پس از تأیید
            زرین‌پال به‌عنوان پرداخت ثبت خواهد شد.
          </p>
          <Button type="submit" className="w-full gap-2" disabled={pending}>
            <CreditCard className="size-4" />
            {pending ? "در حال ساخت لینک پرداخت…" : "رفتن به درگاه پرداخت"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function InvoicesPage() {
  const { has, loading, isDemo } = useAuth();
  const { payment } = Route.useSearch();
  const { data: contacts } = useTable<{ id: string; full_name: string }>("contacts", {
    select: "id, full_name",
  });
  const { data: deals } = useTable<{ id: string; title: string }>("deals", {
    select: "id, title",
  });
  const usersQuery = useQuery({
    queryKey: ["table", "users", "invoice-sellers"],
    queryFn: async () =>
      (await listRowsFn({ data: { table: "users", select: "id, full_name" } })) as {
        id: string;
        full_name: string;
      }[],
    enabled: has("admin", "manager"),
  });
  const { data: invoiceList } = useTable<Invoice>("invoices", {
    select:
      "id, invoice_no, total, paid_amount, deal_id, seller_id, contacts(full_name), deals(title), users(full_name)",
  });
  const { data: paymentTransactions } = useTable<PaymentTransaction>("payment_transactions", {
    select: "id, invoice_id, authority, amount, status, ref_id, created_at",
  });

  const contactOptions = useMemo(
    () => (contacts ?? []).map((c) => ({ value: c.id, label: c.full_name })),
    [contacts],
  );
  const invoiceOptions = useMemo(
    () =>
      (invoiceList ?? [])
        .filter((i) => Number(i.total ?? 0) > Number(i.paid_amount ?? 0))
        .map((i) => ({
          id: i.id,
          label: `فاکتور #${i.invoice_no} — ${i.contacts?.full_name ?? "بدون مشتری"}`,
        })),
    [invoiceList],
  );
  const dealOptions = useMemo(
    () => [
      { value: "", label: "— بدون معامله / سفارش —" },
      ...(deals ?? []).map((deal) => ({ value: deal.id, label: deal.title })),
    ],
    [deals],
  );
  const sellerOptions = useMemo(
    () => [
      { value: "", label: "— تخصیص خودکار به کاربر فعلی —" },
      ...(usersQuery.data ?? []).map((item) => ({ value: item.id, label: item.full_name })),
    ],
    [usersQuery.data],
  );

  useEffect(() => {
    if (payment === "success") toast.success("پرداخت با موفقیت تأیید و ثبت شد.");
    if (payment === "failed") toast.error("پرداخت تکمیل یا تأیید نشد.");
  }, [payment]);

  if (loading) return <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>;
  if (!has("admin", "manager", "reception")) return <AccessDenied />;

  return (
    <div className="space-y-12">
      <CrudPage<Invoice>
        table="invoices"
        title="فاکتورها"
        description="فاکتور را به سفارش، فروشنده و سابقهٔ دریافت وصل کنید"
        addLabel="فاکتور جدید"
        emptyText="هنوز فاکتوری صادر نشده است."
        select="id, invoice_no, contact_id, deal_id, seller_id, subtotal, discount, total, paid_amount, status, issued_at, contacts(full_name), deals(title), users(full_name)"
        searchKeys={["invoice_no"]}
        toolbarExtra={
          isDemo ? null : (
            <div className="flex flex-wrap items-center gap-2">
              <PaymentDialog invoices={invoiceOptions} />
              <ZarinpalPaymentDialog invoices={invoiceOptions} />
            </div>
          )
        }
        filters={[
          {
            key: "status",
            label: "وضعیت",
            options: Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          },
        ]}
        fields={[
          {
            name: "contact_id",
            label: "مشتری",
            type: "select",
            options: contactOptions,
            required: true,
          },
          { name: "deal_id", label: "معامله / سفارش", type: "select", options: dealOptions },
          {
            name: "seller_id",
            label: "فروشنده / مسئول فروش",
            type: "select",
            options: sellerOptions,
          },
          { name: "subtotal", label: "جمع خدمات (تومان)", type: "number", required: true },
          { name: "discount", label: "تخفیف (تومان)", type: "number" },
          { name: "total", label: "مبلغ نهایی (تومان)", type: "number", required: true },
          { name: "notes", label: "توضیحات", type: "textarea" },
        ]}
        columns={[
          { key: "invoice_no", label: "شماره" },
          { key: "contact", label: "مشتری", render: (r) => r.contacts?.full_name ?? "—" },
          { key: "deal", label: "سفارش", render: (r) => r.deals?.title ?? "—" },
          { key: "seller", label: "فروشنده", render: (r) => r.users?.full_name ?? "ثبت نشده" },
          { key: "total", label: "مبلغ", render: (r) => formatMoney(r.total) },
          { key: "paid_amount", label: "پرداختی", render: (r) => formatMoney(r.paid_amount) },
          {
            key: "status",
            label: "وضعیت",
            render: (r) => <InvoiceStatusBadge status={r.status} />,
          },
          { key: "issued_at", label: "تاریخ صدور", render: (r) => formatDate(r.issued_at) },
        ]}
        detailExtra={(invoice) => (
          <InvoiceFlow invoice={invoice} transactions={paymentTransactions ?? []} />
        )}
      />

      <CrudPage<Payment>
        table="payments"
        title="پرداخت‌ها"
        description="تاریخچه پرداخت‌های دریافتی"
        addLabel="پرداخت دستی"
        emptyText="هنوز پرداختی ثبت نشده است."
        select="id, invoice_id, contact_id, amount, method, paid_at, reference, invoices(invoice_no), contacts(full_name)"
        searchKeys={["reference", "method"]}
        filters={[{ key: "method", label: "روش", options: PAYMENT_METHODS }]}
        fields={[
          {
            name: "invoice_id",
            label: "فاکتور",
            type: "select",
            options: [
              { value: "", label: "— انتخاب فاکتور —" },
              ...invoiceOptions.map((i) => ({ value: i.id, label: i.label })),
            ],
            required: true,
          },
          { name: "amount", label: "مبلغ (تومان)", type: "number", required: true },
          { name: "method", label: "روش پرداخت", type: "select", options: PAYMENT_METHODS },
          { name: "reference", label: "کد پیگیری" },
        ]}
        columns={[
          {
            key: "invoice",
            label: "فاکتور",
            render: (r) => (r.invoices?.invoice_no ? `#${r.invoices.invoice_no}` : "بدون فاکتور"),
          },
          { key: "contact", label: "مشتری", render: (r) => r.contacts?.full_name ?? "—" },
          { key: "amount", label: "مبلغ", render: (r) => formatMoney(r.amount) },
          {
            key: "method",
            label: "روش",
            render: (r) => PAYMENT_METHODS.find((m) => m.value === r.method)?.label ?? r.method,
          },
          { key: "paid_at", label: "زمان", render: (r) => formatDateTime(r.paid_at) },
          { key: "reference", label: "کد پیگیری" },
        ]}
      />
    </div>
  );
}
