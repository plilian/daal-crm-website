import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "@/demo/components/app-shell";
import { EmptyState } from "@/demo/components/empty-state";
import { Badge } from "@/demo/components/ui/badge";
import { Button } from "@/demo/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/demo/components/ui/card";
import {
  formatDate,
  formatMoney,
  formatNumber,
  formatTomanCompact,
  STAGE_LABELS,
  STAGE_ORDER,
  useTable,
  type Stage,
} from "@/demo/lib/crm";
import { formatDateTime } from "@/demo/lib/clinic";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  Calculator,
  ListTodo,
  Plug,
  Plus,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/demo/dashboard")({
  head: () => ({
    meta: [
      { title: "داشبورد | DaalCRM" },
      { name: "description", content: "نمای عملیاتی فروش، سرنخ‌ها، پیگیری‌ها و درآمد." },
      { property: "og:title", content: "داشبورد | DaalCRM" },
    ],
  }),
  component: Dashboard,
});

type Deal = {
  id: string;
  title: string;
  amount: number;
  probability: number;
  stage: Stage;
  updated_at: string;
  seller_id: string | null;
  users?: { full_name: string } | null;
};
type Lead = {
  id: string;
  full_name: string;
  source: string | null;
  hesabfa_code: string | null;
  created_at: string;
};
type Activity = {
  id: string;
  subject: string;
  status: string;
  due_at: string | null;
  contacts?: { full_name: string } | null;
  deals?: { title: string } | null;
};
type Invoice = {
  id: string;
  total: number;
  paid_amount: number;
  status: string;
  issued_at: string;
  seller_id: string | null;
  users?: { full_name: string } | null;
};
type Automation = { id: string; name: string; is_active: boolean };
type PaymentTransaction = { id: string; amount: number; status: string; created_at: string };

function isRecent(value: string | null | undefined, days = 30) {
  if (!value) return false;
  return Date.now() - new Date(value).getTime() <= days * 864e5;
}

