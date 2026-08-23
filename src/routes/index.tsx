import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { formatTomanCompact } from "@/lib/format";
import {
  canonicalLinks,
  DEMO_FAQ_ITEMS,
  getDemoStructuredData,
  OFFICIAL_DAAL_URL,
  publicSocialMeta,
} from "@/lib/seo";
import { CRM_URL } from "@/lib/site";
import {
  ArrowLeft,
  ArrowUpLeft,
  BarChart3,
  Bot,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Calculator,
  ClipboardCheck,
  CreditCard,
  FileText,
  ListTodo,
  Mail,
  MessageSquare,
  PanelLeft,
  Plug,
  ReceiptText,
  Search,
  Settings2,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سامانه مدیریت مشتریان دال | CRM فارسی برای فروش" },
      {
        name: "description",
        content:
          "سامانه مدیریت مشتریان دال برای مدیریت سرنخ، معاملات، پیگیری، اتوماسیون، تحلیل فروش، پیش‌فاکتور، پرداخت و گزارش؛ با لایسنس ماهانه یا خرید دائمی، دال را روی سرور خودتان مستقر کنید.",
      },
      ...publicSocialMeta({
        title: "سامانه مدیریت مشتریان دال | CRM فارسی برای فروش",
        description:
          "سرنخ‌ها، معاملات، پیگیری‌ها و پرداخت‌ها را با اتوماسیون و تحلیل هوشمند در یک جریان فروش روشن مدیریت کنید؛ ماهانه یا با خرید دائمی.",
        pathname: "/",
      }),
    ],
    links: canonicalLinks("/"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(getDemoStructuredData("/")) },
    ],
  }),
  component: DemoPage,
});

type FeatureId = "leads" | "pipeline" | "followups" | "billing" | "intelligence";

type Feature = {
  id: FeatureId;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  bullets: string[];
  icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    id: "leads",
    number: "۰۱",
    eyebrow: "سرنخ، مخاطب و شرکت",
    title: "پروندهٔ هر مشتری را از اولین تماس بسازید.",
    summary:
      "منبع سرنخ، مشخصات مخاطب، شرکت و سابقهٔ تعامل‌ها در یک پروندهٔ مرتبط می‌ماند تا هیچ تماس و فرصتی گم نشود.",
    bullets: [
      "ثبت سرنخ با منبع و وضعیت",
      "ارتباط مخاطب و شرکت با معامله‌ها",
      "جست‌وجو و فیلتر در پرونده‌ها",
    ],
    icon: Users,
  },
  {
    id: "pipeline",
    number: "۰۲",
    eyebrow: "معامله و سفارش",
    title: "هر فرصت فروش را تا قرارداد و سفارش جلو ببرید.",
    summary:
      "معامله‌ها در قیف فروش، با مبلغ، احتمال موفقیت، تاریخ بستن و مسئول فروش ثبت می‌شوند؛ از سرنخ تا سفارش یک مسیر دارید.",
    bullets: [
      "نمای کانبان برای مراحل فروش",
      "مبلغ، احتمال و تاریخ بستن",
      "فروشنده و مسئول هر معامله",
    ],
    icon: Target,
  },
  {
    id: "followups",
    number: "۰۳",
    eyebrow: "پیگیری و اتوماسیون",
    title: "پیگیری فروش را به یک گردش‌کار خودکار تبدیل کنید.",
    summary:
      "با ثبت سرنخ، تغییر مرحله معامله، برد فروش، سررسید پیگیری یا زمان‌بندی، کار بعدی را خودکار بسازید، پیام بفرستید، وب‌هوک فراخوانی کنید یا خلاصهٔ هوشمند ثبت کنید.",
    bullets: [
      "تریگر رویدادی و زمان‌بندی‌شده",
      "ساخت وظیفه، ارسال پیامک و ایمیل",
      "وب‌هوک و خلاصه‌سازی AI در پرونده مشتری",
    ],
    icon: Workflow,
  },
  {
    id: "billing",
    number: "۰۴",
    eyebrow: "فاکتور، پرداخت و دریافت",
    title: "بدانید چه فروشی صادر شده و چه مبلغی مانده است.",
    summary:
      "فاکتور به سفارش و فروشنده وصل است؛ پرداخت دستی یا آنلاین زرین‌پال در همان مسیر ثبت می‌شود و ماندهٔ دریافتنی روشن می‌ماند.",
    bullets: [
      "فاکتور متصل به سفارش و فروشنده",
      "ثبت پرداخت و پیگیری مانده",
      "زرین‌پال و همگام‌سازی حسابفا",
    ],
    icon: CircleDollarSign,
  },
  {
    id: "intelligence",
    number: "۰۵",
    eyebrow: "هوش مصنوعی و تحلیل فروش",
    title: "از داده‌های CRM، تحلیل‌گر و دستیار تخصصی بسازید.",
    summary:
      "وضعیت فروش، قیف، وصول و معاملات پرریسک را تحلیل کنید؛ با داده‌های CRM گفتگو کنید و برای فروش، پشتیبانی یا تحلیل، ایجنتی با نقش، مدل و دستور اختصاصی تعریف کنید.",
    bullets: [
      "گزارش قیف، عملکرد فروشنده و مطالبات",
      "پرسش فارسی و پیشنهاد اقدام بعدی",
      "ایجنت تخصصی با نقش، مدل و دستور اختصاصی",
    ],
    icon: Bot,
  },
];

const DEMO_DEALS = [
  {
    title: "راه‌اندازی مرکز تماس",
    company: "پیشگامان شرق",
    amount: 336_000_000,
    stage: "پیشنهاد",
    probability: 60,
  },
  {
    title: "پیاده‌سازی سامانه فروش",
    company: "راهکار نو",
    amount: 148_000_000,
    stage: "مذاکره",
    probability: 75,
  },
  {
    title: "اتوماسیون پیگیری مشتریان",
    company: "ابرنگار",
    amount: 76_800_000,
    stage: "ارزیابی اولیه",
    probability: 35,
  },
];

