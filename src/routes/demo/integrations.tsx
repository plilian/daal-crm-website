import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/demo/components/app-shell";
import { useTable, useUpsertRow } from "@/demo/lib/crm";
import { testIntegrationFn, updateRowFn } from "@/demo/server/functions";
import { Card, CardContent } from "@/demo/components/ui/card";
import { Button } from "@/demo/components/ui/button";
import { Input } from "@/demo/components/ui/input";
import { Label } from "@/demo/components/ui/label";
import { Badge } from "@/demo/components/ui/badge";
import { Switch } from "@/demo/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/demo/components/ui/dialog";
import {
  MessageSquare,
  Mail,
  Phone,
  Database,
  Settings2,
  PlugZap,
  BrainCircuit,
  Bot,
  Calculator,
  CreditCard,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/demo/hooks/use-auth";

export const Route = createFileRoute("/demo/integrations")({
  head: () => ({
    meta: [
      { title: "یکپارچه‌سازی‌ها | DaalCRM" },
      {
        name: "description",
        content: "اتصال حسابفا، زرین‌پال، پیامک، ایمیل، VoIP و پایگاه‌داده PostgreSQL.",
      },
      { property: "og:title", content: "یکپارچه‌سازی‌ها | DaalCRM" },
      {
        property: "og:description",
        content: "اتصال حسابداری، پرداخت، پیامک، ایمیل و تلفن به CRM.",
      },
    ],
  }),
  component: Integrations,
});

type Integration = {
  id: string;
  kind: string;
  provider: string;
  is_enabled: boolean;
  config: Record<string, unknown> | null;
};

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "password" | "checkbox" | "select";
  options?: { value: string; label: string }[];
};

/** اسلات‌های ثابت شبکه — ترتیب DOM هرگز عوض نمی‌شود */
const KIND_ORDER = [
  "sms",
  "email",
  "voip",
  "postgres",
  "accounting_hesabfa",
  "payment_zarinpal",
  "ai_openai",
  "ai_gemini",
  "ai_compatible",
] as const;
type Kind = (typeof KIND_ORDER)[number];

