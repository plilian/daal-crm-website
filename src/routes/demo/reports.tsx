import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { runReportFn } from "@/demo/server/functions";
import { AccessDenied, PageHeader } from "@/demo/components/app-shell";
import { useAuth } from "@/demo/hooks/use-auth";
import { ACTIVITY_STATUS_LABELS, STAGE_LABELS } from "@/demo/lib/crm";
import { INVOICE_STATUS_LABELS, PAYMENT_METHODS } from "@/demo/lib/clinic";
import { Card, CardContent, CardHeader, CardTitle } from "@/demo/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/demo/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/demo/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Calculator, CreditCard, Wallet, Receipt, Users, Trophy } from "lucide-react";

export const Route = createFileRoute("/demo/reports")({
  head: () => ({
    meta: [
      { title: "گزارش‌گیری | DaalCRM" },
      {
        name: "description",
        content: "گزارش درآمد، سرنخ‌ها، قیف فروش و خدمات پرفروش.",
      },
      { property: "og:title", content: "گزارش‌گیری" },
      { property: "og:description", content: "گزارش مالی، مشتریان و فروش." },
    ],
  }),
  component: ReportsPage,
});

const PERIODS = [
  { value: "30d", label: "۳۰ روز اخیر" },
  { value: "90d", label: "سه ماه اخیر" },
  { value: "year", label: "سال جاری" },
  { value: "all", label: "همه زمان‌ها" },
];

function periodRange(value: string): {
  from?: string;
  to?: string;
  grain: "day" | "week" | "month";
} {
  const now = new Date();
  if (value === "30d")
    return { from: new Date(now.getTime() - 30 * 864e5).toISOString(), grain: "day" };
  if (value === "90d")
    return { from: new Date(now.getTime() - 90 * 864e5).toISOString(), grain: "week" };
  if (value === "year")
    return { from: new Date(now.getFullYear(), 0, 1).toISOString(), grain: "month" };
  return { grain: "month" };
}

const faNum = (n: number | string | null | undefined) =>
  new Intl.NumberFormat("fa-IR").format(Number(n ?? 0));

function periodLabel(key: string, grain: "day" | "week" | "month" = "month") {
  if (!key) return "—";
  const fa = "fa-IR-u-ca-persian";
  try {
    if (grain === "month" || key.length === 7) {
      const [y = 0, m = 1] = key.split("-").map(Number);
      return new Intl.DateTimeFormat(fa, {
        year: "numeric",
        month: "long",
      }).format(new Date(y, m - 1, 1));
    }
    const [y = 0, m = 1, d = 1] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (grain === "week") {
      return `هفته ${new Intl.DateTimeFormat(fa, { day: "numeric", month: "short" }).format(date)}`;
    }
    return new Intl.DateTimeFormat(fa, { day: "numeric", month: "short" }).format(date);
  } catch {
    return key;
  }
}

type RevenueRow = { month: string; total: number; count: number };
type InvoiceStatusRow = { status: string; count: number; total: number; paid: number };
type InvoiceDebtRow = { total: number; debt: number; pending_count: number };
type PaymentMethodRow = { method: string; count: number; total: number };
type PaymentGatewayRow = { provider: string; status: string; count: number; total: number };
type AccountingSyncRow = { total: number; synced: number };
type ActivityStatusRow = { status: string; count: number };
type ActivityOwnerRow = { owner: string; count: number; completed: number };
type NewContactsRow = { month: string; count: number };
type PipelineRow = { stage: string; count: number; total: number };
type DealsWonRow = { month: string; total: number; count: number };
type SellerRow = { seller: string; count: number; total: number };
type TopServicesRow = { service: string; revenue: number; quantity: number };