const DEMO_ACTIVITIES = [
  { title: "تماس با سارا محمدی", meta: "راهکار نو · امروز، ۱۰:۳۰" },
  { title: "ارسال پیشنهاد استقرار", meta: "پیشگامان شرق · امروز، ۱۴:۰۰" },
  { title: "جلسه کشف نیاز", meta: "ابرنگار · فردا، ۰۹:۰۰" },
];

function DemoPage() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>("pipeline");
  const selectedFeature = FEATURES.find((feature) => feature.id === activeFeature) ?? FEATURES[1]!;

  return (
    <div className="min-h-svh overflow-hidden bg-[#f5f3ee] text-[#172033] dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-[#dfe2e6] bg-[#f5f3ee]/95 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <BrandMark
                className="size-9 rounded-xl p-1"
                markClassName="rounded-lg text-xs"
                decorative
              />
              <span className="brand-mark text-base tracking-tight">DaalCRM</span>
              <span className="hidden border-s border-[#c9cdd3] ps-3 text-[11px] text-slate-500 sm:inline">
                سامانه مدیریت مشتریان دال
              </span>
            </Link>
            <a
              href={OFFICIAL_DAAL_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden border-s border-[#c9cdd3] ps-3 text-[11px] text-slate-500 underline-offset-4 hover:text-slate-950 hover:underline lg:inline-flex dark:hover:text-white"
            >
              محصول گروه فناوری دال · daalgp.com
            </a>
          </div>
          <nav
            className="hidden items-center gap-7 text-xs text-slate-500 md:flex"
            aria-label="ناوبری عمومی"
          >
            <a
              href="#features"
              className="transition-colors hover:text-slate-950 dark:hover:text-white"
            >
              قابلیت‌ها
            </a>
            <a
              href="#workflow"
              className="transition-colors hover:text-slate-950 dark:hover:text-white"
            >
              مسیر فروش
            </a>
            <a
              href="#setup"
              className="transition-colors hover:text-slate-950 dark:hover:text-white"
            >
              خرید و استقرار
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-slate-950 dark:hover:text-white"
            >
              قیمت
            </a>
            <a href="#faq" className="transition-colors hover:text-slate-950 dark:hover:text-white">
              سؤالات متداول
            </a>
            <a href="/demo" className="font-semibold text-blue-600 hover:text-blue-700">
              دریافت دسترسی دمو
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" className="hidden gap-1.5 rounded-lg sm:inline-flex">
              <a href="/demo">
                دریافت دسترسی دمو <ArrowUpLeft className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-[#dfe2e6] bg-[#f5f3ee] dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:py-24">
            <div className="order-1 max-w-xl lg:order-1">
              <h1 className="max-w-lg text-4xl font-black leading-[1.22] tracking-tight text-[#101827] dark:text-white sm:text-5xl">
                از اولین سرنخ تا دریافت وجه، فروش را یک‌جا دنبال کنید.
              </h1>
              <p className="mt-6 max-w-md text-base leading-8 text-slate-600 dark:text-slate-300">
                DaalCRM سرنخ، مخاطب، معامله، پیگیری، فاکتور و پرداخت را به هم وصل می‌کند تا تیم فروش
                بداند هر مشتری در چه مرحله‌ای است و قدم بعدی چیست.
              </p>
              <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">
                محصول گروه فناوری دال ·{" "}
                <a
                  href={OFFICIAL_DAAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-700 underline underline-offset-4 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-300"
                >
                  daalgp.com
                </a>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 rounded-lg px-5">
                  <a href="#features">
                    قابلیت‌های واقعی سامانه <ArrowLeft className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-[#cbd1da] bg-transparent px-5"
                >
                  <a href="/demo">دریافت دسترسی دمو</a>
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" /> محیط واقعی با دادهٔ نمونه
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldDot /> نصب روی سرور سازمان شما
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
                  <CircleDollarSign className="size-3.5" /> لایسنس ماهانه یا دائمی
                </span>
              </div>
            </div>
            <div className="order-2 lg:order-2">
              <HeroProductSurface />
            </div>
          </div>
        </section>

        <section className="border-b border-[#dfe2e6] bg-white dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-7 gap-y-3 px-5 py-5 sm:px-8">
            <Capability icon={Users} label="سرنخ و پرونده مشتری" />
            <Capability icon={Target} label="قیف و معاملات" />
            <Capability icon={CalendarCheck} label="پیگیری و خودکارسازی" />
            <Capability icon={ReceiptText} label="پیش‌فاکتور و پرداخت" />
            <Capability icon={Bot} label="هوش مصنوعی و تحلیل فروش" />
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-20 bg-white py-16 dark:bg-slate-900/40 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                ابزارهای فروش دال
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
                همهٔ اطلاعات فروش، از ثبت سرنخ تا دریافت، در یک مسیر مشخص.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-8 text-slate-500 dark:text-slate-400">
                دال فقط فهرست مخاطب نیست؛ رابطهٔ مشتری، سفارش، فروشنده، پیگیری، فاکتور و پرداخت را
                کنار هم نگه می‌دارد.
              </p>
            </div>

            <div className="mt-12 grid border-y border-[#dfe2e6] lg:grid-cols-[0.72fr_1.28fr] dark:border-slate-800">
              <div className="divide-y divide-[#dfe2e6] dark:divide-slate-800">
                {FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  const selected = activeFeature === feature.id;
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => setActiveFeature(feature.id)}
                      className={`group flex w-full items-start gap-4 px-4 py-5 text-right transition-colors sm:px-6 ${
                        selected
                          ? "bg-[#eef3ff] text-[#162b5b] dark:bg-blue-950/50 dark:text-blue-100"
                          : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                      aria-pressed={selected}
                    >
                      <span
                        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center ${selected ? "text-blue-600" : "text-slate-400"}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold">{feature.eyebrow}</span>
                          <span className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                            {feature.number}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs leading-6 text-slate-500 dark:text-slate-400">
                          {feature.title}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-[#dfe2e6] p-5 sm:p-8 lg:border-s lg:border-t-0 lg:rtl:border-s-0 lg:rtl:border-e dark:border-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-300">
                      {selectedFeature.eyebrow}
                    </p>
                    <h3 className="mt-3 max-w-lg text-2xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-3xl">
                      {selectedFeature.title}
                    </h3>
                  </div>
                  <span className="hidden border border-blue-200 bg-blue-50 p-2 text-blue-700 sm:block dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
                    <selectedFeature.icon className="size-5" />
                  </span>
                </div>
                <p className="mt-5 max-w-xl text-sm leading-8 text-slate-500 dark:text-slate-400">
                  {selectedFeature.summary}
                </p>
                <ul className="mt-6 grid gap-3 text-xs text-slate-700 sm:grid-cols-3 dark:text-slate-200">
                  {selectedFeature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 leading-6">
                      <Check className="mt-1 size-3.5 shrink-0 text-emerald-600" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <FeaturePreview id={activeFeature} />
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="scroll-mt-20 bg-[#14213d] py-16 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-10 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                  جریان کاری فروش
                </p>
                <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  فروش وقتی جلو می‌رود که قدم بعدی روشن باشد.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-slate-300">
                در DaalCRM مسیر فروش از یک فرم ورودی شروع می‌شود و تا فاکتور، پرداخت و گزارش ادامه
                پیدا می‌کند.
              </p>
            </div>
            <div className="grid divide-y divide-white/15 pt-2 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:rtl:divide-x-reverse">
              <WorkflowStep
                number="۰۱"
                icon={Users}
                title="ورود سرنخ"
                text="منبع و مشخصات اولیه را ثبت کنید."
              />
              <WorkflowStep
                number="۰۲"
                icon={Target}
                title="حرکت معامله"
                text="مرحله، مبلغ و احتمال موفقیت را ببینید."
              />
              <WorkflowStep
                number="۰۳"
                icon={ClipboardCheck}
                title="پیگیری تیم"
                text="اقدام بعدی را به مسئول و زمان مشخص بسپارید."
              />
              <WorkflowStep
                number="۰۴"
                icon={CircleDollarSign}
                title="نتیجه فروش"
                text="پیش‌فاکتور، پرداخت و گزارش را دنبال کنید."
              />
            </div>
          </div>
        </section>

        <AudienceSection />
        <DeploymentSection />
        <PricingSection />
        <FaqSection />

        <section className="border-b border-[#dfe2e6] bg-[#f5f3ee] px-5 py-16 dark:border-slate-800 dark:bg-slate-950 sm:px-8 sm:py-24">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                مشاهده و خرید
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
                اول ببینید؛ بعد درباره استقرار تصمیم بگیرید.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-slate-500 dark:text-slate-400">
                فرم کوتاه را پر کنید و وارد همان محیط واقعی CRM شوید. بعد از دیدن قابلیت‌ها، درباره
                لایسنس، نصب و شروع کار با تیم ما صحبت کنید.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 gap-2 rounded-lg px-5">
              <a href="/demo">
                دریافت دسترسی دمو <ArrowUpLeft className="size-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-[#f5f3ee] px-5 pb-8 text-xs text-slate-500 dark:bg-slate-950 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-[#dfe2e6] pt-5 dark:border-slate-800">
          <span>سامانه مدیریت مشتریان دال · محصول گروه فناوری دال</span>
          <div className="flex items-center gap-4">
            <a
              href={OFFICIAL_DAAL_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-950 dark:hover:text-white"
            >
              daalgp.com
            </a>
            <a href={`${CRM_URL}/auth`} className="hover:text-slate-950 dark:hover:text-white">
              ورود به پنل
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AudienceSection() {
  return (
    <section
      id="for-whom"
      className="scroll-mt-20 border-b border-[#dfe2e6] bg-white py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
            تیم فروش باید همیشه بداند هر مشتری در چه مرحله‌ای است.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            دال به تیم فروش کمک می‌کند وضعیت هر مشتری، معامله و پیگیری را در یک نمای روشن ببیند و
            کار بعدی را به‌موقع انجام دهد.
          </p>
        </div>
        <div className="mt-12 grid divide-y border-y border-[#dfe2e6] dark:divide-slate-800 dark:border-slate-800 md:grid-cols-3 md:divide-x md:divide-y-0 md:rtl:divide-x-reverse">
          <AudienceItem
            number="۰۱"
            title="تیم‌های فروش B2B"
            text="سرنخ‌ها، تصمیم‌گیرندگان، آخرین تماس و قدم بعدی هر معامله را یک‌جا ببینید."
          />
          <AudienceItem
            number="۰۲"
            title="شرکت‌های خدماتی و پروژه‌ای"
            text="از کشف نیاز تا پیشنهاد، قرارداد، پیش‌فاکتور و پرداخت، روند فروش را ثبت کنید."
          />
          <AudienceItem
            number="۰۳"
            title="سازمان‌های حساس به داده"
            text="دال را روی سرور خودتان نصب کنید و دسترسی، داده و اتصال‌های سازمان را خودتان کنترل کنید."
          />
        </div>
      </div>
    </section>
  );
}

function AudienceItem({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="py-6 md:px-7 md:py-7 md:first:ps-0 md:last:pe-0">
      <p className="text-xs font-bold text-blue-600 dark:text-blue-300">{number}</p>
      <h3 className="mt-5 text-base font-bold text-[#101827] dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{text}</p>
    </article>
  );
}

function DeploymentSection() {
  return (
    <section
      id="setup"
      className="scroll-mt-20 border-b border-[#dfe2e6] bg-[#f5f3ee] py-16 dark:border-slate-800 dark:bg-slate-950 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
            خرید و استقرار
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
            دال روی سرور شما اجرا می‌شود؛ اطلاعات مشتری نزد خودتان می‌ماند.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            لایسنس ماهانه یا دائمی را انتخاب می‌کنید، نرم‌افزار روی زیرساخت شما نصب می‌شود و
            راه‌اندازی اولیه را همراه تیم‌تان پیش می‌بریم.
          </p>
        </div>
        <div className="mt-12 grid divide-y border-y border-[#dfe2e6] dark:divide-slate-800 dark:border-slate-800 md:grid-cols-4 md:divide-x md:divide-y-0 md:rtl:divide-x-reverse">
          <DeploymentItem
            number="۰۱"
            title="بررسی قبل از خرید"
            text="تعداد کاربران، مسیر فروش و اتصال‌های موردنیاز را قبل از تصمیم‌گیری مرور می‌کنیم."
          />
          <DeploymentItem
            number="۰۲"
            title="نصب و تنظیم اولیه"
            text="پس از خرید، نصب و تنظیمات اولیه روی سرور سازمان شما بدون هزینه جداگانه انجام می‌شود."
          />
          <DeploymentItem
            number="۰۳"
            title="داده در زیرساخت شما"
            text="اطلاعات مشتری در سرور سازمان شما می‌ماند و سیاست دسترسی را خودتان تعیین می‌کنید."
          />
          <DeploymentItem
            number="۰۴"
            title="همراهی شروع کار"
            text="خرید دائمی شامل سه ماه پشتیبانی پس از استقرار است؛ سطح پشتیبانی پلن‌های ماهانه هم شفاف مشخص شده است."
          />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild className="gap-2 rounded-lg">
            <a href="/demo">
              دریافت دسترسی دمو <ArrowUpLeft className="size-4" />
            </a>
          </Button>
          <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
            اول دمو را ببینید؛ بعد درباره خرید، نصب و شروع کار تصمیم بگیرید.
          </p>
        </div>
      </div>
    </section>
  );
}

function DeploymentItem({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="py-6 md:px-6 md:py-7 md:first:ps-0 md:last:pe-0">
      <p className="text-xs font-bold text-blue-600 dark:text-blue-300">{number}</p>
      <h3 className="mt-5 text-base font-bold text-[#101827] dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{text}</p>
    </article>
  );
}

const MIN_LICENSE_USERS = 5;
const MONTHLY_START_PRICE_PER_USER = 720_000;
const MONTHLY_START_PRICE_AT_MIN_USERS = MONTHLY_START_PRICE_PER_USER * MIN_LICENSE_USERS;
const GROWTH_REFERENCE_USERS = 15;
const MAX_MONTHLY_USERS = 50;
const MONTHLY_GROWTH_PRICE_PER_USER = 1_100_000;
const MONTHLY_GROWTH_PRICE_AT_REFERENCE_USERS =
  MONTHLY_GROWTH_PRICE_PER_USER * GROWTH_REFERENCE_USERS;
const LIFETIME_LICENSE_PRICE = 249_000_000;
const millionFormatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 5 });
const integerFormatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });

function formatMillionToman(value: number): string {
  return `${millionFormatter.format(value / 1_000_000)} میلیون`;
}

function formatUserCount(value: number): string {
  return integerFormatter.format(value);
}

function formatPerUser(value: number): string {
  return `معادل ${integerFormatter.format(Math.round(value))} تومان برای هر کاربر`;
}

type PricingPlan = {
  name: string;
  eyebrow: string;
  price: string;
  priceUnit: string;
  priceUnitForUsers?: (users: number) => string;
  priceLabel: string;
  perUser: string;
  users: string;
  priceForUsers?: (users: number) => string;
  perUserForUsers?: (users: number) => string;
  usersForUsers?: (users: number) => string;
  description: string;
  features: string[];
  support: string;
  cta: string;
  popular?: boolean;
  badge?: string;
};

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "شروع",
    eyebrow: "برای تیم‌های کوچک",
    price: formatMillionToman(MONTHLY_START_PRICE_AT_MIN_USERS),
    priceUnit: "تومان / ماه",
    priceLabel: "لایسنس ماهانه",
    perUser: formatPerUser(MONTHLY_START_PRICE_PER_USER),
    users: "۵ تا ۵۰ کاربر",
    priceForUsers: (users) =>
      users <= MAX_MONTHLY_USERS
        ? formatMillionToman(MONTHLY_START_PRICE_PER_USER * users)
        : "قیمت سازمانی",
    priceUnitForUsers: (users) => (users <= MAX_MONTHLY_USERS ? "تومان / ماه" : ""),
    perUserForUsers: (users) =>
      users <= MAX_MONTHLY_USERS
        ? formatPerUser(MONTHLY_START_PRICE_PER_USER)
        : "بیش از ۵۰ کاربر؛ قیمت‌گذاری سازمانی",
    usersForUsers: (users) =>
      users <= MAX_MONTHLY_USERS
        ? `برای ${formatUserCount(users)} کاربر`
        : "بیش از ۵۰ کاربر · سازمانی",
    description:
      "برای تیمی که می‌خواهد سرنخ‌ها و پیگیری‌های فروش را از فایل‌ها و پیام‌رسان‌ها جدا کند.",
    features: [
      "مدیریت سرنخ، مخاطب و شرکت",
      "معاملات و قیف فروش",
      "پیگیری‌ها و داشبورد فروش",
      "پیش‌فاکتور، ثبت پرداخت و گزارش پایه",
      "اتصال حسابفا و زرین‌پال",
    ],
    support: "راهنمای راه‌اندازی؛ پشتیبانی مستمر ندارد.",
    cta: "دریافت دسترسی دمو",
  },
  {
    name: "رشد",
    eyebrow: "برای تیم‌های فروش در حال رشد",
    price: formatMillionToman(MONTHLY_GROWTH_PRICE_AT_REFERENCE_USERS),
    priceUnit: "تومان / ماه",
    priceLabel: "لایسنس ماهانه",
    perUser: formatPerUser(MONTHLY_GROWTH_PRICE_PER_USER),
    users: "۵ تا ۵۰ کاربر",
    priceForUsers: (users) =>
      users <= MAX_MONTHLY_USERS
        ? formatMillionToman(MONTHLY_GROWTH_PRICE_PER_USER * users)
        : "قیمت سازمانی",
    priceUnitForUsers: (users) => (users <= MAX_MONTHLY_USERS ? "تومان / ماه" : ""),
    perUserForUsers: (users) =>
      users <= MAX_MONTHLY_USERS
        ? formatPerUser(MONTHLY_GROWTH_PRICE_PER_USER)
        : "بیش از ۵۰ کاربر؛ قیمت‌گذاری سازمانی",
    usersForUsers: (users) =>
      users <= MAX_MONTHLY_USERS
        ? `برای ${formatUserCount(users)} کاربر`
        : "بیش از ۵۰ کاربر · سازمانی",
    description: "برای تیمی که می‌خواهد فروش را با کمپین، خودکارسازی و گزارش‌های دقیق‌تر جلو ببرد.",
    features: [
      "همه امکانات پلن شروع",
      "کمپین‌های ارتباطی پیامکی و ایمیلی",
      "اتوماسیون رویدادمحور و زمان‌بندی‌شده",
      "ساخت وظیفه، ارسال پیامک، ایمیل و وب‌هوک",
      "خلاصه‌سازی AI و تحلیل فروش با داده‌های CRM",
    ],
    support: "پشتیبانی فنی و پاسخ‌گویی در ساعات کاری.",
    cta: "دریافت دسترسی دمو",
    popular: true,
  },
  {
    name: "سازمانی",
    eyebrow: "برای استقرار اختصاصی",
    price: "تماس بگیرید",
    priceUnit: "",
    priceLabel: "قیمت‌گذاری سفارشی",
    perUser: "بر اساس تعداد کاربران و نیاز سازمان",
    users: "تعداد کاربر سفارشی",
    description:
      "برای سازمانی که اتصال‌های اختصاصی، فرایندهای سفارشی و هماهنگی مستقیم برای استقرار می‌خواهد.",
    features: [
      "همه امکانات پلن رشد",
      "ساخت ایجنت‌های تخصصی برای فروش، پشتیبانی یا تحلیل",
      "نقش، مدل و دستور اختصاصی برای هر ایجنت",
      "اتصال SMS، SMTP، Asterisk / Issabel و مدل‌های هوش مصنوعی",
      "اتصال سفارشی به حسابداری، درگاه پرداخت یا سرویس داخلی شما",
      "مهاجرت داده، نقش‌ها و تنظیمات متناسب با فرایند سازمان",
    ],
    support: "پشتیبانی اختصاصی، هماهنگی مستقیم و SLA توافقی.",
    cta: "درخواست جلسه سازمانی",
  },
  {
    name: "دائمی",
    eyebrow: "برای خرید یک‌باره",
    price: formatMillionToman(LIFETIME_LICENSE_PRICE),
    priceUnit: "تومان",
    priceLabel: "لایسنس دائمی",
    perUser: "هزینهٔ یک‌باره برای ۲۰ کاربر",
    users: "۲۰ کاربر",
    description:
      "برای سازمانی که ترجیح می‌دهد هزینهٔ لایسنس را یک‌بار پرداخت کند و بدون تمدید ماهانه از نسخهٔ خریداری‌شده استفاده کند.",
    features: [
      "امکانات هستهٔ CRM و مدیریت فروش",
      "استقرار روی سرور سازمان شما",
      "لایسنس دائمی بدون تمدید ماهانه",
      "سه ماه پشتیبانی پس از خرید و استقرار",
      "اتصال‌ها و توسعه‌های اختصاصی، جداگانه برآورد می‌شوند",
    ],
    support: "۳ ماه پشتیبانی پس از خرید و استقرار؛ تمدید پشتیبانی پس از آن اختیاری و جداگانه است.",
    cta: "درخواست خرید دائمی",
    badge: "خرید یک‌باره",
  },
];

function PricingSection() {
  const [userCount, setUserCount] = useState(MIN_LICENSE_USERS);

  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-b border-[#dfe2e6] bg-white py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
            قیمت‌گذاری لایسنس دال
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
            CRM کامل، با لایسنس ماهانه یا خرید دائمی روی سرور خودتان.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            برای اجرای DaalCRM روی زیرساخت خودتان، یکی از دو لایسنس ماهانه را بر اساس تعداد کاربران
            انتخاب می‌کنید یا با پرداخت یک‌بارهٔ ۲۴۹ میلیون تومان، لایسنس دائمی ۲۰ کاربره می‌خرید.
            داده‌ها روی سرور شما می‌مانند؛ هزینهٔ سرور و سرویس‌های بیرونی با سازمان شماست. خرید
            دائمی شامل سه ماه پشتیبانی است و پس از آن تمدید پشتیبانی اختیاری و جداگانه خواهد بود؛ در
            مدل ماهانه، با توقف پرداخت حق استفاده از نرم‌افزار ادامه پیدا نمی‌کند.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-y border-[#dfe2e6] py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div>
            <label
              htmlFor="pricing-user-count"
              className="text-sm font-bold text-[#101827] dark:text-white"
            >
              تعداد کاربران
            </label>
            <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
              تعداد کاربران تیم را انتخاب کنید تا قیمت هر دو پلن ماهانه نمایش داده شود.
            </p>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-xl">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">۱۰۰</span>
            <input
              id="pricing-user-count"
              type="range"
              dir="ltr"
              min={MIN_LICENSE_USERS}
              max={100}
              step={1}
              value={userCount}
              onChange={(event) => setUserCount(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-100 accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
              aria-label="تعداد کاربران"
            />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">۵</span>
            <span className="min-w-20 text-center text-sm font-black text-blue-700 dark:text-blue-300">
              {formatUserCount(userCount)} نفر
            </span>
          </div>
          <p className="max-w-md text-xs leading-6 text-slate-500 dark:text-slate-400 sm:text-left">
            برای تیم‌های بزرگ‌تر از ۵۰ نفر، پیشنهاد سازمانی ارائه می‌شود.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {PRICING_PLANS.map((plan) => (
            <PricingPlanCard key={plan.name} plan={plan} userCount={userCount} />
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-5 border-s-2 border-blue-600 ps-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-[#101827] dark:text-white">
              نیاز سازمانی خارج از پلن‌ها دارید؟
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
              اگر حسابداری، درگاه پرداخت، سرویس پیامک یا گردش‌کار دیگری استفاده می‌کنید، نام سرویس و
              نیازتان را بفرستید تا اتصال یا قابلیت سفارشی را بررسی و جداگانه برآورد کنیم.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 gap-2 rounded-lg">
            <a href="/demo">
              درخواست بررسی سفارشی <ArrowUpLeft className="size-4" />
            </a>
          </Button>
        </div>
        <div className="mt-8 grid gap-3 border-y border-[#dfe2e6] py-5 text-xs leading-6 text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:grid-cols-3">
          <p>
            <span className="font-bold text-[#101827] dark:text-white">استقرار:</span> نصب و
            راه‌اندازی اولیه پس از شروع لایسنس و بدون هزینهٔ جداگانه انجام می‌شود.
          </p>
          <p>
            <span className="font-bold text-[#101827] dark:text-white">مالکیت داده:</span> نرم‌افزار
            روی سرور سازمان شماست و داده‌ها از زیرساخت شما خارج نمی‌شوند.
          </p>
          <p>
            <span className="font-bold text-[#101827] dark:text-white">پشتیبانی:</span> خرید دائمی
            سه ماه پشتیبانی دارد؛ تمدید پشتیبانی پس از آن اختیاری است و سطح پشتیبانی پلن‌های ماهانه
            در کارت هر پلن آمده است.
          </p>
        </div>
      </div>
    </section>
  );
}

function PricingPlanCard({ plan, userCount }: { plan: PricingPlan; userCount: number }) {
  const price = plan.priceForUsers?.(userCount) ?? plan.price;
  const priceUnit = plan.priceUnitForUsers?.(userCount) ?? plan.priceUnit;
  const perUser = plan.perUserForUsers?.(userCount) ?? plan.perUser;
  const users = plan.usersForUsers?.(userCount) ?? plan.users;

  return (
    <article
      className={`relative flex h-full flex-col border p-5 sm:p-6 ${
        plan.popular
          ? "border-blue-500 bg-[#f2f6ff] shadow-[0_18px_45px_rgba(37,99,235,0.12)] dark:bg-blue-950/30"
          : "border-[#dfe2e6] bg-[#fbfaf8] dark:border-slate-800 dark:bg-slate-950/40"
      }`}
    >
      {plan.popular || plan.badge ? (
        <span className="absolute -top-3 right-5 bg-blue-600 px-3 py-1 text-[10px] font-bold text-white">
          {plan.badge ?? "انتخاب محبوب تیم‌ها"}
        </span>
      ) : null}
      <p className="text-xs font-bold text-blue-600 dark:text-blue-300">{plan.eyebrow}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <h3 className="text-2xl font-black text-[#101827] dark:text-white">{plan.name}</h3>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{users}</span>
      </div>
      <div className="mt-6 border-y border-[#dfe2e6] py-4 dark:border-slate-800">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tight text-[#101827] dark:text-white">
            {price}
          </span>
          {priceUnit ? (
            <span className="text-xs text-slate-500 dark:text-slate-400">{priceUnit}</span>
          ) : null}
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          {plan.priceLabel} · نصب اولیه بدون هزینهٔ جداگانه
        </p>
        <p className="mt-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
          ({perUser})
        </p>
      </div>
      <p className="mt-5 min-h-14 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {plan.description}
      </p>
      <ul className="mt-5 flex-1 space-y-3 border-t border-[#dfe2e6] pt-5 text-xs leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-1 size-3.5 shrink-0 text-emerald-600" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-[#dfe2e6] pt-4 text-xs leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
        <span className="font-bold text-[#101827] dark:text-white">پشتیبانی:</span> {plan.support}
      </p>
      <Button
        asChild
        className="mt-6 w-full gap-2 rounded-lg"
        variant={plan.popular ? "default" : "outline"}
      >
        <a href="/demo">
          {plan.cta} <ArrowUpLeft className="size-4" />
        </a>
      </Button>
    </article>
  );
}

function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 border-b border-[#dfe2e6] bg-[#f5f3ee] py-16 dark:border-slate-800 dark:bg-slate-950 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
            سؤال‌های مهم قبل از خرید
          </h2>
          <p className="mt-5 text-sm leading-8 text-slate-500 dark:text-slate-400">
            اگر پاسخ سؤال شما اینجا نیست، فرم کوتاه دمو را پر کنید تا درباره استقرار و خرید دقیق‌تر
            راهنمایی‌تان کنیم.
          </p>
        </div>
        <div className="mt-10 divide-y border-y border-[#dfe2e6] dark:divide-slate-800 dark:border-slate-800">
          {DEMO_FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-[#101827] marker:hidden dark:text-white">
                <span>{item.question}</span>
                <span className="text-xl font-normal leading-none text-blue-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-3xl pt-4 text-sm leading-8 text-slate-500 dark:text-slate-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroProductSurface() {
  return (
    <div className="relative">
      <div className="absolute -bottom-3 -start-3 h-full w-full border border-blue-200 dark:border-blue-950" />
      <div className="relative overflow-hidden border border-[#18233a] bg-[#111a2d] text-white shadow-[0_22px_50px_-25px_rgba(15,23,42,0.55)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[10px] text-slate-400 sm:px-5">
          <span className="flex items-center gap-2">
            <PanelLeft className="size-3.5" /> DaalCRM / نمای فروش · دادهٔ نمونه
          </span>
        </div>
        <div className="grid md:grid-cols-[1fr_13rem]">
          <div className="p-5 sm:p-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] text-blue-300">امروز · تیم فروش</p>
                <h2 className="mt-2 text-xl font-bold">داشبورد فروش</h2>
              </div>
              <BarChart3 className="size-5 text-blue-300" />
            </div>
            <div className="mt-7 grid grid-cols-3 border-y border-white/10">
              <DarkStat label="ارزش فرصت‌های باز" value="۱٫۰۴ میلیارد" />
              <DarkStat label="ارزش مورد انتظار" value="۴۱۴٫۸۸ میلیون" />
              <DarkStat label="کارهای امروز" value="۱۲ کار" />
            </div>
            <div className="mt-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">معاملات در حال پیگیری</h3>
                  <p className="mt-1 text-[10px] text-slate-400">آخرین تغییرات قیف فروش</p>
                </div>
                <span className="text-[10px] text-blue-300">۳ فرصت باز</span>
              </div>
              <div className="mt-4 divide-y divide-white/10">
                {DEMO_DEALS.map((deal) => (
                  <div
                    key={deal.title}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{deal.title}</p>
                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {deal.company} · {deal.stage}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-blue-200">
                      {formatTomanCompact(deal.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className="border-t border-white/10 bg-[#172440] p-5 md:border-s md:border-t-0 md:rtl:border-s-0 md:rtl:border-e">
            <div className="flex items-center gap-2 text-blue-300">
              <ListTodo className="size-4" />
              <span className="text-xs font-semibold">قدم بعدی</span>
            </div>
            <p className="mt-7 text-lg font-bold leading-8">
              هیچ فرصت فروشی بدون قدم بعدی نمی‌ماند.
            </p>
            <div className="mt-7 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold">تماس با سارا محمدی</p>
              <p className="mt-1 text-[10px] text-slate-400">راهکار نو · امروز، ۱۰:۳۰</p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold">ارسال پیشنهاد استقرار</p>
              <p className="mt-1 text-[10px] text-slate-400">پیشگامان شرق · امروز، ۱۴:۰۰</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DarkStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-s border-white/10 px-3 py-4 first:border-s-0 first:ps-0 last:pe-0 sm:px-4">
      <p className="text-[9px] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-white sm:text-base">{value}</p>
    </div>
  );
}

function Capability({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
      <Icon className="size-3.5 shrink-0 text-blue-600" />
      <span>{label}</span>
    </div>
  );
}

function FeaturePreview({ id }: { id: FeatureId }) {
  return (
    <div className="mt-8 overflow-hidden border border-[#dfe2e6] bg-[#f8f9fb] dark:border-slate-700 dark:bg-slate-950/70">
      <div className="p-4 sm:p-6">
        {id === "leads" ? <LeadsPreview /> : null}
        {id === "pipeline" ? <PipelinePreview /> : null}
        {id === "followups" ? <FollowupsPreview /> : null}
        {id === "billing" ? <BillingPreview /> : null}
        {id === "intelligence" ? <IntelligencePreview /> : null}
      </div>
    </div>
  );
}

function LeadsPreview() {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">سرنخ‌های ورودی</p>
          <p className="mt-1 text-[10px] text-slate-400">ثبت، اولویت‌بندی و پیگیری سرنخ‌های فروش</p>
        </div>
        <Search className="size-4 text-slate-400" />
      </div>
      <div className="mt-5 grid divide-y border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:rtl:divide-x-reverse dark:divide-slate-700 dark:border-slate-700">
        <DataLine icon={Users} label="مخاطب" value="سارا محمدی" />
        <DataLine icon={Building2} label="شرکت" value="راهکار نو" />
        <DataLine icon={MessageSquare} label="منبع" value="فرم دمو" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
        <span className="border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
          سرنخ گرم
        </span>
        <span className="border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
          پیگیری امروز
        </span>
        <span className="border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900">
          مسئول: تیم فروش
        </span>
      </div>
    </div>
  );
}

function PipelinePreview() {
  const stages = [
    { label: "سرنخ جدید", title: "استقرار CRM برای تیم سازمانی", amount: "۴۸۸ میلیون" },
    { label: "پیشنهاد", title: "راه‌اندازی مرکز تماس", amount: "۳۳۶ میلیون" },
    { label: "مذاکره", title: "پیاده‌سازی سامانه فروش", amount: "۱۴۸ میلیون" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">قیف فروش</p>
          <p className="mt-1 text-[10px] text-slate-400">
            مرحله، مبلغ و احتمال هر معامله را یک‌جا ببینید
          </p>
        </div>
        <Target className="size-4 text-blue-600" />
      </div>
      <div className="mt-5 grid divide-y border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:rtl:divide-x-reverse dark:divide-slate-700 dark:border-slate-700">
        {stages.map((stage) => (
          <div key={stage.label} className="px-3 py-3 first:ps-0 last:pe-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300">
                {stage.label}
              </span>
              <span className="size-1.5 rounded-full bg-blue-500" />
            </div>
            <p className="mt-4 text-xs font-semibold leading-5 text-slate-800 dark:text-slate-100">
              {stage.title}
            </p>
            <p className="mt-2 text-[10px] text-slate-400">{stage.amount} تومان</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FollowupsPreview() {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
            پیگیری‌ها و اتوماسیون
          </p>
          <p className="mt-1 text-[10px] text-slate-400">کار بعدی هر مشتری، با مسئول و زمان مشخص</p>
        </div>
        <Settings2 className="size-4 text-blue-600" />
      </div>
      <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        {DEMO_ACTIVITIES.map((activity, index) => (
          <div key={activity.title} className="flex items-center gap-3 py-3">
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full ${index === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200" : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200"}`}
            >
              <CalendarCheck className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                {activity.title}
              </p>
              <p className="mt-1 text-[10px] text-slate-400">{activity.meta}</p>
            </div>
            <span className="text-[10px] text-slate-400">
              {index === 0 ? "امروز" : "در انتظار"}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-700 dark:text-emerald-300">
        <Workflow className="size-3.5" /> با ثبت مخاطب جدید، پیگیری اولیه ساخته و برای مسئول
        تعیین‌شده ثبت می‌شود.
      </div>
    </div>
  );
}

function BillingPreview() {
  const invoices = [
    {
      title: "پیشنهاد نسخه سازمانی",
      customer: "پیشگامان شرق",
      value: "۳۳۶ میلیون",
      status: "پرداخت نشده",
    },
    {
      title: "پیاده‌سازی سامانه فروش",
      customer: "راهکار نو",
      value: "۱۴۸ میلیون",
      status: "بخشی پرداخت شده",
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
            پیش‌فاکتور و پرداخت
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            وضعیت فروش را تا دریافت وجه روشن نگه دارید
          </p>
        </div>
        <FileText className="size-4 text-blue-600" />
      </div>
      <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        {invoices.map((invoice) => (
          <div
            key={invoice.title}
            className="flex flex-wrap items-center justify-between gap-3 py-3"
          >
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                {invoice.title}
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                {invoice.customer} · {invoice.status}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {invoice.value} تومان
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <ReceiptText className="size-3.5" /> مانده دریافتنی
        </span>
        <span className="font-bold text-slate-800 dark:text-slate-100">۲۲۸ میلیون تومان</span>
      </div>
    </div>
  );
}

function IntelligencePreview() {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
            هوش مصنوعی و تحلیل فروش
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            تحلیل‌گر و ایجنت تخصصی را روی داده‌های CRM خودتان بسازید
          </p>
        </div>
        <Bot className="size-4 text-blue-600" />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1.2fr]">
        <div className="divide-y border-y border-slate-200 dark:divide-slate-700 dark:border-slate-700">
          <IntegrationRow icon={Mail} label="SMTP / ایمیل" status="متصل" />
          <IntegrationRow icon={MessageSquare} label="پیامک" status="قابل اتصال" />
          <IntegrationRow icon={Calculator} label="حسابفا · حسابداری" status="قابل اتصال" />
          <IntegrationRow icon={CreditCard} label="زرین‌پال · درگاه پرداخت" status="قابل اتصال" />
          <IntegrationRow icon={Plug} label="OpenAI / هوش مصنوعی محلی" status="قابل اتصال" />
        </div>
        <div className="border-s border-blue-500 ps-4">
          <p className="text-[10px] text-slate-400">تحلیل‌گر و دستیار فروش</p>
          <p className="mt-3 text-xs font-semibold leading-6 text-slate-800 dark:text-slate-100">
            کدام معامله امروز به پیگیری فوری نیاز دارد؟
          </p>
          <div className="mt-4 border-s border-blue-500 ps-3 text-[10px] leading-6 text-slate-500 dark:text-slate-400">
            سه فرصت در مرحله پیشنهاد قرار دارند؛ پیگیری «راه‌اندازی مرکز تماس» به‌دلیل مبلغ و
            احتمال، اولویت بالاتری دارد.
          </div>
          <div className="mt-4 grid gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <span className="border-s border-emerald-500 ps-2">خلاصه‌سازی هوشمند سوابق مشتری</span>
            <span className="border-s border-emerald-500 ps-2">
              تعریف ایجنت با نقش و دستور اختصاصی
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="px-3 py-3 first:ps-0 last:pe-0">
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
        <Icon className="size-3" /> {label}
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function IntegrationRow({
  icon: Icon,
  label,
  status,
}: {
  icon: LucideIcon;
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
        <Icon className="size-3.5 text-blue-600" /> {label}
      </span>
      <span className="text-[10px] text-slate-400">{status}</span>
    </div>
  );
}

function WorkflowStep({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 px-0 py-6 sm:px-6 sm:first:ps-0 sm:last:pe-0">
      <span className="text-xs font-bold text-blue-300">{number}</span>
      <div>
        <Icon className="size-5 text-blue-300" />
        <h3 className="mt-5 text-sm font-bold">{title}</h3>
        <p className="mt-2 text-xs leading-6 text-slate-300">{text}</p>
      </div>
    </div>
  );
}

function ShieldDot() {
  return (
    <span className="flex size-3.5 items-center justify-center rounded-full border border-emerald-500">
      <span className="size-1 rounded-full bg-emerald-500" />
    </span>
  );
}