const META: Record<Kind, { title: string; desc: string; icon: typeof Mail; fields: FieldDef[] }> = {
  sms: {
    title: "پیامک (کاوه‌نگار)",
    desc: "ارسال پیامک و کمپین از طریق سرویس کاوه‌نگار",
    icon: MessageSquare,
    fields: [
      { key: "api_key", label: "کلید API", type: "password" },
      { key: "sender", label: "شماره فرستنده" },
      { key: "template", label: "متن قالب پیش‌فرض" },
    ],
  },
  email: {
    title: "ایمیل (SMTP)",
    desc: "ارسال ایمیل تراکنشی از طریق سرور SMTP",
    icon: Mail,
    fields: [
      { key: "host", label: "آدرس SMTP" },
      { key: "port", label: "پورت", type: "number" },
      { key: "username", label: "نام کاربری" },
      { key: "password", label: "رمز عبور", type: "password" },
      { key: "from", label: "ایمیل فرستنده" },
      { key: "secure", label: "اتصال امن TLS", type: "checkbox" },
    ],
  },
  voip: {
    title: "تلفن گویا (Asterisk)",
    desc: "اتصال به Asterisk / Issabel برای تماس و ثبت مکالمات",
    icon: Phone,
    fields: [
      { key: "host", label: "آدرس سرور" },
      { key: "port", label: "پورت AMI", type: "number" },
      { key: "username", label: "نام کاربری AMI" },
      { key: "secret", label: "رمز AMI", type: "password" },
      { key: "extension", label: "داخلی پیش‌فرض" },
    ],
  },
  postgres: {
    title: "پایگاه‌داده PostgreSQL",
    desc: "اتصال به دیتابیس خارجی برای همگام‌سازی داده",
    icon: Database,
    fields: [
      { key: "host", label: "هاست" },
      { key: "port", label: "پورت", type: "number" },
      { key: "database", label: "نام دیتابیس" },
      { key: "username", label: "نام کاربری" },
      { key: "password", label: "رمز عبور", type: "password" },
      { key: "ssl", label: "اتصال SSL", type: "checkbox" },
    ],
  },
  accounting_hesabfa: {
    title: "حسابفا · حسابداری",
    desc: "همگام‌سازی مخاطبان و اطلاعات فروش با نرم‌افزار حسابداری حسابفا",
    icon: Calculator,
    fields: [
      { key: "base_url", label: "نشانی API", type: "text" },
      { key: "api_key", label: "کلید API حسابفا", type: "password" },
      { key: "login_token", label: "loginToken حسابفا", type: "password" },
      { key: "user_id", label: "نام کاربری حسابفا" },
      { key: "password", label: "رمز عبور حسابفا", type: "password" },
      { key: "year_id", label: "شناسه سال مالی", type: "number" },
    ],
  },
  payment_zarinpal: {
    title: "زرین‌پال · درگاه پرداخت",
    desc: "ساخت لینک پرداخت از روی فاکتور و ثبت خودکار نتیجه پرداخت",
    icon: CreditCard,
    fields: [
      { key: "merchant_id", label: "مرچنت‌کد" },
      { key: "callback_url", label: "نشانی بازگشت" },
      {
        key: "amount_unit",
        label: "واحد مبلغ ارسالی",
        type: "select",
        options: [
          { value: "toman", label: "تومان (تبدیل خودکار به ریال)" },
          { value: "rial", label: "ریال" },
        ],
      },
      { key: "sandbox", label: "حالت آزمایشی", type: "checkbox" },
    ],
  },
  ai_openai: {
    title: "OpenAI",
    desc: "اتصال مستقیم به OpenAI برای چت CRM و agentهای هوش مصنوعی",
    icon: BrainCircuit,
    fields: [
      { key: "api_key", label: "کلید API", type: "password" },
      { key: "model", label: "مدل", type: "text" },
      { key: "base_url", label: "آدرس پایه API", type: "text" },
    ],
  },
  ai_gemini: {
    title: "Google Gemini",
    desc: "اتصال مستقیم به Gemini برای پاسخ‌گویی و تحلیل داده‌های CRM",
    icon: Bot,
    fields: [
      { key: "api_key", label: "کلید API Gemini", type: "password" },
      { key: "model", label: "مدل", type: "text" },
      { key: "base_url", label: "آدرس پایه API", type: "text" },
    ],
  },
  ai_compatible: {
    title: "OpenAI-compatible / Local AI",
    desc: "اتصال به OpenRouter، Ollama، vLLM یا هر سرویس سازگار با OpenAI",
    icon: Bot,
    fields: [
      { key: "api_key", label: "کلید API (اختیاری)", type: "password" },
      { key: "model", label: "مدل", type: "text" },
      { key: "base_url", label: "آدرس پایه API", type: "text" },
    ],
  },
};

const INTEGRATIONS_QUERY_KEY = ["table", "integrations", "*"] as const;

