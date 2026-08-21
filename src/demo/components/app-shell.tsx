import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { logoutFn } from "@/demo/server/functions";
import { Button } from "@/demo/components/ui/button";
import { Badge } from "@/demo/components/ui/badge";
import { Input } from "@/demo/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/demo/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Megaphone,
  Workflow,
  Bot,
  MessagesSquare,
  Plug,
  Wand2,
  Settings,
  ShieldCheck,
  Handshake,
  Building2,
  UserRound,
  Share2,
  LogOut,
  Menu,
  CalendarCheck,
  BarChart3,
  Database,
  Sun,
  Moon,
  Search,
  X,
  PanelRightClose,
  PanelRightOpen,
  ChevronDown,
} from "lucide-react";
import { useEffect, useMemo, useState, useDeferredValue, type ReactNode } from "react";
import { cn } from "@/demo/lib/utils";
import { ROLE_LABELS, useAuth, type Role } from "@/demo/hooks/use-auth";
import { useTheme } from "@/demo/hooks/use-theme";
import { useTable } from "@/demo/lib/crm";
import { searchIncludes } from "@/demo/lib/search";
import { toPersianDigits } from "@/demo/lib/format";
import { BrandMark } from "@/demo/components/brand-mark";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; roles?: Role[] };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "اصلی",
    items: [
      { to: "/demo/dashboard", label: "داشبورد", icon: LayoutDashboard },
      { to: "/demo/clients", label: "سرنخ‌ها", icon: UserRound },
      { to: "/demo/contacts", label: "مخاطبین", icon: Users },
      { to: "/demo/companies", label: "شرکت‌ها", icon: Building2 },
      { to: "/demo/activities", label: "پیگیری‌ها", icon: CalendarCheck },
    ],
  },
  {
    title: "فروش و درآمد",
    items: [
      { to: "/demo/deals", label: "معاملات و قیف فروش", icon: Handshake },
      { to: "/demo/services", label: "خدمات و محصولات", icon: Receipt },
      {
        to: "/demo/invoices",
        label: "پیش‌فاکتور و پرداخت",
        icon: Receipt,
        roles: ["admin", "manager", "reception"],
      },
      {
        to: "/demo/campaigns",
        label: "کمپین‌های ارتباطی",
        icon: Megaphone,
        roles: ["admin", "manager", "marketing"],
      },
    ],
  },
  {
    title: "رشد و تحلیل",
    items: [
      {
        to: "/demo/affiliates",
        label: "همکاران فروش",
        icon: Share2,
        roles: ["admin", "manager", "marketing"],
      },
      {
        to: "/demo/reports",
        label: "گزارش‌ها",
        icon: BarChart3,
        roles: ["admin", "manager", "reception", "marketing"],
      },
    ],
  },
  {
    title: "هوشمندسازی",
    items: [
      { to: "/demo/automations", label: "اتوماسیون", icon: Workflow },
      { to: "/demo/agents", label: "ایجنت‌های AI", icon: Bot },
      { to: "/demo/ai-chat", label: "چت با داده‌ها", icon: MessagesSquare },
      {
        to: "/demo/integrations",
        label: "یکپارچه‌سازی‌ها",
        icon: Plug,
        roles: ["admin", "manager"],
      },
    ],
  },
  {
    title: "سیستم و تیم",
    items: [
      {
        to: "/demo/users",
        label: "کاربران و دسترسی‌ها",
        icon: ShieldCheck,
        roles: ["admin", "manager"],
      },
      { to: "/demo/wizard", label: "ویزارد راه‌اندازی", icon: Wand2, roles: ["admin", "manager"] },
      { to: "/demo/settings", label: "تنظیمات", icon: Settings },
    ],
  },
];

const RAIL_W = "4.25rem";
const DRAWER_W = "15rem";
const SIDEBAR_EXPANDED_KEY = "daalcrm-sidebar-expanded";
const NAV_OPEN_GROUPS_KEY = "daalcrm-nav-open-groups";