function useReport<T>(report: string, from?: string, to?: string) {
  return useQuery({
    queryKey: ["report", report, from, to],
    queryFn: async () => {
      const res = await runReportFn({ data: { report, from: from ?? null, to: to ?? null } });
      return (res.rows ?? []) as T[];
    },
  });
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 text-xl font-bold text-foreground">{value}</p>
        </div>
        <Icon className="size-6 text-primary" />
      </CardContent>
    </Card>
  );
}

function SimpleTable<T>({
  columns,
  rows,
  rowKey,
}: {
  columns: { key: string; label: string; render?: (row: T) => string }[];
  rows: T[];
  rowKey: string;
}) {
  return (
    <div className="surface-panel overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key}>{c.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-8 text-center text-muted-foreground"
              >
                داده‌ای برای این بازه وجود ندارد.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r, i) => (
              <TableRow key={`${rowKey}-${i}`}>
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    {c.render ? c.render(r) : String(r[c.key as keyof T] ?? "—")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

type TipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ dataKey?: string | number; value?: number | string }>;
  label?: string | number;
  valueLabel?: string;
};

function ChartTip({
  active,
  payload,
  label,
  valueLabel,
  grain = "month",
}: TipProps & { grain?: "day" | "week" | "month" }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">{periodLabel(String(label ?? ""), grain)}</p>
      {payload.map((p, i) => (
        <p key={i} className="mt-1 font-semibold text-foreground">
          {valueLabel ?? String(p.dataKey ?? "")}: {faNum(p.value)}
        </p>
      ))}
    </div>
  );
}