function isToday(value: string | null | undefined) {
  if (!value) return false;
  const d = new Date(value);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function Dashboard() {
  const { data: deals, isLoading: dealsLoading } = useTable<Deal>("deals", {
    select: "id, title, amount, probability, stage, updated_at, seller_id, users(full_name)",
  });
  const { data: leads } = useTable<Lead>("contacts", {
    select: "id, full_name, source, hesabfa_code, created_at",
  });
  const { data: activities } = useTable<Activity>("activities", {
    select: "id, subject, status, due_at, contacts(full_name), deals(title)",
  });
  const { data: invoices } = useTable<Invoice>("invoices", {
    select: "id, total, paid_amount, status, issued_at, seller_id, users(full_name)",
  });
  const { data: paymentTransactions } = useTable<PaymentTransaction>("payment_transactions", {
    select: "id, amount, status, created_at",
  });
  const { data: automations } = useTable<Automation>("automations", {
    select: "id, name, is_active",
  });

  const stats = useMemo(() => {
    const openDeals = (deals ?? []).filter((deal) => !["won", "lost"].includes(deal.stage));
    const recentInvoices = (invoices ?? []).filter((invoice) => isRecent(invoice.issued_at));
    const recentLeads = (leads ?? []).filter((lead) => isRecent(lead.created_at));
    const recentTransactions = (paymentTransactions ?? []).filter((transaction) =>
      isRecent(transaction.created_at),
    );
    const dueToday = (activities ?? []).filter(
      (activity) =>
        activity.status !== "done" &&
        (isToday(activity.due_at) || (activity.due_at && new Date(activity.due_at) < new Date())),
    );
    const stuck = openDeals.filter(
      (deal) => Date.now() - new Date(deal.updated_at).getTime() > 3 * 864e5,
    );
    return {
      pipeline: openDeals.reduce((sum, deal) => sum + Number(deal.amount ?? 0), 0),
      weightedPipeline: openDeals.reduce(
        (sum, deal) =>
          sum +
          (Number(deal.amount ?? 0) * Math.max(0, Math.min(Number(deal.probability ?? 0), 100))) /
            100,
        0,
      ),
      collected: recentInvoices.reduce((sum, invoice) => sum + Number(invoice.paid_amount ?? 0), 0),
      leads: recentLeads.length,
      onlineCollected: recentTransactions
        .filter((transaction) => transaction.status === "succeeded")
        .reduce((sum, transaction) => sum + Number(transaction.amount ?? 0), 0),
      onlinePending: recentTransactions
        .filter((transaction) => transaction.status === "pending")
        .reduce((sum, transaction) => sum + Number(transaction.amount ?? 0), 0),
      onlinePendingCount: recentTransactions.filter(
        (transaction) => transaction.status === "pending",
      ).length,
      accountingSynced: (leads ?? []).filter((lead) => Boolean(lead.hesabfa_code)).length,
      dueToday,
      stuck,
    };
  }, [activities, deals, invoices, leads, paymentTransactions]);

  const stageSummary = useMemo(
    () =>
      STAGE_ORDER.map((stage) => {
        const items = (deals ?? []).filter((deal) => deal.stage === stage);
        return {
          stage,
          count: items.length,
          total: items.reduce((sum, deal) => sum + Number(deal.amount ?? 0), 0),
          weighted: items.reduce(
            (sum, deal) =>
              sum +
              (Number(deal.amount ?? 0) *
                Math.max(0, Math.min(Number(deal.probability ?? 0), 100))) /
                100,
            0,
          ),
        };
      }),
    [deals],
  );
  const maxStage = Math.max(...stageSummary.map((item) => item.total), 1);
  const activeAutomations = (automations ?? []).filter((item) => item.is_active).length;
  const recentLeads = (leads ?? []).filter((lead) => isRecent(lead.created_at)).slice(0, 6);
  const sellerSummary = useMemo(() => {
    const summary = new Map<string, { name: string; deals: number; won: number }>();
    for (const deal of deals ?? []) {
      const key = deal.seller_id ?? "unknown";
      const current = summary.get(key) ?? {
        name: deal.users?.full_name ?? "فروشنده ثبت نشده",
        deals: 0,
        won: 0,
      };
      current.deals += 1;
      if (deal.stage === "won") current.won += Number(deal.amount ?? 0);
      summary.set(key, current);
    }
    return [...summary.values()].sort((a, b) => b.won - a.won).slice(0, 4);
  }, [deals]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="داشبورد فروش"
        description="آنچه امروز برای جلو بردن فروش و پیگیری مشتریان باید بدانید."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/demo/clients" search={{ q: undefined }} className="gap-2">
                <Plus className="size-4" />
                ثبت سرنخ
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/demo/deals" className="gap-2">
                <Target className="size-4" />
                مشاهده قیف
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/demo/integrations" className="gap-2">
                <Plug className="size-4" />
                اتصال سرویس‌ها
              </Link>
            </Button>
          </div>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="شاخص‌های کلیدی">
        <Kpi label="ارزش قیف باز" value={formatTomanCompact(stats.pipeline)} icon={Target} />
        <Kpi
          label="ارزش وزنی قیف"
          value={formatTomanCompact(stats.weightedPipeline)}
          icon={TrendingUp}
        />
        <Kpi
          label="دریافتی ۳۰ روز اخیر"
          value={formatTomanCompact(stats.collected)}
          icon={Wallet}
        />
        <Kpi label="سرنخ جدید" value={formatNumber(stats.leads)} icon={Users} />
        <Kpi label="پیگیری امروز" value={formatNumber(stats.dueToday.length)} icon={ListTodo} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">قیف فروش</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">توزیع ارزش معاملات در مراحل فروش</p>
            </div>
            <Link
              to="/demo/deals"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              مدیریت قیف <ArrowLeft className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {dealsLoading ? (
              <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
            ) : null}
            {stageSummary.map((item) => (
              <div
                key={item.stage}
                className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 text-sm"
              >
                <span className="truncate text-muted-foreground">{STAGE_LABELS[item.stage]}</span>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500"
                    style={{
                      width: `${Math.max(item.total ? (item.total / maxStage) * 100 : 0, item.count ? 5 : 0)}%`,
                    }}
                  />
                </div>
                <span className="min-w-20 text-end text-xs font-medium text-foreground">
                  <span className="block">{formatTomanCompact(item.total)}</span>
                  <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground">
                    وزنی: {formatTomanCompact(item.weighted)}
                  </span>
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">پیگیری‌های فوری</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                کارهایی که نباید از امروز عبور کنند
              </p>
            </div>
            <Clock3 className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            {stats.dueToday.length === 0 ? (
              <EmptyState
                title="کار عقب‌افتاده‌ای ندارید"
                description="پیگیری جدید را از صفحه فعالیت‌ها ثبت کنید."
              />
            ) : (
              <div className="divide-y divide-border">
                {stats.dueToday.slice(0, 5).map((activity) => (
                  <Link
                    key={activity.id}
                    to="/demo/activities"
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:text-primary"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{activity.subject}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {activity.contacts?.full_name ?? activity.deals?.title ?? "بدون ارتباط"}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {activity.status === "done" ? "انجام شد" : "باز"}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">وضعیت دریافت</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                پرداخت‌های قطعی و درخواست‌های آنلاین در ۳۰ روز اخیر
              </p>
            </div>
            <CreditCard className="size-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <FlowMetric
              label="پرداخت آنلاین موفق"
              value={formatTomanCompact(stats.onlineCollected)}
              icon={CheckCircle2}
              tone="success"
            />
            <FlowMetric
              label="در انتظار پرداخت"
              value={`${formatTomanCompact(stats.onlinePending)} · ${formatNumber(stats.onlinePendingCount)} درخواست`}
              icon={Clock3}
              tone="warning"
            />
            <FlowMetric
              label="مانده فاکتورهای باز"
              value={formatTomanCompact(
                (invoices ?? [])
                  .filter((invoice) => ["unpaid", "partial"].includes(invoice.status))
                  .reduce(
                    (sum, invoice) =>
                      sum +
                      Math.max(Number(invoice.total ?? 0) - Number(invoice.paid_amount ?? 0), 0),
                    0,
                  ),
              )}
              icon={Wallet}
              tone="neutral"
            />
            <FlowMetric
              label="مخاطب همگام‌شده با حسابفا"
              value={formatNumber(stats.accountingSynced)}
              icon={Calculator}
              tone="neutral"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">مالکیت فروش</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                چه کسی معامله را جلو برده و چه مبلغی را برده است
              </p>
            </div>
            <Users className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            {sellerSummary.length === 0 ? (
              <EmptyState
                title="فروشنده‌ای ثبت نشده است"
                description="در معامله بعدی مسئول فروش را تعیین کنید."
              />
            ) : (
              <div className="divide-y divide-border">
                {sellerSummary.map((seller) => (
                  <div
                    key={seller.name}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{seller.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatNumber(seller.deals)} معامله
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium">
                      {formatTomanCompact(seller.won)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">سرنخ‌های تازه</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">۳۰ روز اخیر</p>
            </div>
            <Link
              to="/demo/clients"
              search={{ q: undefined }}
              className="text-xs text-primary hover:underline"
            >
              همه سرنخ‌ها
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <EmptyState title="سرنخ تازه‌ای نیست" description="اولین سرنخ فروش را ثبت کنید." />
            ) : (
              <div className="divide-y divide-border">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{lead.full_name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {lead.source || "منبع نامشخص"}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(lead.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">معاملات گیرکرده</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">بیش از ۳ روز بدون تغییر مرحله</p>
            </div>
            <TrendingUp className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            {stats.stuck.length === 0 ? (
              <EmptyState title="معامله‌ی گیرکرده ندارید" description="قیف فروش به‌روز است." />
            ) : (
              <div className="divide-y divide-border">
                {stats.stuck.slice(0, 6).map((deal) => (
                  <Link
                    key={deal.id}
                    to="/demo/deals"
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:text-primary"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{deal.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {STAGE_LABELS[deal.stage]}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium">
                      {formatTomanCompact(deal.amount)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
        <span>{formatNumber(activeAutomations)} اتوماسیون فعال است</span>
        <Link
          to="/demo/automations"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          مدیریت اتوماسیون <ArrowLeft className="size-3.5" />
        </Link>
        <span>{formatDateTime(new Date().toISOString())}</span>
      </div>
    </div>
  );
}

function Kpi({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Target }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-xl font-semibold text-foreground">{value}</p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </CardContent>
    </Card>
  );
}

function FlowMetric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
  tone: "success" | "warning" | "neutral";
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-500/10 text-emerald-700"
      : tone === "warning"
        ? "bg-amber-500/10 text-amber-700"
        : "bg-primary/10 text-primary";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${toneClass}`}
        >
          <Icon className="size-4" />
        </span>
        <span className="truncate text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="shrink-0 text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
