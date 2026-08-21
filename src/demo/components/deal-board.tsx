import { useMemo, useState } from "react";
import {
  useTable,
  useUpdateRow,
  formatMoney,
  STAGE_LABELS,
  STAGE_ORDER,
  type Stage,
} from "@/demo/lib/crm";
import { Badge } from "@/demo/components/ui/badge";
import { cn } from "@/demo/lib/utils";
import { GripVertical } from "lucide-react";
import { useAuth } from "@/demo/hooks/use-auth";

type Deal = {
  id: string;
  title: string;
  amount: number;
  currency?: string | null;
  stage: Stage;
  probability: number;
  expected_close_date: string | null;
  seller_id: string | null;
  users?: { full_name: string } | null;
};

const STAGE_TONE: Record<Stage, string> = {
  new: "border-t-sky-500/70",
  qualified: "border-t-indigo-500/70",
  proposal: "border-t-amber-500/70",
  negotiation: "border-t-orange-500/70",
  won: "border-t-emerald-500/70",
  lost: "border-t-rose-500/70",
};

export function DealBoard() {
  const { data, isLoading } = useTable<Deal>("deals", {
    select:
      "id, title, amount, currency, stage, probability, expected_close_date, seller_id, users(full_name)",
  });
  const update = useUpdateRow("deals", "مرحله معامله تغییر کرد");
  const { isDemo } = useAuth();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(STAGE_ORDER.map((s) => [s, [] as Deal[]])) as Record<
      Stage,
      Deal[]
    >;
    for (const deal of data ?? []) (map[deal.stage] ?? map.new).push(deal);
    return map;
  }, [data]);

  if (isLoading) {
    return (
      <div className="surface-panel p-10 text-center text-muted-foreground">
        در حال بارگذاری قیف فروش...
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGE_ORDER.map((stage) => {
        const deals = grouped[stage] ?? [];
        const total = deals.reduce((sum, d) => sum + Number(d.amount ?? 0), 0);
        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault();
              setOverStage(stage);
            }}
            onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
            onDrop={() => {
              if (!isDemo && dragId) update.mutate({ id: dragId, values: { stage } });
              setDragId(null);
              setOverStage(null);
            }}
            className={cn(
              "surface-panel flex w-72 shrink-0 flex-col border-t-4 p-3 transition-colors",
              STAGE_TONE[stage],
              overStage === stage && "ring-2 ring-primary/60",
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{STAGE_LABELS[stage]}</p>
              <Badge variant="secondary">{deals.length}</Badge>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">{formatMoney(total)}</p>
            <div className="flex flex-1 flex-col gap-2">
              {deals.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  معامله‌ای در این مرحله نیست
                </p>
              ) : (
                deals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable={!isDemo}
                    onDragStart={() => setDragId(deal.id)}
                    onDragEnd={() => setDragId(null)}
                    className={cn(
                      "rounded-lg border border-border bg-card p-3 transition-opacity",
                      !isDemo && "cursor-grab active:cursor-grabbing",
                      dragId === deal.id && "opacity-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{deal.title}</p>
                      <GripVertical className="size-4 shrink-0 text-muted-foreground/60" />
                    </div>
                    <p className="mt-2 text-xs text-primary">
                      {formatMoney(deal.amount, deal.currency)}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      احتمال موفقیت: {deal.probability}٪
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      فروشنده: {deal.users?.full_name ?? "ثبت نشده"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