function ReportsInner() {
  const [period, setPeriod] = useState("year");
  const { from, to, grain } = useMemo(() => periodRange(period), [period]);

  const revenueReport =
    grain === "day" ? "revenue_by_day" : grain === "week" ? "revenue_by_week" : "revenue_by_month";
  const contactsReport =
    grain === "day"
      ? "new_contacts_by_day"
      : grain === "week"
        ? "new_contacts_by_week"
        : "new_contacts_by_month";

  const revenue = useReport<RevenueRow>(revenueReport, from, to);
  const invoiceStatus = useReport<InvoiceStatusRow>("invoice_status_summary", from, to);
  const invoiceDebt = useReport<InvoiceDebtRow>("invoice_debt_summary", from, to);
  const paymentMethods = useReport<PaymentMethodRow>("payment_method_summary", from, to);
  const paymentGateway = useReport<PaymentGatewayRow>("payment_gateway_summary", from, to);
  const accountingSync = useReport<AccountingSyncRow>("accounting_sync_summary", from, to);
  const activityStatus = useReport<ActivityStatusRow>("activities_by_status", from, to);
  const activityOwner = useReport<ActivityOwnerRow>("activities_by_owner", from, to);
  const newContacts = useReport<NewContactsRow>(contactsReport, from, to);
  const pipeline = useReport<PipelineRow>("pipeline_summary", from, to);
  const dealsWon = useReport<DealsWonRow>("deals_won_by_month", from, to);
  const dealsWonBySeller = useReport<SellerRow>("deals_won_by_seller", from, to);
  const collectionsBySeller = useReport<SellerRow>("collections_by_seller", from, to);
  const topServices = useReport<TopServicesRow>("top_services", from, to);

  const revenueRows = revenue.data ?? [];
  const totalRevenue = revenueRows.reduce((s, r) => s + Number(r.total ?? 0), 0);
  const debtRow = invoiceDebt.data?.[0];
  const wonTotal = (dealsWon.data ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0);
  const revenueTitle =
    grain === "day" ? "درآمد روزانه" : grain === "week" ? "درآمد هفتگی" : "درآمد ماهانه";

  return (
    <div>
      <PageHeader
        title="گزارش‌گیری"
        description="نمای تحلیلی از درآمد، مشتریان، قیف فروش و خدمات"
        action={
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            aria-label="بازه زمانی"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        }
      />

      <Tabs defaultValue="finance">
        <TabsList>
          <TabsTrigger value="finance">مالی</TabsTrigger>
          <TabsTrigger value="activity">سرنخ و فعالیت</TabsTrigger>
          <TabsTrigger value="sales">فروش و خدمات</TabsTrigger>
        </TabsList>

        <TabsContent value="finance" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <StatCard label="درآمد دریافتی دوره" value={faNum(totalRevenue)} icon={Wallet} />
            <StatCard
              label="فاکتورهای صادرشده"
              value={faNum(
                (invoiceStatus.data ?? []).reduce((s, r) => s + Number(r.count ?? 0), 0),
              )}
              icon={Receipt}
            />
            <StatCard label="مانده مطالبات" value={faNum(debtRow?.debt)} icon={Receipt} />
            <StatCard
              label="فاکتورهای پرداخت‌نشده/جزئی"
              value={faNum(debtRow?.pending_count)}
              icon={Wallet}
            />
            <StatCard
              label="مخاطب همگام‌شده با حسابفا"
              value={`${faNum(accountingSync.data?.[0]?.synced)} از ${faNum(accountingSync.data?.[0]?.total)}`}
              icon={Calculator}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{revenueTitle} (از پرداخت‌ها)</CardTitle>
            </CardHeader>
            <CardContent>
              <div dir="ltr" className="w-full">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueRows} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--color-border)"
                    />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(v) => periodLabel(String(v), grain)}
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={grain === "day" ? 28 : 12}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={(v) => faNum(v)}
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                      width={70}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<ChartTip valueLabel="درآمد" grain={grain} />}
                      cursor={{
                        fill: "color-mix(in oklab, var(--color-primary) 12%, transparent)",
                      }}
                    />
                    <Bar dataKey="total" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">وضعیت فاکتورها</h3>
              <SimpleTable
                rowKey="inv-status"
                columns={[
                  {
                    key: "status",
                    label: "وضعیت",
                    render: (r) => INVOICE_STATUS_LABELS[String(r.status)] ?? String(r.status),
                  },
                  { key: "count", label: "تعداد", render: (r) => faNum(r.count) },
                  { key: "total", label: "جمع مبلغ", render: (r) => faNum(r.total) },
                  { key: "paid", label: "پرداختی", render: (r) => faNum(r.paid) },
                ]}
                rows={invoiceStatus.data ?? []}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">روش‌های پرداخت</h3>
              <SimpleTable
                rowKey="pay-method"
                columns={[
                  {
                    key: "method",
                    label: "روش",
                    render: (r) =>
                      PAYMENT_METHODS.find((m) => m.value === r.method)?.label ?? String(r.method),
                  },
                  { key: "count", label: "تعداد", render: (r) => faNum(r.count) },
                  { key: "total", label: "جمع دریافتی", render: (r) => faNum(r.total) },
                ]}
                rows={paymentMethods.data ?? []}
              />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <CreditCard className="size-4 text-primary" /> وضعیت درگاه پرداخت
              </h3>
              <SimpleTable
                rowKey="gateway-status"
                columns={[
                  {
                    key: "provider",
                    label: "درگاه",
                    render: (r) => (r.provider === "zarinpal" ? "زرین‌پال" : String(r.provider)),
                  },
                  {
                    key: "status",
                    label: "وضعیت",
                    render: (r) =>
                      (
                        ({
                          succeeded: "موفق",
                          pending: "در انتظار",
                          failed: "ناموفق",
                          canceled: "لغوشده",
                        }) as Record<string, string>
                      )[String(r.status)] ?? String(r.status),
                  },
                  { key: "count", label: "تعداد", render: (r) => faNum(r.count) },
                  { key: "total", label: "مبلغ", render: (r) => faNum(r.total) },
                ]}
                rows={paymentGateway.data ?? []}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                دریافت به تفکیک فروشنده
              </h3>
              <SimpleTable
                rowKey="seller-collections"
                columns={[
                  { key: "seller", label: "فروشنده" },
                  { key: "count", label: "تعداد دریافت", render: (r) => faNum(r.count) },
                  { key: "total", label: "جمع دریافتی", render: (r) => faNum(r.total) },
                ]}
                rows={collectionsBySeller.data ?? []}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">وضعیت فعالیت‌ها</h3>
              <SimpleTable
                rowKey="activity-status"
                columns={[
                  {
                    key: "status",
                    label: "وضعیت",
                    render: (r) => ACTIVITY_STATUS_LABELS[String(r.status)] ?? String(r.status),
                  },
                  { key: "count", label: "تعداد", render: (r) => faNum(r.count) },
                ]}
                rows={activityStatus.data ?? []}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                فعالیت‌ها به تفکیک کارشناس
              </h3>
              <SimpleTable
                rowKey="activity-owner"
                columns={[
                  { key: "owner", label: "کارشناس" },
                  { key: "count", label: "تعداد فعالیت", render: (r) => faNum(r.count) },
                  { key: "completed", label: "انجام‌شده", render: (r) => faNum(r.completed) },
                ]}
                rows={activityOwner.data ?? []}
              />
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">مخاطبین جدید</h3>
            <SimpleTable
              rowKey="new-contacts"
              columns={[
                {
                  key: "month",
                  label: grain === "day" ? "روز" : grain === "week" ? "هفته" : "ماه",
                  render: (r) => periodLabel(String(r.month), grain),
                },
                { key: "count", label: "تعداد", render: (r) => faNum(r.count) },
              ]}
              rows={newContacts.data ?? []}
            />
          </div>
        </TabsContent>

        <TabsContent value="sales" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="درآمد معاملات برنده" value={faNum(wonTotal)} icon={Trophy} />
            <StatCard
              label="مخاطبین"
              value={faNum((newContacts.data ?? []).reduce((s, r) => s + Number(r.count ?? 0), 0))}
              icon={Users}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">درآمد معاملات برنده در ماه</CardTitle>
            </CardHeader>
            <CardContent>
              <div dir="ltr" className="w-full">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={dealsWon.data ?? []}
                    margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--color-border)"
                    />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(v) => periodLabel(String(v), "month")}
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => faNum(v)}
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                      width={70}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<ChartTip valueLabel="درآمد" grain="month" />}
                      cursor={{
                        fill: "color-mix(in oklab, var(--color-chart-3) 12%, transparent)",
                      }}
                    />
                    <Bar dataKey="total" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">قیف فروش</h3>
              <SimpleTable
                rowKey="pipeline"
                columns={[
                  {
                    key: "stage",
                    label: "مرحله",
                    render: (r) =>
                      STAGE_LABELS[String(r.stage) as keyof typeof STAGE_LABELS] ?? String(r.stage),
                  },
                  { key: "count", label: "تعداد", render: (r) => faNum(r.count) },
                  { key: "total", label: "جمع مبلغ", render: (r) => faNum(r.total) },
                ]}
                rows={pipeline.data ?? []}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">خدمات پرطرفدار</h3>
              <SimpleTable
                rowKey="top-services"
                columns={[
                  { key: "service", label: "خدمت" },
                  { key: "quantity", label: "تعداد", render: (r) => faNum(r.quantity) },
                  { key: "revenue", label: "درآمد", render: (r) => faNum(r.revenue) },
                ]}
                rows={topServices.data ?? []}
              />
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              معاملات برنده به تفکیک فروشنده
            </h3>
            <SimpleTable
              rowKey="seller-won"
              columns={[
                { key: "seller", label: "فروشنده" },
                { key: "count", label: "معامله برنده", render: (r) => faNum(r.count) },
                { key: "total", label: "ارزش فروش", render: (r) => faNum(r.total) },
              ]}
              rows={dealsWonBySeller.data ?? []}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReportsPage() {
  const { has, loading } = useAuth();
  if (loading) return <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>;
  if (!has("admin", "manager", "reception", "marketing")) return <AccessDenied />;
  return <ReportsInner />;
}
