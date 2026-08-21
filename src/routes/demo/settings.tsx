import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/demo/components/app-shell";
import { useTable, useUpsertRow } from "@/demo/lib/crm";
import { updateProfileFn } from "@/demo/server/functions";
import { useAuth, ROLE_LABELS } from "@/demo/hooks/use-auth";
import type { Role } from "@/demo/server/types";
import { Card, CardContent } from "@/demo/components/ui/card";
import { Button } from "@/demo/components/ui/button";
import { Input } from "@/demo/components/ui/input";
import { Label } from "@/demo/components/ui/label";
import { Badge } from "@/demo/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listRowsFn } from "@/demo/server/functions";
import { CURRENCIES } from "@/demo/lib/clinic";

export const Route = createFileRoute("/demo/settings")({
  head: () => ({
    meta: [
      { title: "تنظیمات | DaalCRM" },
      { name: "description", content: "تنظیمات سازمان، پروفایل کاربری و نقش‌های دسترسی." },
      { property: "og:title", content: "تنظیمات | DaalCRM" },
      { property: "og:description", content: "مدیریت تنظیمات سازمان و پروفایل." },
    ],
  }),
  component: SettingsPage,
});

type Settings = {
  id: string;
  org_name: string | null;
  currency: string | null;
  timezone: string | null;
};
type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
};

function SettingsPage() {
  const { data } = useTable<Settings>("org_settings");
  const { user, has, isDemo } = useAuth();
  const [saving, setSaving] = useState(false);
  const settings = data?.[0];

  const team = useQuery({
    queryKey: ["table", "users", "admin-team"],
    queryFn: async () => {
      const rows = await listRowsFn({
        data: {
          table: "users",
          select: "id, full_name, email, role",
          orderBy: "created_at",
          ascending: true,
        },
      });
      return (rows ?? []) as Profile[];
    },
    enabled: has("admin", "manager"),
  });
  const users = team.data ?? [];
  const me = users.find((u) => u.id === user?.id);
  const upsert = useUpsertRow("org_settings");

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!me || isDemo) return;
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      await updateProfileFn({ data: { fullName: String(fd.get("full_name") ?? "") } });
      toast.success("پروفایل به‌روزرسانی شد");
    } catch (error) {
      toast.error(`خطا: ${error instanceof Error ? error.message : "خطای ناشناخته"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="تنظیمات" description="پیکربندی سازمان و حساب کاربری شما" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-semibold text-foreground">اطلاعات سازمان</h2>
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
                    timezone: String(fd.get("timezone") ?? "Asia/Tehran"),
                  },
                  { onSuccess: () => toast.success("تنظیمات ذخیره شد") },
                );
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="org_name">نام سازمان</Label>
                <Input
                  id="org_name"
                  name="org_name"
                  defaultValue={settings?.org_name ?? ""}
                  disabled={isDemo}
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
              <div className="space-y-2">
                <Label htmlFor="timezone">منطقه زمانی</Label>
                <Input
                  id="timezone"
                  name="timezone"
                  defaultValue={settings?.timezone ?? "Asia/Tehran"}
                  disabled={isDemo}
                />
              </div>
              <Button type="submit" disabled={isDemo}>
                ذخیره
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-semibold text-foreground">پروفایل من</h2>
            <form className="space-y-4" onSubmit={saveProfile}>
              <div className="space-y-2">
                <Label htmlFor="full_name">نام نمایشی</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={me?.full_name ?? ""}
                  disabled={isDemo}
                />
              </div>
              <div className="space-y-2">
                <Label>ایمیل</Label>
                <Input value={me?.email ?? ""} disabled />
              </div>
              <Button type="submit" disabled={!me || saving || isDemo}>
                {saving ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="space-y-3 p-6">
            <h2 className="font-semibold text-foreground">اعضای تیم</h2>
            <div className="space-y-2">
              {(users ?? []).map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-foreground">{u.full_name ?? "بدون نام"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{ROLE_LABELS[u.role]}</Badge>
                    {u.id === user?.id ? <Badge variant="outline">شما</Badge> : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
