import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { changeUserRoleFn } from "@/demo/server/functions";
import { AccessDenied, PageHeader } from "@/demo/components/app-shell";
import { Badge } from "@/demo/components/ui/badge";
import { Button } from "@/demo/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/demo/components/ui/table";
import { toast } from "sonner";
import { ROLE_LABELS, ROLE_OPTIONS, useAuth, type Role } from "@/demo/hooks/use-auth";
import { formatDate } from "@/demo/lib/crm";
import { listRowsFn } from "@/demo/server/functions";
import { useState } from "react";
import { Save } from "lucide-react";

export const Route = createFileRoute("/demo/users")({
  head: () => ({
    meta: [
      { title: "کاربران و سطوح دسترسی | DaalCRM" },
      { name: "description", content: "مدیریت کاربران سامانه و تعیین سطح دسترسی هر نفر." },
      { property: "og:title", content: "کاربران و سطوح دسترسی" },
      { property: "og:description", content: "مدیریت کاربران و نقش‌های دسترسی." },
    ],
  }),
  component: UsersPage,
});

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  is_active: boolean;
  created_at: string;
};

function UsersPage() {
  const { has, loading, user, isDemo } = useAuth();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<Record<string, Role>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const profiles = useQuery({
    queryKey: ["table", "users", "admin-users"],
    queryFn: async () => {
      const data = await listRowsFn({
        data: {
          table: "users",
          select: "id, full_name, email, role, is_active, created_at",
          orderBy: "created_at",
          ascending: true,
        },
      });
      return (data ?? []) as ProfileRow[];
    },
  });

  async function saveRole(userId: string, role: Role) {
    setSaving((s) => ({ ...s, [userId]: true }));
    try {
      await changeUserRoleFn({ data: { userId, role } });
      await queryClient.invalidateQueries({ queryKey: ["table", "users"] });
      toast.success("نقش کاربر به‌روزرسانی شد");
    } catch (e) {
      toast.error(`خطا: ${e instanceof Error ? e.message : "خطای ناشناخته"}`);
    } finally {
      setSaving((s) => ({ ...s, [userId]: false }));
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>;
  if (!has("admin", "manager")) return <AccessDenied />;

  return (
    <div>
      <PageHeader
        title="کاربران و سطوح دسترسی"
        description="هر کاربر یک نقش دارد. دسترسی صفحات و اطلاعات مالی بر همین اساس کنترل می‌شود."
      />

      <div className="surface-panel overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کاربر</TableHead>
              <TableHead>ایمیل</TableHead>
              <TableHead>نقش</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>تاریخ عضویت</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  در حال بارگذاری...
                </TableCell>
              </TableRow>
            ) : (
              (profiles.data ?? []).map((p) => {
                const isMe = p.id === user?.id;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.full_name ?? "—"}
                      {isMe ? (
                        <Badge variant="outline" className="ms-2 text-[10px]">
                          شما
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <span dir="ltr" className="inline-block">
                        {p.email ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <select
                          value={pending[p.id] ?? p.role}
                          onChange={(e) =>
                            setPending((s) => ({ ...s, [p.id]: e.target.value as Role }))
                          }
                          disabled={isMe || isDemo}
                          aria-label="انتخاب نقش"
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground disabled:opacity-60"
                        >
                          {ROLE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        {!isMe && !isDemo && (pending[p.id] ?? p.role) !== p.role ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            disabled={saving[p.id]}
                            onClick={() => saveRole(p.id, pending[p.id] ?? p.role)}
                          >
                            <Save className="size-3" />
                            {saving[p.id] ? "در حال ذخیره..." : "ذخیره"}
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.is_active ? "default" : "secondary"}>
                        {p.is_active ? "فعال" : "غیرفعال"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(p.created_at)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        اولین کاربری که ثبت‌نام کند به‌صورت خودکار مدیر سامانه می‌شود؛ کاربران بعدی با نقش «عملیات»
        ساخته می‌شوند و شما می‌توانید نقششان را از همین صفحه تغییر دهید. امکان تغییر نقش خودتان وجود
        ندارد.
      </p>
    </div>
  );
}
