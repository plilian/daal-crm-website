import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/demo/components/app-shell";
import {
  ACTION_LABELS,
  TRIGGER_LABELS,
  useTable,
  useUpsertRow,
  useDeleteRow,
  formatDate,
  type ActionType as CrmActionType,
  type TriggerType as CrmTriggerType,
} from "@/demo/lib/crm";
import { formatDateTime } from "@/demo/lib/clinic";
import { PlaceholderChips } from "@/demo/components/placeholder-chips";
import { Button } from "@/demo/components/ui/button";
import { Card, CardContent } from "@/demo/components/ui/card";
import { Badge } from "@/demo/components/ui/badge";
import { Switch } from "@/demo/components/ui/switch";
import { Input } from "@/demo/components/ui/input";
import { Label } from "@/demo/components/ui/label";
import { Textarea } from "@/demo/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/demo/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/demo/components/ui/table";
import { listRowsFn } from "@/demo/server/functions";
import { useAuth } from "@/demo/hooks/use-auth";
import {
  Plus,
  Trash2,
  Workflow,
  Pencil,
  X,
  ListTodo,
  MessageSquare,
  Mail,
  Webhook,
  Bot,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export const Route = createFileRoute("/demo/automations")({
  head: () => ({
    meta: [
      { title: "اتوماسیون | DaalCRM" },
      {
        name: "description",
        content: "ساخت گردش‌کار خودکار با تریگر و اکشن برای پیامک، ایمیل و وظایف.",
      },
      { property: "og:title", content: "اتوماسیون | DaalCRM" },
      { property: "og:description", content: "خودکارسازی فرایندهای فروش و پیگیری مشتری." },
    ],
  }),
  component: Automations,
});

type TriggerType =
  "contact_created" | "deal_stage_changed" | "deal_won" | "activity_overdue" | "scheduled";
type ActionType = "create_task" | "send_sms" | "send_email" | "call_webhook" | "ai_summarize";
type ActionDraft = { type: ActionType; config: Record<string, unknown> };

type Automation = {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  actions: { type: string; config?: Record<string, unknown> }[];
  is_active: boolean;
  schedule_interval_minutes: number | null;
  created_at: string;
};

type Run = {
  id: string;
  automation_id: string | null;
  status: string;
  message: string | null;
  created_at: string;
  automations?: { name: string } | null;
};

const AVAILABLE_TRIGGERS: { value: TriggerType; label: string }[] = [
  { value: "contact_created", label: TRIGGER_LABELS["contact_created"] },
  { value: "deal_stage_changed", label: TRIGGER_LABELS["deal_stage_changed"] },
  { value: "deal_won", label: TRIGGER_LABELS["deal_won"] },
  { value: "activity_overdue", label: TRIGGER_LABELS["activity_overdue"] },
  { value: "scheduled", label: TRIGGER_LABELS["scheduled"] },
];

const ACTION_META: Record<ActionType, { label: string; desc: string; icon: typeof Mail }> = {
  create_task: {
    label: ACTION_LABELS["create_task"],
    desc: "پس از رویداد، یک وظیفه به یک همکار اختصاص داده می‌شود",
    icon: ListTodo,
  },
  send_sms: {
    label: ACTION_LABELS["send_sms"],
    desc: "ارسال پیامک شخصی‌سازی‌شده به مخاطب",
    icon: MessageSquare,
  },
  send_email: {
    label: ACTION_LABELS["send_email"],
    desc: "ارسال ایمیل شخصی‌سازی‌شده به مخاطب",
    icon: Mail,
  },
  call_webhook: {
    label: ACTION_LABELS["call_webhook"],
    desc: "اطلاع‌رسانی به سامانه بیرونی",
    icon: Webhook,
  },
  ai_summarize: {
    label: ACTION_LABELS["ai_summarize"],
    desc: "ساخت خلاصه فارسی از اطلاعات مخاطب و ثبت آن به‌عنوان یادداشت",
    icon: Bot,
  },
};

const TEMPLATE_FIELD: Partial<Record<ActionType, string>> = {
  create_task: "subject_template",
  send_sms: "message_template",
  send_email: "body_template",
  ai_summarize: "subject_template",
};

function AutomationDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
  users,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Automation | null;
  onSaved: () => void;
  users: { id: string; full_name: string }[];
}) {
  const upsert = useUpsertRow("automations", "اتوماسیون ذخیره شد");
  const [name, setName] = useState(editing?.name ?? "");
  const [triggerType, setTriggerType] = useState<TriggerType>(
    AVAILABLE_TRIGGERS.some((t) => t.value === editing?.trigger_type)
      ? (editing?.trigger_type as TriggerType)
      : "contact_created",
  );
  const [description, setDescription] = useState(editing?.description ?? "");
  const [scheduleMinutes, setScheduleMinutes] = useState(
    String(editing?.schedule_interval_minutes ?? 60),
  );
  const [actions, setActions] = useState<ActionDraft[]>(
    (editing?.actions ?? [])
      .map((a) => ({ type: a.type as ActionType, config: a.config ?? {} }))
      .filter((a) => ACTION_META[a.type]),
  );

  useEffect(() => {
    const nextTrigger = AVAILABLE_TRIGGERS.some((t) => t.value === editing?.trigger_type)
      ? (editing?.trigger_type as TriggerType)
      : "contact_created";
    setName(editing?.name ?? "");
    setTriggerType(nextTrigger);
    setDescription(editing?.description ?? "");
    setScheduleMinutes(String(editing?.schedule_interval_minutes ?? 60));
    setActions(
      (editing?.actions ?? [])
        .map((a) => ({ type: a.type as ActionType, config: a.config ?? {} }))
        .filter((a) => ACTION_META[a.type]),
    );
  }, [editing, open]);

  function addAction(type: ActionType) {
    if (actions.some((a) => a.type === type)) return;
    setActions((prev) => [...prev, { type, config: {} }]);
  }

  function removeAction(type: ActionType) {
    setActions((prev) => prev.filter((a) => a.type !== type));
  }

  function setConfig(type: ActionType, key: string, value: unknown) {
    setActions((prev) =>
      prev.map((a) => (a.type === type ? { ...a, config: { ...a.config, [key]: value } } : a)),
    );
  }

  function insertToken(type: ActionType, field: string, token: string) {
    setActions((prev) =>
      prev.map((a) =>
        a.type === type
          ? { ...a, config: { ...a.config, [field]: String(a.config[field] ?? "") + token } }
          : a,
      ),
    );
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      name: name.trim(),
      description: description.trim() || null,
      trigger_type: triggerType,
      actions: actions.map((a) => ({ type: a.type, config: a.config })),
      is_active: true,
      schedule_interval_minutes:
        triggerType === "scheduled" ? Math.max(Number(scheduleMinutes) || 60, 5) : null,
    };
    if (editing?.id) payload["id"] = editing.id;
    upsert.mutate(payload, {
      onSuccess: () => {
        onSaved();
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "ویرایش اتوماسیون" : "ساخت اتوماسیون"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="name">نام اتوماسیون</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="مثلاً پیگیری سرنخ جدید"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trigger_type">تریگر (چه زمانی اجرا شود؟)</Label>
            <select
              id="trigger_type"
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as TriggerType)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {AVAILABLE_TRIGGERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {triggerType === "scheduled" ? (
            <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <Label htmlFor="schedule_interval_minutes">فاصله اجرای خودکار (دقیقه)</Label>
              <Input
                id="schedule_interval_minutes"
                type="number"
                min={5}
                step={5}
                value={scheduleMinutes}
                onChange={(e) => setScheduleMinutes(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                حداقل فاصله ۵ دقیقه است. اجرای زمان‌بندی‌شده روی سرور در اولین درخواست بعد از موعد
                انجام می‌شود.
              </p>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label>اکشن‌ها</Label>
            {actions.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                حداقل یک اکشن انتخاب کنید.
              </p>
            ) : (
              <div className="space-y-3">
                {actions.map((draft) => {
                  const meta = ACTION_META[draft.type];
                  const Icon = meta.icon;
                  const field = TEMPLATE_FIELD[draft.type];
                  const insertInto = (configKey: string) => (t: string) =>
                    insertToken(draft.type, configKey, t);
                  return (
                    <div key={draft.type} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="size-4 text-primary" />
                          <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="حذف اکشن"
                          onClick={() => removeAction(draft.type)}
                        >
                          <X className="size-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="mb-3 mt-1 text-xs text-muted-foreground">{meta.desc}</p>

                      {draft.type === "create_task" ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>مسئول وظیفه</Label>
                            <select
                              value={String(draft.config["assignee_id"] ?? "")}
                              onChange={(e) => setConfig(draft.type, "assignee_id", e.target.value)}
                              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                            >
                              <option value="">— انتخاب همکار —</option>
                              {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>موضوع وظیفه</Label>
                            <Textarea
                              value={String(draft.config["subject_template"] ?? "")}
                              onChange={(e) =>
                                setConfig(draft.type, "subject_template", e.target.value)
                              }
                              placeholder="پیگیری {full_name}"
                            />
                            <PlaceholderChips onInsert={insertInto("subject_template")} />
                          </div>
                          <div className="space-y-2">
                            <Label>سررسید (چند روز بعد از رویداد)</Label>
                            <Input
                              type="number"
                              min={0}
                              value={String(draft.config["due_days"] ?? 1)}
                              onChange={(e) =>
                                setConfig(draft.type, "due_days", Number(e.target.value))
                              }
                            />
                          </div>
                        </div>
                      ) : null}

                      {draft.type === "send_sms" ? (
                        <div className="space-y-2">
                          <Label>متن پیامک (با متغیرها شخصی‌سازی می‌شود)</Label>
                          <Textarea
                            value={String(draft.config["message_template"] ?? "")}
                            onChange={(e) =>
                              setConfig(draft.type, "message_template", e.target.value)
                            }
                            placeholder={"سلام {full_name} عزیز، پیگیری شما برای {date} ثبت شد..."}
                          />
                          <PlaceholderChips onInsert={insertInto("message_template")} />
                          <p className="text-[11px] text-muted-foreground">
                            هر مخاطب پیام خودش را بر اساس نام، شرکت و تاریخ دریافت می‌کند.
                          </p>
                        </div>
                      ) : null}

                      {draft.type === "send_email" ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>موضوع ایمیل</Label>
                            <Input
                              value={String(draft.config["subject_template"] ?? "")}
                              onChange={(e) =>
                                setConfig(draft.type, "subject_template", e.target.value)
                              }
                              placeholder="پیشنهاد ویژه برای {full_name}"
                            />
                            <PlaceholderChips onInsert={insertInto("subject_template")} />
                          </div>
                          <div className="space-y-2">
                            <Label>متن ایمیل</Label>
                            <Textarea
                              value={String(draft.config["body_template"] ?? "")}
                              onChange={(e) =>
                                setConfig(draft.type, "body_template", e.target.value)
                              }
                              placeholder={"سلام {full_name}، شرکت {company} ..."}
                            />
                            <PlaceholderChips onInsert={insertInto("body_template")} />
                          </div>
                        </div>
                      ) : null}

                      {draft.type === "ai_summarize" ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>مسئول یادداشت (اختیاری)</Label>
                            <select
                              value={String(draft.config["assignee_id"] ?? "")}
                              onChange={(e) => setConfig(draft.type, "assignee_id", e.target.value)}
                              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                            >
                              <option value="">— بدون مسئول —</option>
                              {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>عنوان یادداشت</Label>
                            <Input
                              value={String(
                                draft.config["subject_template"] ?? "خلاصه هوشمند {full_name}",
                              )}
                              onChange={(e) =>
                                setConfig(draft.type, "subject_template", e.target.value)
                              }
                              placeholder="خلاصه هوشمند {full_name}"
                            />
                            <PlaceholderChips onInsert={insertInto("subject_template")} />
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            خلاصه در فعالیت‌های مخاطب ثبت می‌شود و برای رویدادهای دارای مخاطب یا
                            معامله قابل استفاده است.
                          </p>
                        </div>
                      ) : null}

                      {draft.type === "call_webhook" ? (
                        <div className="space-y-2">
                          <Label>آدرس وب‌هوک</Label>
                          <Input
                            dir="ltr"
                            value={String(draft.config["url"] ?? "")}
                            onChange={(e) => setConfig(draft.type, "url", e.target.value)}
                            placeholder="https://example.com/hook"
                          />
                        </div>
                      ) : null}
                      {field ? (
                        <p className="mt-2 text-[11px] text-muted-foreground" dir="ltr">
                          برای درج متغیر، روی دکمه دلخواه بالا کلیک کنید.
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>افزودن اکشن دیگر</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ACTION_META) as ActionType[]).map((t) => {
                const selected = actions.some((a) => a.type === t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => (selected ? removeAction(t) : addAction(t))}
                    className={
                      "rounded-lg border px-3 py-2 text-xs transition-colors " +
                      (selected
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border text-muted-foreground hover:bg-muted")
                    }
                  >
                    {ACTION_META[t].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={upsert.isPending}>
            ذخیره اتوماسیون
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RunsTable() {
  const { data } = useTable<Run>("automation_runs", {
    select: "id, automation_id, status, message, created_at, automations(name)",
  });
  const rows = (data ?? []).slice(0, 15);
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-base font-semibold text-foreground">ثبت اجراها</h2>
      <div className="surface-panel overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اتوماسیون</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>نتیجه</TableHead>
              <TableHead>زمان</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  هنوز اجرایی ثبت نشده است.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.automations?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "success" ? "secondary" : "destructive"}>
                      {r.status === "success" ? "موفق" : "خطا"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md whitespace-pre-wrap text-xs text-muted-foreground">
                    {r.message ?? "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs">
                    {formatDateTime(r.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Automations() {
  const { has, loading, isDemo } = useAuth();
  const { data } = useTable<Automation>("automations");
  const remove = useDeleteRow("automations");
  const upsert = useUpsertRow("automations", "اتوماسیون به‌روزرسانی شد");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Automation | null>(null);

  const usersQuery = useQuery({
    queryKey: ["table", "users", "assignees"],
    queryFn: async () => {
      const rows = await listRowsFn({
        data: {
          table: "users",
          select: "id, full_name",
          orderBy: "full_name",
          ascending: true,
        },
      });
      return (rows ?? []) as { id: string; full_name: string }[];
    },
    enabled: has("admin", "manager"),
  });
  const users = usersQuery.data ?? [];

  if (loading) return <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>;
  const canManage = has("admin", "manager") && !isDemo;

  const action: ReactNode | undefined = canManage ? (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setEditing(null);
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" /> اتوماسیون جدید
        </Button>
      </DialogTrigger>
      <AutomationDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSaved={() => setEditing(null)}
        users={users}
      />
    </Dialog>
  ) : undefined;

  return (
    <div>
      <PageHeader
        title="اتوماسیون"
        description="وقتی اتفاقی رخ داد، سامانه به‌جای شما کار را انجام دهد"
        action={action}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Workflow className="size-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {TRIGGER_LABELS[item.trigger_type as CrmTriggerType] ?? item.trigger_type}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={item.is_active}
                  disabled={isDemo}
                  onCheckedChange={(checked) => upsert.mutate({ id: item.id, is_active: checked })}
                />
              </div>
              {item.description ? (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {(item.actions ?? []).map((a, i) => (
                  <Badge key={i} variant="secondary">
                    {ACTION_LABELS[a.type as CrmActionType] ?? a.type}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  {item.trigger_type === "scheduled" && item.schedule_interval_minutes
                    ? `هر ${item.schedule_interval_minutes} دقیقه · `
                    : null}
                  {formatDate(item.created_at)}
                </span>
                <div className="flex gap-1">
                  {canManage ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="ویرایش"
                      onClick={() => {
                        setEditing(item);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  ) : null}
                  {canManage ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="حذف"
                      onClick={() => remove.mutate(item.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            هنوز اتوماسیونی نساخته‌اید. یک اتوماسیون بسازید تا پس از رویدادهایی مثل ثبت مخاطب جدید،
            وظیفه به همکار اختصاص یابد یا پیام شخصی‌سازی‌شده ارسال شود.
          </p>
        ) : null}
      </div>

      <RunsTable />
    </div>
  );
}