function Integrations() {
  const { isDemo } = useAuth();
  const queryClient = useQueryClient();
  const { data } = useTable<Integration>("integrations");
  const upsert = useUpsertRow("integrations");
  const [editing, setEditing] = useState<Integration | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const meta = editing ? META[editing.kind as Kind] : null;

  const byKind = useMemo(() => {
    const map = new Map<string, Integration>();
    for (const row of data ?? []) map.set(row.kind, row);
    return map;
  }, [data]);

  function patchEnabled(id: string, is_enabled: boolean) {
    queryClient.setQueryData<Integration[]>(INTEGRATIONS_QUERY_KEY, (prev) =>
      (prev ?? []).map((row) => (row.id === id ? { ...row, is_enabled } : row)),
    );
  }

  async function toggleEnabled(item: Integration, checked: boolean) {
    if (isDemo) return;
    const prev = item.is_enabled;
    patchEnabled(item.id, checked);
    try {
      // بدون invalidate کل لیست — جای کارت‌ها ثابت می‌ماند
      await updateRowFn({
        data: { table: "integrations", id: item.id, values: { is_enabled: checked } },
      });
    } catch (error) {
      patchEnabled(item.id, prev);
      toast.error(error instanceof Error ? error.message : "تغییر وضعیت ذخیره نشد");
    }
  }

  async function testConnection(kind: string) {
    if (isDemo) return;
    setTesting(kind);
    try {
      const result = await testIntegrationFn({ data: { kind } });
      if (result.ok) {
        toast.success(result.message, { description: result.detail });
      } else {
        toast.error(result.message, { description: result.detail });
      }
    } catch (error) {
      toast.error(`خطا در تست اتصال: ${error instanceof Error ? error.message : "خطای ناشناخته"}`);
    } finally {
      setTesting(null);
    }
  }

  return (
    <div>
      <PageHeader title="یکپارچه‌سازی‌ها" description="سرویس‌های بیرونی را به CRM وصل کنید" />

      {/* همیشه ۲×۲ — اسلات‌ها با kind ثابت، نه با ترتیب API */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {KIND_ORDER.map((kind) => {
          const item = byKind.get(kind);
          const info = META[kind];
          const Icon = info.icon;

          if (!item) {
            return (
              <Card key={kind} className="min-h-[220px] opacity-40">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">{info.title}</p>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={kind} className="relative min-h-[220px]">
              {/* سوییچ گوشهٔ فیزیکی چپ — با تغییر وضعیت جابه‌جا نمی‌شود */}
              <div className="absolute left-4 top-5 z-10">
                <Switch
                  checked={item.is_enabled}
                  disabled={isDemo}
                  onCheckedChange={(checked) => toggleEnabled(item, checked)}
                />
              </div>

              <CardContent className="flex h-full flex-col gap-4 p-5 pe-5 ps-5 pt-5">
                <div className="flex items-start gap-3 pe-14">
                  <div className="shrink-0 rounded-xl bg-primary/15 p-2.5">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{info.title}</p>
                    <Badge
                      variant={item.is_enabled ? "default" : "secondary"}
                      className="mt-1 inline-flex w-[4.75rem] justify-center"
                    >
                      {item.is_enabled ? "فعال" : "غیرفعال"}
                    </Badge>
                  </div>
                </div>

                <p className="min-h-10 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {info.desc}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  {isDemo ? (
                    <div className="col-span-2 rounded-md border border-dashed border-border px-3 py-2 text-center text-xs text-muted-foreground">
                      فقط مشاهده
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        className="gap-2"
                        onClick={() => setEditing(item)}
                      >
                        <Settings2 className="size-4 shrink-0" /> تنظیمات
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2"
                        disabled={testing === kind}
                        onClick={() => testConnection(kind)}
                      >
                        <PlugZap className="size-4 shrink-0" />
                        <span className="inline-block w-[5.5rem] text-center">
                          {testing === kind ? "در حال تست..." : "تست اتصال"}
                        </span>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>تنظیمات {meta?.title}</DialogTitle>
          </DialogHeader>
          {editing && meta ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const config: Record<string, unknown> = {};
                for (const f of meta.fields) {
                  if (f.type === "checkbox") {
                    config[f.key] = fd.get(f.key) === "on";
                    continue;
                  }
                  const value = String(fd.get(f.key) ?? "");
                  config[f.key] = f.type === "number" ? Number(value) : value;
                }
                upsert.mutate(
                  { id: editing.id, config, is_enabled: true },
                  {
                    onSuccess: () => {
                      patchEnabled(editing.id, true);
                      setEditing(null);
                    },
                  },
                );
              }}
            >
              {meta.fields.map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.type === "select" ? (
                    <select
                      id={f.key}
                      name={f.key}
                      defaultValue={String(editing.config?.[f.key] ?? f.options?.[0]?.value ?? "")}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                    >
                      {f.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={f.key}
                      name={f.key}
                      type={
                        f.type === "checkbox"
                          ? "checkbox"
                          : f.type === "password"
                            ? "password"
                            : f.type === "number"
                              ? "number"
                              : "text"
                      }
                      defaultChecked={
                        f.type === "checkbox" ? Boolean(editing.config?.[f.key]) : undefined
                      }
                      defaultValue={
                        f.type === "checkbox" ? undefined : String(editing.config?.[f.key] ?? "")
                      }
                    />
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                پس از ذخیره، از دکمه «تست اتصال» برای بررسی صحت اطلاعات استفاده کنید.
              </p>
              <Button type="submit" className="w-full">
                ذخیره و فعال‌سازی
              </Button>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
