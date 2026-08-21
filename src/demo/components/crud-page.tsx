import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { PageHeader } from "@/demo/components/app-shell";
import { Button } from "@/demo/components/ui/button";
import { Input } from "@/demo/components/ui/input";
import { Label } from "@/demo/components/ui/label";
import { Badge } from "@/demo/components/ui/badge";
import { Checkbox } from "@/demo/components/ui/checkbox";
import { Textarea } from "@/demo/components/ui/textarea";
import { Skeleton } from "@/demo/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/demo/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/demo/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/demo/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/demo/components/ui/table";
import { useDeleteRow, useTable, useUpsertRow, formatNumber } from "@/demo/lib/crm";
import { useAuth } from "@/demo/hooks/use-auth";
import { rowMatchesSearch } from "@/demo/lib/search";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  X,
} from "lucide-react";
import { JalaliDateField } from "@/demo/components/jalali-date-field";
import { PlaceholderChips } from "@/demo/components/placeholder-chips";
import { cn } from "@/demo/lib/utils";

function toLocalDateTimeValue(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 16);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type FieldDef = {
  name: string;
  label: string;
  type?:
    "text" | "number" | "textarea" | "select" | "date" | "email" | "datetime-local" | "checkbox";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  /** نمایش دکمه‌های متغیر شخصی‌سازی زیر textarea */
  placeholders?: boolean;
};

export type ColumnDef<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

export type FilterDef = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

type Row = Record<string, unknown> & { id: string };

const PAGE_SIZES = [10, 25, 50];