function readSidebarExpanded(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = window.localStorage.getItem(SIDEBAR_EXPANDED_KEY);
    if (v === "0") return false;
    if (v === "1") return true;
  } catch {
    /* ignore */
  }
  return true;
}

function readOpenGroups(groupTitles: string[], pathname: string): Record<string, boolean> {
  const activeTitle =
    NAV.find((g) => g.items.some((i) => pathname.startsWith(i.to)))?.title ?? groupTitles[0];
  let stored: Record<string, boolean> = {};
  try {
    stored = JSON.parse(window.localStorage.getItem(NAV_OPEN_GROUPS_KEY) || "{}") as Record<
      string,
      boolean
    >;
  } catch {
    stored = {};
  }
  const open: Record<string, boolean> = {};
  for (const title of groupTitles) {
    open[title] = stored[title] ?? (title === activeTitle || title === "اصلی");
  }
  if (activeTitle) open[activeTitle] = true;
  return open;
}

export function AppShell({
  children,
  databaseConfigured = true,
  demoMode = false,
}: {
  children: ReactNode;
  databaseConfigured?: boolean;
  demoMode?: boolean;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(readSidebarExpanded);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [searchEl, setSearchEl] = useState<HTMLInputElement | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const deferredQuery = useDeferredValue(query.trim());
  const { user, roles, has } = useAuth();
  const { data: orgRows } = useTable<{ id: string; org_name: string }>("org_settings", {
    select: "id, org_name",
  });
  const { data: contactRows } = useTable<{
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
  }>("contacts", { select: "id, full_name, phone, email" });
  const { data: invoiceRows } = useTable<{
    id: string;
    invoice_no: string | null;
    total: number;
    status: string;
  }>("invoices", { select: "id, invoice_no, total, status" });
  const orgName = orgRows?.[0]?.org_name?.trim() || "DaalCRM";

  const groups = useMemo(
    () =>
      NAV.map((g) => ({
        ...g,
        items: g.items.filter((i) => !databaseConfigured || !i.roles || has(...i.roles)),
      })).filter((g) => g.items.length > 0),
    [databaseConfigured, has],
  );

  const flatItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const activeLabel = flatItems.find((n) => pathname.startsWith(n.to))?.label ?? "داشبورد";

  const navHits = useMemo(() => {
    if (deferredQuery.length < 1) return [];
    return flatItems.filter((i) => searchIncludes(i.label, deferredQuery)).slice(0, 6);
  }, [deferredQuery, flatItems]);

  const contactHits = useMemo(() => {
    if (deferredQuery.length < 1) return [];
    return (contactRows ?? [])
      .filter(
        (c) =>
          searchIncludes(c.full_name, deferredQuery) ||
          searchIncludes(c.phone, deferredQuery) ||
          searchIncludes(c.email, deferredQuery),
      )
      .slice(0, 8);
  }, [contactRows, deferredQuery]);

  const invoiceHits = useMemo(() => {
    if (deferredQuery.length < 1) return [];
    return (invoiceRows ?? [])
      .filter((inv) => searchIncludes(inv.invoice_no, deferredQuery))
      .slice(0, 5);
  }, [invoiceRows, deferredQuery]);

  const hasSearchResults =
    deferredQuery.length > 0 &&
    (navHits.length > 0 || contactHits.length > 0 || invoiceHits.length > 0);
  const showSearchPanel = searchOpen && deferredQuery.length > 0;

  useEffect(() => {
    setOpenGroups(
      readOpenGroups(
        groups.map((g) => g.title),
        pathname,
      ),
    );
    // init once groups settle; pathname handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups.map((g) => g.title).join("|")]);

  useEffect(() => {
    const activeTitle = groups.find((g) => g.items.some((i) => pathname.startsWith(i.to)))?.title;
    if (!activeTitle) return;
    setOpenGroups((prev) => {
      if (prev[activeTitle]) return prev;
      return { ...prev, [activeTitle]: true };
    });
  }, [pathname, groups]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_EXPANDED_KEY, expanded ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [expanded]);

  useEffect(() => {
    try {
      window.localStorage.setItem(NAV_OPEN_GROUPS_KEY, JSON.stringify(openGroups));
    } catch {
      /* ignore */
    }
  }, [openGroups]);

  function toggleGroup(title: string) {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchEl?.focus();
        searchEl?.select();
        setSearchOpen(true);
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchEl]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await logoutFn();
    navigate({ to: "/demo", replace: true });
  }

  function closeSearch() {
    setSearchOpen(false);
  }

  function goClientsSearch(q: string) {
    navigate({ to: "/demo/clients", search: { q } });
    setQuery("");
    closeSearch();
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (contactHits[0]) {
      goClientsSearch(contactHits[0].full_name);
      return;
    }
    if (invoiceHits[0]) {
      navigate({ to: "/demo/invoices", search: { payment: undefined } });
      setQuery("");
      closeSearch();
      return;
    }
    if (navHits[0]) {
      navigate({ to: navHits[0].to });
      setQuery("");
      closeSearch();
      return;
    }
    goClientsSearch(q);
  }

  const asideWidth = expanded ? DRAWER_W : RAIL_W;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background" data-demo-mode={demoMode ? "true" : undefined}>
        {mobileOpen ? (
          <button
            type="button"
            aria-label="بستن منو"
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[1px] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        {/* Desktop icon rail / expandable */}
        <aside
          className="fixed inset-y-0 right-0 z-40 hidden min-h-0 flex-col overflow-hidden border-l border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out lg:flex"
          style={{ width: asideWidth }}
          aria-label="منوی اصلی"
        >
          <div
            className={cn(
              "flex h-14 shrink-0 items-center border-b border-sidebar-border",
              expanded ? "justify-between gap-2 px-3" : "justify-center px-2",
            )}
          >
            <div className={cn("flex min-w-0 items-center gap-2.5", !expanded && "justify-center")}>
              <BrandMark
                className="size-9 rounded-xl shadow-none"
                markClassName="size-4"
                decorative
              />
              {expanded ? (
                <div className="min-w-0">
                  <p className="brand-mark truncate text-sm text-sidebar-foreground">DaalCRM</p>
                  <p className="truncate text-[11px] text-muted-foreground">{orgName}</p>
                </div>
              ) : null}
            </div>
            {expanded ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground"
                onClick={() => setExpanded(false)}
                aria-label="جمع کردن منو"
              >
                <PanelRightClose className="size-4" />
              </Button>
            ) : null}
          </div>

          <nav className="sidebar-nav min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-2 py-3">
            {groups.map((group) => {
              const isOpen = !expanded || openGroups[group.title] !== false;
              return (
                <div key={group.title}>
                  {expanded ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.title)}
                      className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-expanded={isOpen}
                    >
                      <span>{group.title}</span>
                      <ChevronDown
                        className={cn(
                          "size-3.5 shrink-0 transition-transform duration-150",
                          isOpen ? "rotate-0" : "-rotate-90",
                        )}
                      />
                    </button>
                  ) : null}
                  {isOpen ? (
                    <div className="flex flex-col gap-0.5">
                      {group.items.map((item) => {
                        const active = pathname.startsWith(item.to);
                        const Icon = item.icon;
                        const link = (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={cn(
                              "flex items-center rounded-lg text-[13px] transition-colors duration-150",
                              expanded ? "gap-2.5 px-2.5 py-2" : "justify-center px-0 py-2.5",
                              active
                                ? "bg-primary/10 font-semibold text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                            aria-label={item.label}
                            aria-current={active ? "page" : undefined}
                          >
                            <Icon className="size-[1.1rem] shrink-0" />
                            {expanded ? <span className="truncate">{item.label}</span> : null}
                          </Link>
                        );
                        if (expanded) return link;
                        return (
                          <Tooltip key={item.to}>
                            <TooltipTrigger asChild>{link}</TooltipTrigger>
                            <TooltipContent side="left">{item.label}</TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="shrink-0 space-y-1 border-t border-sidebar-border p-2">
            {!expanded ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full text-muted-foreground"
                    onClick={() => setExpanded(true)}
                    aria-label="باز کردن منو"
                  >
                    <PanelRightOpen className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">باز کردن منو</TooltipContent>
              </Tooltip>
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={expanded ? "default" : "icon"}
                  className={cn("w-full text-muted-foreground", expanded && "justify-start gap-2")}
                  onClick={signOut}
                  aria-label={databaseConfigured ? "خروج از حساب" : "اتصال پایگاه‌داده"}
                >
                  {databaseConfigured ? (
                    <LogOut className="size-4" />
                  ) : (
                    <Database className="size-4" />
                  )}
                  {expanded ? (databaseConfigured ? "خروج" : "اتصال دیتابیس") : null}
                </Button>
              </TooltipTrigger>
              {!expanded ? (
                <TooltipContent side="left">
                  {databaseConfigured ? "خروج از حساب" : "اتصال پایگاه‌داده"}
                </TooltipContent>
              ) : null}
            </Tooltip>
          </div>
        </aside>

        {/* Mobile drawer */}
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-40 flex w-[15rem] min-h-0 flex-col overflow-hidden border-l border-sidebar-border bg-sidebar transition-transform duration-200 ease-out lg:hidden",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <BrandMark
                className="size-9 rounded-xl shadow-none"
                markClassName="size-4"
                decorative
              />
              <div className="min-w-0">
                <p className="brand-mark truncate text-sm">DaalCRM</p>
                <p className="truncate text-[11px] text-muted-foreground">{orgName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              aria-label="بستن"
            >
              <X className="size-4" />
            </Button>
          </div>
          <nav
            className="sidebar-nav min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-3"
            aria-label="منوی موبایل"
          >
            {groups.map((group) => {
              const isOpen = openGroups[group.title] !== false;
              return (
                <div key={group.title}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.title)}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-expanded={isOpen}
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 shrink-0 transition-transform duration-150",
                        isOpen ? "rotate-0" : "-rotate-90",
                      )}
                    />
                  </button>
                  {isOpen ? (
                    <div className="flex flex-col gap-0.5">
                      {group.items.map((item) => {
                        const active = pathname.startsWith(item.to);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={cn(
                              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                              active
                                ? "bg-primary/10 font-semibold text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            <Icon className="size-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
          <div className="shrink-0 border-t border-sidebar-border p-3">
            <div className="mb-2 rounded-xl border border-border bg-card px-3 py-2">
              <p className="truncate text-xs font-medium">
                {databaseConfigured ? user?.full_name || user?.email || "—" : "دیتابیس متصل نیست"}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {databaseConfigured ? (
                  roles.map((r) => (
                    <Badge key={r} variant="secondary" className="rounded-md text-[10px]">
                      {ROLE_LABELS[r]}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="rounded-md text-[10px]">
                    حالت راه‌اندازی
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={signOut}>
              {databaseConfigured ? <LogOut className="size-4" /> : <Database className="size-4" />}
              {databaseConfigured ? "خروج از حساب" : "اتصال پایگاه‌داده"}
            </Button>
          </div>
        </aside>

        <div
          className={cn(
            "min-h-screen transition-[margin] duration-200 ease-out",
            expanded ? "lg:mr-[15rem]" : "lg:mr-[4.25rem]",
          )}
        >
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="منو"
              aria-expanded={mobileOpen}
            >
              <Menu className="size-5" />
            </Button>

            <div className="min-w-0 shrink-0">
              <p className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                {activeLabel}
              </p>
              <p className="truncate text-[11px] text-muted-foreground sm:hidden">{orgName}</p>
            </div>

            <form
              onSubmit={submitSearch}
              className="relative mx-auto hidden min-w-0 max-w-[28rem] flex-1 md:block"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeSearch();
              }}
            >
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={setSearchEl}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="جستجو در سرنخ‌ها، شرکت‌ها و فاکتورها"
                className="h-9 rounded-lg border-border bg-card pe-14 ps-10 text-[13px] shadow-none"
                aria-label="جستجوی سراسری"
                aria-expanded={showSearchPanel}
                autoComplete="off"
              />
              <kbd className="pointer-events-none absolute end-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                ⌘K
              </kbd>
              {showSearchPanel ? (
                <ul className="absolute inset-x-0 top-[calc(100%+0.35rem)] z-50 max-h-[24rem] overflow-y-auto rounded-xl border border-border bg-card shadow-soft">
                  {contactHits.length > 0 ? (
                    <>
                      <li className="sticky top-0 border-b border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground">
                        مخاطبین
                      </li>
                      {contactHits.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            className="flex w-full flex-col items-stretch gap-0.5 px-3 py-2 text-start text-sm hover:bg-accent"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => goClientsSearch(c.full_name)}
                          >
                            <span className="font-medium text-foreground">{c.full_name}</span>
                            {c.phone ? (
                              <span
                                dir="ltr"
                                className="text-[11px] text-muted-foreground tabular-nums"
                              >
                                {toPersianDigits(c.phone)}
                              </span>
                            ) : null}
                          </button>
                        </li>
                      ))}
                    </>
                  ) : null}
                  {invoiceHits.length > 0 ? (
                    <>
                      <li className="sticky top-0 border-b border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground">
                        فاکتورها
                      </li>
                      {invoiceHits.map((inv) => (
                        <li key={inv.id}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              navigate({ to: "/demo/invoices", search: { payment: undefined } });
                              setQuery("");
                              closeSearch();
                            }}
                          >
                            <Receipt className="size-4 text-primary" />
                            <span dir="ltr">{inv.invoice_no ?? "—"}</span>
                          </button>
                        </li>
                      ))}
                    </>
                  ) : null}
                  {navHits.length > 0 ? (
                    <>
                      <li className="sticky top-0 border-b border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground">
                        بخش‌ها
                      </li>
                      {navHits.map((hit) => (
                        <li key={hit.to}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              navigate({ to: hit.to });
                              setQuery("");
                              closeSearch();
                            }}
                          >
                            <hit.icon className="size-4 text-primary" />
                            {hit.label}
                          </button>
                        </li>
                      ))}
                    </>
                  ) : null}
                  {!hasSearchResults ? (
                    <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                      نتیجه‌ای پیدا نشد — Enter برای جستجو در مخاطبین
                    </li>
                  ) : (
                    <li>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => goClientsSearch(query.trim())}
                      >
                        <Users className="size-4" />
                        جستجو در فهرست مخاطبین
                      </button>
                    </li>
                  )}
                </ul>
              ) : null}
            </form>

            <div className="ms-auto flex items-center gap-2">
              <div className="hidden text-end xl:block">
                <p className="max-w-[9rem] truncate text-xs font-medium text-foreground">
                  {orgName}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {roles.map((r) => ROLE_LABELS[r]).join(" · ") || "—"}
                </p>
              </div>
              <ThemeToggle />
            </div>
          </header>
          <main className="p-4 md:p-5 lg:p-8">
            {demoMode ? (
              <div className="mb-6 flex flex-col gap-3 border border-amber-400/40 bg-amber-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">محیط نمایشی CRM</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      این همان فضای واقعی CRM است، اما با داده‌های نمونه و در حالت فقط مشاهده اجرا
                      می‌شود؛ هیچ ثبت، حذف، پیام یا اتصال واقعی انجام نمی‌شود.
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="shrink-0" onClick={signOut}>
                  خروج از دمو
                </Button>
              </div>
            ) : null}
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "تغییر به تم روشن" : "تغییر به تم تیره"}
      title={theme === "dark" ? "تم روشن" : "تم تیره"}
      className="text-muted-foreground hover:text-foreground"
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string | undefined;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-display text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 pt-0.5">{action}</div>
      ) : null}
    </div>
  );
}

export function AccessDenied() {
  return (
    <div className="surface-panel p-10 text-center">
      <ShieldCheck className="mx-auto mb-3 size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        شما به این بخش دسترسی ندارید. در صورت نیاز از مدیر سامانه درخواست دسترسی کنید.
      </p>
    </div>
  );
}
