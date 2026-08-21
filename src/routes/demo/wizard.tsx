import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/demo/components/app-shell";
import { useTable, useUpsertRow } from "@/demo/lib/crm";
import { CURRENCIES } from "@/demo/lib/clinic";
import { Button } from "@/demo/components/ui/button";
import { Input } from "@/demo/components/ui/input";
import { Label } from "@/demo/components/ui/label";
import { Card, CardContent } from "@/demo/components/ui/card";
import { Check, Building2, Users, Plug, Bot } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/demo/hooks/use-auth";

export const Route = createFileRoute("/demo/wizard")({
  head: () => ({
    meta: [
      { title: "ویزارد راه‌اندازی | DaalCRM" },
      {
        name: "description",
        content: "راه‌اندازی گام‌به‌گام CRM: سازمان، تیم، اتصال سرویس‌ها و هوش مصنوعی.",
      },
      { property: "og:title", content: "ویزارد راه‌اندازی | DaalCRM" },
      { property: "og:description", content: "راه‌اندازی سریع و ساده سامانه CRM." },
    ],
  }),
  component: Setup,
});

const STEPS = [
  { title: "سازمان", icon: Building2 },
  { title: "تیم", icon: Users },
  { title: "اتصال‌ها", icon: Plug },
  { title: "هوش مصنوعی", icon: Bot },
];

type Settings = {
  id: string;
  org_name: string | null;
  currency: string | null;
  setup_completed: boolean;
  setup_step: number;
};

function Setup() {
  const { isDemo } = useAuth();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { data } = useTable<Settings>("org_settings");
  const upsert = useUpsertRow("org_settings");
  const settings = data?.[0];

  return (
    <div>
      <PageHeader
        title="ویزارد راه‌اندازی"
        description={
          isDemo
            ? "این بخش در دموی عمومی فقط برای مشاهده ساختار راه‌اندازی نمایش داده می‌شود."
            : "در چهار گام ساده سامانه را آماده استفاده کنید"
        }
      />

      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.title} className="flex flex-1 items-center gap-2">
              <div
                className={
                  "flex size-10 shrink-0 items-center justify-center rounded-full border " +
                  (done
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground")
                }
              >
                {done ? <Check className="size-4" /> : <Icon className="size-4" />}
              </div>
              <span
                className={active ? "text-sm text-foreground" : "text-sm text-muted-foreground"}
              >
                {s.title}
              </span>
              {i < STEPS.length - 1 ? <div className="h-px flex-1 bg-border" /> : null}
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          {step === 0 ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (isDemo) return;
                const fd = new FormData(e.currentTarget);
                upsert.mutate(
                  {
                    ...(settings?.id ? { id: settings.id } : {}),
                    org_name: String(fd.get("org_name") ?? ""),
                    currency: String(fd.get("currency") ?? "IRT"),
                    setup_step: 1,
                    setup_completed: false,
                  },
                  { onSuccess: () => setStep(1) },
                );
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="org_name">نام سازمان</Label>
                <Input
                  id="org_name"
                  name="org_name"
                  required
                  disabled={isDemo}
                  defaultValue={settings?.org_name ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">واحد پول</Label>
                <select
                  id="currency"
                  name="currency"
                  defaultValue={settings?.currency ?? "IRT"}
                  disabled={isDemo}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={isDemo}>
                ادامه
              </Button>
            </form>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                اولین کاربر ثبت‌نام‌شده به‌صورت خودکار «مدیر» است. برای افزودن همکاران کافیست لینک
                ثبت‌نام را برایشان بفرستید؛ سپس در بخش تنظیمات نقش هرکدام را مشخص کنید.
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(0)}>
                  بازگشت
                </Button>
                <Button
                  onClick={() =>
                    upsert.mutate(
                      {
                        ...(settings?.id ? { id: settings.id } : {}),
                        setup_step: 2,
                        setup_completed: false,
                      },
                      { onSuccess: () => setStep(2) },
                    )
                  }
                  disabled={isDemo || upsert.isPending}
                >
                  ادامه
                </Button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                سرویس‌های پیامک، ایمیل، تلفن گویا، حسابفا، زرین‌پال و پایگاه‌داده را از صفحه
                یکپارچه‌سازی‌ها متصل کنید.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => navigate({ to: "/demo/integrations" })}>
                  رفتن به یکپارچه‌سازی‌ها
                </Button>
                <Button variant="secondary" onClick={() => setStep(1)}>
                  بازگشت
                </Button>
                <Button
                  onClick={() =>
                    upsert.mutate(
                      {
                        ...(settings?.id ? { id: settings.id } : {}),
                        setup_step: 3,
                        setup_completed: false,
                      },
                      { onSuccess: () => setStep(3) },
                    )
                  }
                  disabled={isDemo || upsert.isPending}
                >
                  ادامه
                </Button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                هوش مصنوعی از پیش فعال است. می‌توانید ایجنت اختصاصی بسازید یا مستقیم با داده‌هایتان
                چت کنید.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => navigate({ to: "/demo/agents" })}>
                  ساخت ایجنت
                </Button>
                <Button
                  disabled={isDemo || upsert.isPending}
                  onClick={() => {
                    upsert.mutate(
                      {
                        ...(settings?.id ? { id: settings.id } : {}),
                        setup_step: 4,
                        setup_completed: true,
                      },
                      {
                        onSuccess: () => {
                          toast.success("راه‌اندازی کامل شد 🎉");
                          navigate({ to: "/demo/dashboard" });
                        },
                      },
                    );
                  }}
                >
                  پایان راه‌اندازی
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