function FieldControl({ field, editing }: { field: FieldDef; editing: Row | null }) {
  const textRef = useRef<HTMLTextAreaElement>(null);

  if (field.type === "checkbox") {
    const checked = Boolean(editing?.[field.name]);
    return (
      <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
        <input
          id={field.name}
          name={field.name}
          type="checkbox"
          value="true"
          defaultChecked={checked}
          className="size-4 accent-primary"
        />
        <span className="text-foreground">{field.placeholder ?? field.label}</span>
      </label>
    );
  }
  if (field.type === "textarea") {
    return (
      <div className="space-y-2">
        <Textarea
          ref={textRef}
          id={field.name}
          name={field.name}
          defaultValue={(editing?.[field.name] as string) ?? ""}
          placeholder={
            field.placeholder ??
            (field.placeholders
              ? "مثال: سلام {full_name} عزیز، پیگیری شما برای {date} ثبت شد."
              : undefined)
          }
        />
        {field.placeholders ? (
          <PlaceholderChips
            onInsert={(token) => {
              const el = textRef.current;
              if (!el) return;
              const start = el.selectionStart ?? el.value.length;
              const end = el.selectionEnd ?? el.value.length;
              el.value = el.value.slice(0, start) + token + el.value.slice(end);
              const caret = start + token.length;
              el.focus();
              el.setSelectionRange(caret, caret);
            }}
          />
        ) : null}
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <select
        id={field.name}
        name={field.name}
        defaultValue={(editing?.[field.name] as string) ?? field.options?.[0]?.value}
        required={field.required}
        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "date" || field.type === "datetime-local") {
    const raw = (editing?.[field.name] as string) ?? "";
    const defaultValue = field.type === "date" ? raw.slice(0, 10) : toLocalDateTimeValue(raw);
    return (
      <JalaliDateField
        name={field.name}
        {...(field.required ? { required: true } : {})}
        withTime={field.type === "datetime-local"}
        defaultValue={defaultValue || null}
      />
    );
  }
  return (
    <Input
      id={field.name}
      name={field.name}
      type={field.type ?? "text"}
      required={field.required}
      placeholder={field.placeholder}
      dir={
        field.type === "email" || field.name === "phone" || field.name.includes("url")
          ? "ltr"
          : undefined
      }
      defaultValue={(editing?.[field.name] as string | number) ?? ""}
    />
  );
}

export function CrudPage<T extends Row>({
  table,
  title,
  description,
  addLabel,
  fields,
  columns,
  filters = [],
  searchKeys,
  emptyText = "هنوز رکوردی ثبت نشده است.",
  select,
  toolbarExtra,
  detailExtra,
  hideHeader = false,
  syncUrlQuery = false,
}: {
  table: string;
  title: string;
  description?: string;
  addLabel: string;
  fields: FieldDef[];
  columns: ColumnDef<T>[];
  filters?: FilterDef[];
  searchKeys?: string[];
  emptyText?: string;
  select?: string;
  toolbarExtra?: ReactNode;
  /** بخش تکمیلی برای اطلاعات وابسته به رکورد در پنل جزئیات */
  detailExtra?: (row: T) => ReactNode;
  /** When nested in tabs, hide the outer PageHeader */
  hideHeader?: boolean;
  /** همگام‌سازی با ?q= در آدرس (جستجوی سراسری) */
  syncUrlQuery?: boolean;
}) {
  const { data, isLoading, isError } = useTable<T>(table, select ? { select } : undefined);
  const upsert = useUpsertRow(table);
  const remove = useDeleteRow(table);
  const { isDemo } = useAuth();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [detail, setDetail] = useState<T | null>(null);
  const [confirm, setConfirm] = useState<string[] | null>(null);
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const urlSearch = useRouterState({ select: (s) => s.location.searchStr });
  useEffect(() => {
    if (!syncUrlQuery) return;
    const q = new URLSearchParams(urlSearch).get("q");
    if (q != null) {
      setQuery(q);
      setPage(0);
    }
  }, [urlSearch, syncUrlQuery]);

  const keys = searchKeys ?? columns.map((c) => c.key);

  const rows = useMemo(() => {
    let list = [...(data ?? [])];
    const q = query.trim();
    if (q) {
      list = list.filter((row) => rowMatchesSearch(row as Record<string, unknown>, keys, q));
    }
    for (const [key, value] of Object.entries(filterValues)) {
      if (value) list = list.filter((row) => String(row[key] ?? "") === value);
    }
    if (sort) {
      list.sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        if (typeof av === "number" && typeof bv === "number")
          return sort.dir === "asc" ? av - bv : bv - av;
        const cmp = String(av ?? "").localeCompare(String(bv ?? ""), "fa");
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [data, query, filterValues, sort, keys]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(current * pageSize, current * pageSize + pageSize);
  const allChecked = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = formData.get(field.name);
      if (field.type === "checkbox") {
        values[field.name] = raw === "true" || raw === "on";
        continue;
      }
      const value = typeof raw === "string" ? raw.trim() : "";
      if (field.type === "number") values[field.name] = value === "" ? 0 : Number(value);
      else if (field.type === "datetime-local" && value) {
        values[field.name] = new Date(value).toISOString();
      } else values[field.name] = value === "" ? null : value;
    }
    if (editing) values["id"] = editing.id;
    upsert.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        setEditing(null);
      },
    });
  }

  function toggleSort(key: string) {
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  }

  const addButton = (
    <div className="flex items-center gap-2">
      {toolbarExtra}
      {isDemo ? (
        <Badge variant="outline" className="h-9 px-3 text-xs">
          فقط مشاهده
        </Badge>
      ) : (
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              {addLabel}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "ویرایش" : addLabel}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={submit}>
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  {field.type === "checkbox" ? null : (
                    <Label htmlFor={field.name}>{field.label}</Label>
                  )}
                  <FieldControl field={field} editing={editing} />
                </div>
              ))}
              <Button type="submit" className="w-full" disabled={upsert.isPending}>
                ذخیره
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  return (
    <div>
      {hideHeader ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {addButton}
        </div>
      ) : (
        <PageHeader title={title} description={description} action={addButton} />
      )}

      <div className="surface-panel overflow-hidden" dir="rtl">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <div className="relative min-w-0 flex-1 basis-56">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="جستجو در نام، موبایل، ایمیل…"
              className={cn("ps-9", query ? "pe-9" : undefined)}
              aria-label="جستجو در فهرست"
            />
            {query ? (
              <button
                type="button"
                className="absolute end-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="پاک کردن جستجو"
                onClick={() => {
                  setQuery("");
                  setPage(0);
                }}
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
          {filters.map((f) => (
            <select
              key={f.key}
              value={filterValues[f.key] ?? ""}
              onChange={(e) => {
                setFilterValues((v) => ({ ...v, [f.key]: e.target.value }));
                setPage(0);
              }}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="">همه {f.label}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ))}
          <Badge variant="secondary" className="h-8 px-3">
            {formatNumber(rows.length)} رکورد
          </Badge>
          {!isDemo && selected.length > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => setConfirm(selected)}
            >
              <Trash2 className="size-4" />
              حذف {selected.length} مورد
            </Button>
          ) : null}
        </div>

        {isError ? (
          <div className="p-8 text-center text-sm text-destructive">
            بارگذاری فهرست با خطا مواجه شد. صفحه را تازه کنید.
          </div>
        ) : null}

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allChecked}
                    aria-label="انتخاب همه"
                    onCheckedChange={(v) =>
                      setSelected(
                        v
                          ? Array.from(new Set([...selected, ...pageRows.map((r) => r.id)]))
                          : selected.filter((id) => !pageRows.some((r) => r.id === id)),
                      )
                    }
                  />
                </TableHead>
                {columns.map((c) => (
                  <TableHead key={c.key}>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 hover:text-foreground"
                      onClick={() => toggleSort(c.key)}
                    >
                      <ArrowUpDown
                        className={
                          sort?.key === c.key
                            ? "size-3 text-primary"
                            : "size-3 text-muted-foreground/50"
                        }
                      />
                      {c.label}
                    </button>
                  </TableHead>
                ))}
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={columns.length + 2}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="py-12 text-center">
                    <Inbox className="mx-auto mb-3 size-8 text-muted-foreground/60" />
                    <p className="text-sm text-muted-foreground">
                      {rows.length === 0 && !query ? emptyText : "موردی با این فیلترها پیدا نشد."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer" onClick={() => setDetail(row)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.includes(row.id)}
                        aria-label="انتخاب ردیف"
                        onCheckedChange={(v) =>
                          setSelected((s) => (v ? [...s, row.id] : s.filter((id) => id !== row.id)))
                        }
                      />
                    </TableCell>
                    {columns.map((c) => (
                      <TableCell key={c.key}>
                        {c.render ? c.render(row) : ((row[c.key] as ReactNode) ?? "—")}
                      </TableCell>
                    ))}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {!isDemo ? (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="ویرایش"
                            onClick={() => {
                              setEditing(row);
                              setOpen(true);
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="حذف"
                            onClick={() => setConfirm([row.id])}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-2 p-3 md:hidden">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          ) : pageRows.length === 0 ? (
            <div className="py-10 text-center">
              <Inbox className="mx-auto mb-3 size-8 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                {rows.length === 0 && !query ? emptyText : "موردی با این فیلترها پیدا نشد."}
              </p>
            </div>
          ) : (
            pageRows.map((row) => (
              <div
                key={row.id}
                className="rounded-xl border border-border bg-card p-3 shadow-sm"
                onClick={() => setDetail(row)}
                onKeyDown={(e) => e.key === "Enter" && setDetail(row)}
                role="button"
                tabIndex={0}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(row.id)}
                      aria-label="انتخاب"
                      onCheckedChange={(v) =>
                        setSelected((s) => (v ? [...s, row.id] : s.filter((id) => id !== row.id)))
                      }
                    />
                  </div>
                  {!isDemo ? (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="ویرایش"
                        onClick={() => {
                          setEditing(row);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="حذف"
                        onClick={() => setConfirm([row.id])}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ) : null}
                </div>
                <dl className="space-y-1.5">
                  {columns.slice(0, 4).map((c) => (
                    <div key={c.key} className="flex items-start justify-between gap-3 text-sm">
                      <dt className="shrink-0 text-muted-foreground">{c.label}</dt>
                      <dd className="min-w-0 text-end text-foreground">
                        {c.render ? c.render(row) : ((row[c.key] as ReactNode) ?? "—")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>تعداد در صفحه:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="h-8 rounded-lg border border-input bg-background px-2 text-foreground"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
              aria-label="صفحه قبل"
            >
              <ChevronRight className="size-4" />
            </Button>
            <span>
              صفحه {current + 1} از {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={current >= pageCount - 1}
              onClick={() => setPage(current + 1)}
              aria-label="صفحه بعد"
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>جزئیات رکورد</SheetTitle>
          </SheetHeader>
          {detail ? (
            <div className="mt-4 space-y-3 px-4 pb-6">
              {columns.map((c) => (
                <div
                  key={c.key}
                  className="flex items-start justify-between gap-4 border-b border-border/60 pb-2"
                >
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  <span className="text-sm text-foreground">
                    {c.render ? c.render(detail) : ((detail[c.key] as ReactNode) ?? "—")}
                  </span>
                </div>
              ))}
              {(detail["notes"] as string) ? (
                <div className="rounded-xl bg-muted/50 p-3 text-sm leading-6 text-muted-foreground">
                  {detail["notes"] as string}
                </div>
              ) : null}
              {detailExtra ? detailExtra(detail) : null}
              {!isDemo ? (
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    setEditing(detail);
                    setDetail(null);
                    setOpen(true);
                  }}
                >
                  <Pencil className="size-4" />
                  ویرایش
                </Button>
              ) : null}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!confirm} onOpenChange={(v) => !v && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف انجام شود؟</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.length ?? 0} رکورد برای همیشه حذف می‌شود. این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirm?.forEach((id) => remove.mutate(id));
                setSelected([]);
                setConfirm(null);
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
