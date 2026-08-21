import { useMemo, useState } from "react";
import { Badge } from "@/demo/components/ui/badge";
import { Button } from "@/demo/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/demo/components/ui/dialog";
import { Input } from "@/demo/components/ui/input";
import { Label } from "@/demo/components/ui/label";
import { Textarea } from "@/demo/components/ui/textarea";
import {
  formatDate,
  formatMoney,
  formatNumber,
  useDeleteRow,
  useTable,
  useUpsertRow,
} from "@/demo/lib/crm";
import { CalendarDays, Handshake, Pencil, Plus, Trash2, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/demo/hooks/use-auth";

type EntityType = "contact" | "company";

type Affiliate = {
  id: string;
  name: string;
  commission_percent: number;
  status: string;
};

type Introduction = {
  id: string;
  affiliate_id: string;
  contact_id: string | null;
  company_id: string | null;
  status: string;
  commission_percent: number | null;
  commission_amount: number;
  converted_value: number;
  meeting_at: string | null;
  meeting_note: string | null;
  notes: string | null;
  affiliates?: { name: string; commission_percent: number } | null;
};

type Draft = {
  affiliateId: string;
  status: string;
  commissionPercent: string;
  commissionAmount: string;
  convertedValue: string;
  meetingAt: string;
  meetingNote: string;
  notes: string;
};

const INTRODUCTION_STATUSES = [
  { value: "introduced", label: "معرفی اولیه" },
  { value: "meeting_scheduled", label: "جلسه هماهنگ شد" },
  { value: "meeting_held", label: "جلسه برگزار شد" },
  { value: "proposal", label: "پیشنهاد ارسال شد" },
  { value: "won", label: "قرارداد منعقد شد" },
  { value: "commission_due", label: "کمیسیون قابل پرداخت" },
  { value: "paid", label: "کمیسیون پرداخت شد" },
  { value: "lost", label: "نتیجه نداشت" },
  { value: "lead", label: "ثبت از لینک" },
  { value: "qualified", label: "واجد شرایط" },
  { value: "converted", label: "تبدیل‌شده" },
  { value: "rejected", label: "رد شده" },
];

function emptyDraft(): Draft {
  return {
    affiliateId: "",
    status: "introduced",
    commissionPercent: "",
    commissionAmount: "",
    convertedValue: "",
    meetingAt: "",
    meetingNote: "",
    notes: "",
  };
}

function toDateTimeInput(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function draftFromIntroduction(item: Introduction): Draft {
  return {
    affiliateId: item.affiliate_id,
    status: item.status || "introduced",
    commissionPercent: item.commission_percent == null ? "" : String(item.commission_percent),
    commissionAmount: item.commission_amount == null ? "" : String(item.commission_amount),
    convertedValue: item.converted_value == null ? "" : String(item.converted_value),
    meetingAt: toDateTimeInput(item.meeting_at),
    meetingNote: item.meeting_note ?? "",
    notes: item.notes ?? "",
  };
}

export function B2BIntroducers({
  entityType,
  entityId,
  entityLabel,
}: {
  entityType: EntityType;
  entityId: string;
  entityLabel: string;
}) {
  const { isDemo } = useAuth();
  const { data: affiliates } = useTable<Affiliate>("affiliates", {
    select: "id, name, commission_percent, status",
  });
  const { data: allIntroductions } = useTable<Introduction>("affiliate_referrals", {
    select:
      "id, affiliate_id, contact_id, company_id, status, commission_percent, commission_amount, converted_value, meeting_at, meeting_note, notes, affiliates(name, commission_percent)",
  });
  const upsert = useUpsertRow("affiliate_referrals", "معرف فروش ذخیره شد");
  const remove = useDeleteRow("affiliate_referrals");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Introduction | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const introductions = useMemo(
    () =>
      (allIntroductions ?? []).filter((item) =>
        entityType === "company" ? item.company_id === entityId : item.contact_id === entityId,
      ),
    [allIntroductions, entityId, entityType],
  );
  const affiliateById = useMemo(
    () => new Map((affiliates ?? []).map((affiliate) => [affiliate.id, affiliate])),
    [affiliates],
  );
  const activeAffiliates = (affiliates ?? []).filter((affiliate) => affiliate.status === "active");
  const isFull = introductions.length >= 3;

  function openCreate() {
    if (activeAffiliates.length === 0) {
      toast.error("ابتدا یک همکار فروش فعال در بخش همکاران فروش ثبت کنید.");
      return;
    }
    if (isFull) {
      toast.error("برای هر سرنخ یا شرکت حداکثر سه معرف فروش قابل ثبت است.");
      return;
    }
    setEditing(null);
    setDraft(emptyDraft());
    setOpen(true);
  }

  function openEdit(item: Introduction) {
    setEditing(item);
    setDraft(draftFromIntroduction(item));
    setOpen(true);
  }

  function selectAffiliate(affiliateId: string) {
    const affiliate = affiliateById.get(affiliateId);
    setDraft((current) => ({
      ...current,
      affiliateId,
      commissionPercent:
        current.commissionPercent || affiliate?.commission_percent == null
          ? current.commissionPercent
          : String(affiliate.commission_percent),
    }));
  }

  function save() {
    if (!draft.affiliateId) {
      toast.error("یک معرف فروش انتخاب کنید.");
      return;
    }
    const values: Record<string, unknown> = {
      affiliate_id: draft.affiliateId,
      status: draft.status,
      commission_percent: draft.commissionPercent ? Number(draft.commissionPercent) : null,
      commission_amount: draft.commissionAmount ? Number(draft.commissionAmount) : 0,
      converted_value: draft.convertedValue ? Number(draft.convertedValue) : 0,
      meeting_at: draft.meetingAt ? new Date(draft.meetingAt).toISOString() : null,
      meeting_note: draft.meetingNote.trim() || null,
      notes: draft.notes.trim() || null,
      introduction_channel: "manual",
      [entityType === "company" ? "company_id" : "contact_id"]: entityId,
    };
    if (editing) values["id"] = editing.id;
    upsert.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        setEditing(null);
      },
    });
  }

  return (
    <section className="border-t border-border pt-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <UsersRound className="mt-0.5 size-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">معرف‌های فروش B2B</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {entityLabel} می‌تواند حداکثر سه معرف داشته باشد؛ جلسه، سهم کمیسیون و نتیجه هر معرفی
              جداگانه ثبت می‌شود.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={openCreate}
          disabled={isDemo || isFull || activeAffiliates.length === 0}
        >
          <Plus className="size-3.5" />
          معرف جدید
        </Button>
      </div>

      <div className="mt-3 space-y-2">
        {introductions.length === 0 ? (
          <p className="border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
            هنوز معرفی برای این مورد ثبت نشده است.
          </p>
        ) : (
          introductions.map((item) => (
            <div key={item.id} className="border border-border bg-muted/25 px-3 py-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.affiliates?.name ??
                      affiliateById.get(item.affiliate_id)?.name ??
                      "معرف فروش"}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="rounded-md text-[10px]">
                      {INTRODUCTION_STATUSES.find((status) => status.value === item.status)
                        ?.label ?? item.status}
                    </Badge>
                    {item.commission_percent != null ? (
                      <span className="text-[11px] text-muted-foreground">
                        سهم {formatNumber(item.commission_percent)}٪
                      </span>
                    ) : null}
                    {item.commission_amount ? (
                      <span className="text-[11px] text-muted-foreground">
                        {formatMoney(item.commission_amount)} کمیسیون
                      </span>
                    ) : null}
                  </div>
                </div>
                {!isDemo ? (
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="ویرایش معرف"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="حذف معرف"
                      onClick={() => remove.mutate(item.id)}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                ) : null}
              </div>
              {item.meeting_at ? (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  جلسه: {formatDate(item.meeting_at)}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش معرف فروش" : "ثبت معرف فروش B2B"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="introducer-affiliate">معرف فروش</Label>
              <select
                id="introducer-affiliate"
                value={draft.affiliateId}
                disabled={isDemo}
                onChange={(event) => selectAffiliate(event.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">انتخاب معرف</option>
                {activeAffiliates.map((affiliate) => (
                  <option key={affiliate.id} value={affiliate.id}>
                    {affiliate.name} - {formatNumber(affiliate.commission_percent)}٪ پیش‌فرض
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="introducer-status">وضعیت معرفی</Label>
                <select
                  id="introducer-status"
                  value={draft.status}
                  disabled={isDemo}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, status: event.target.value }))
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
                  {INTRODUCTION_STATUSES.filter((status) => status.value !== "lead").map(
                    (status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="introducer-meeting">زمان جلسه</Label>
                <Input
                  id="introducer-meeting"
                  type="datetime-local"
                  dir="ltr"
                  value={draft.meetingAt}
                  disabled={isDemo}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, meetingAt: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="introducer-percent">درصد کمیسیون</Label>
                <Input
                  id="introducer-percent"
                  type="number"
                  min="0"
                  max="100"
                  value={draft.commissionPercent}
                  disabled={isDemo}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, commissionPercent: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="introducer-value">ارزش قرارداد</Label>
                <Input
                  id="introducer-value"
                  type="number"
                  min="0"
                  value={draft.convertedValue}
                  disabled={isDemo}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, convertedValue: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="introducer-commission">مبلغ کمیسیون</Label>
                <Input
                  id="introducer-commission"
                  type="number"
                  min="0"
                  value={draft.commissionAmount}
                  disabled={isDemo}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, commissionAmount: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="introducer-meeting-note">یادداشت جلسه</Label>
              <Textarea
                id="introducer-meeting-note"
                value={draft.meetingNote}
                disabled={isDemo}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, meetingNote: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="introducer-notes">توضیحات همکاری</Label>
              <Textarea
                id="introducer-notes"
                value={draft.notes}
                disabled={isDemo}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, notes: event.target.value }))
                }
              />
            </div>
            <Button className="w-full gap-2" onClick={save} disabled={isDemo || upsert.isPending}>
              <Handshake className="size-4" />
              ذخیره معرفی
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
