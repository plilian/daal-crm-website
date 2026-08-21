import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { formatTomanCompact } from "@/lib/format";
import { canonicalLinks, DEMO_FAQ_ITEMS, getDemoStructuredData, publicSocialMeta } from "@/lib/seo";
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
  ClipboardCheck,
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
      { title: "سامانه مدیریت مشتریان دال | CRM فارسی فروش" },
      {
        name: "description",
        content:
          "سامانه مدیریت مشتریان دال برای مدیریت سرنخ، فروش، پیگیری، فاکتور و گزارش؛ دموی تعاملی را ببینید و درباره خرید و راه‌اندازی روی زیرساخت خودتان مشاوره بگیرید.",
      },
      ...publicSocialMeta({
        title: "سامانه مدیریت مشتریان دال | CRM فارسی فروش",
        description: "سرنخ‌ها، معاملات، پیگیری‌ها، اتوماسیون و درآمد را در یک مسیر فروش ببینید.",
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
    title: "هر ارتباط را با سابقه‌ی خودش نگه دارید.",
    summary:
      "اطلاعات مخاطب، شرکت، منبع سرنخ و سابقه تعامل در یک پرونده کنار هم می‌ماند؛ نه در چند فایل و پیام‌رسان مختلف.",
    bullets: [
      "ثبت و اولویت‌بندی سرنخ‌های ورودی",
      "مدیریت مخاطبین و شرکت‌ها",
      "جست‌وجوی سریع در کل داده‌های فروش",
    ],
    icon: Users,
  },
  {
    id: "pipeline",
    number: "۰۲",
    eyebrow: "معاملات و قیف فروش",
    title: "از اولین تماس تا بستن قرارداد، مسیر را ببینید.",
    summary:
      "هر معامله با مرحله، مبلغ، احتمال و تاریخ بستن مشخص است تا تیم بداند چه چیزی جلو رفته و چه چیزی گیر کرده است.",
    bullets: [
      "نمای کانبان برای مراحل فروش",
      "مبلغ و احتمال هر معامله",
      "قدم بعدی روشن برای هر فرصت",
    ],
    icon: Target,
  },
  {
    id: "followups",
    number: "۰۳",
    eyebrow: "پیگیری، کمپین و اتوماسیون",
    title: "هیچ سرنخی بین دو پیگیری گم نمی‌شود.",
    summary:
      "کارهای روزانه، کمپین‌های ارتباطی و قواعد اتوماسیون در یک جریان قابل‌پیگیری به هم وصل می‌شوند.",
    bullets: [
      "تقویم و وضعیت پیگیری‌ها",
      "کمپین‌های پیامکی و ایمیلی",
      "اجرای خودکار کارها بعد از رویدادها",
    ],
    icon: Workflow,
  },
  {
    id: "billing",
    number: "۰۴",
    eyebrow: "پیش‌فاکتور، پرداخت و گزارش",
    title: "فروش را تا دریافت وجه دنبال کنید.",
    summary:
      "پیش‌فاکتور، پرداخت‌ها، مانده حساب و گزارش فروش را از همان پرونده مشتری و معامله مدیریت کنید.",
    bullets: [
      "صدور پیش‌فاکتور و ثبت پرداخت",
      "پیگیری مانده حساب مشتریان",
      "گزارش درآمد، قیف و عملکرد تیم",
    ],
    icon: CircleDollarSign,
  },
  {
    id: "intelligence",
    number: "۰۵",
    eyebrow: "هوشمندسازی و اتصال‌ها",
    title: "ابزارهای تیم را به جریان فروش وصل کنید.",
    summary:
      "از چت و ایجنت‌های AI تا SMS، ایمیل، تلفن و اتصال‌های سازگار با OpenAI؛ هر تیم مسیر خودش را تنظیم می‌کند.",
    bullets: [
      "چت با داده‌های CRM و ایجنت‌های AI",
      "اتصال SMS، SMTP و Asterisk",
      "پشتیبانی از OpenAI، Gemini و Local AI",
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
    title: "اشتراک سالانه تیم فروش",
    company: "راهکار نو",
    amount: 148_000_000,
    stage: "مذاکره",
    probability: 75,
  },
  {
    title: "اتوماسیون پیگیری مشتریان",
    company: "ابرنگار",
    amount: 76_800_000,
    stage: "واجد شرایط",
    probability: 35,
  },
];

const DEMO_ACTIVITIES = [
  { title: "تماس با سارا محمدی", meta: "راهکار نو · امروز، ۱۰:۳۰" },
  { title: "ارسال پیشنهاد نسخه سازمانی", meta: "پیشگامان شرق · امروز، ۱۴:۰۰" },
  { title: "جلسه کشف نیاز", meta: "ابرنگار · فردا، ۰۹:۰۰" },
];

function DemoPage() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>("pipeline");
  const selectedFeature = FEATURES.find((feature) => feature.id === activeFeature) ?? FEATURES[1]!;

  return (
    <div className="min-h-svh overflow-hidden bg-[#f5f3ee] text-[#172033] dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-[#dfe2e6] bg-[#f5f3ee]/95 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark
              className="size-9 rounded-xl p-1"
              markClassName="rounded-lg text-xs"
              decorative
            />
            <span className="brand-mark text-base tracking-tight">Daal CRM</span>
            <span className="hidden border-s border-[#c9cdd3] ps-3 text-[11px] text-slate-500 sm:inline">
              سامانه مدیریت مشتریان دال
            </span>
          </Link>
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
              خرید و راه‌اندازی
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
            <a href={`${CRM_URL}/demo`} className="font-semibold text-blue-600 hover:text-blue-700">
              مشاوره خرید
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" className="hidden gap-1.5 rounded-lg sm:inline-flex">
              <a href={`${CRM_URL}/demo`}>
                مشاوره خرید <ArrowUpLeft className="size-3.5" />
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
                از اولین سرنخ تا دریافت وجه، فروش را در یک مسیر ببینید.
              </h1>
              <p className="mt-6 max-w-md text-base leading-8 text-slate-600 dark:text-slate-300">
                دال اطلاعات مشتری، معامله، پیگیری، فاکتور و گزارش را کنار هم می‌نشاند تا تیم فروش
                بداند امروز چه کاری بیشترین اثر را دارد.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 rounded-lg px-5">
                  <a href="#features">
                    دیدن قابلیت‌ها <ArrowLeft className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-[#cbd1da] bg-transparent px-5"
                >
                  <a href={`${CRM_URL}/demo`}>مشاهده CRM با داده نمونه</a>
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" /> راه‌اندازی اولیه پس از خرید
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldDot /> داده‌ها روی زیرساخت شما
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
                  <CircleDollarSign className="size-3.5" /> شروع از ۲۹۹ هزار تومان برای هر کاربر
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
            <Capability icon={Users} label="سرنخ و مخاطب" />
            <Capability icon={Target} label="قیف و معاملات" />
            <Capability icon={CalendarCheck} label="پیگیری و کمپین" />
            <Capability icon={ReceiptText} label="فاکتور و درآمد" />
            <Capability icon={Plug} label="هوشمندسازی و اتصال‌ها" />
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-20 bg-white py-16 dark:bg-slate-900/40 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                قابلیت‌های واقعی دال
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
                فروش را از اولین تماس تا دریافت وجه مدیریت کنید.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-8 text-slate-500 dark:text-slate-400">
                سرنخ، مخاطب، شرکت، معامله، پیگیری، فاکتور، پرداخت، گزارش و اتصال‌های تیم را در یک
                مسیر منظم کنار هم داشته باشید.
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
                  جریان کاری دال
                </p>
                <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  همه‌چیز به قدم بعدی وصل می‌شود.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-slate-300">
                اطلاعات فقط ذخیره نمی‌شوند؛ به تصمیم، پیگیری و نتیجه‌ی قابل‌اندازه‌گیری تبدیل
                می‌شوند.
              </p>
            </div>
            <div className="grid divide-y divide-white/15 pt-2 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:rtl:divide-x-reverse">
              <WorkflowStep
                number="۰۱"
                icon={Users}
                title="ورود سرنخ"
                text="منبع، مخاطب و شرکت را ثبت کنید."
              />
              <WorkflowStep
                number="۰۲"
                icon={Target}
                title="حرکت معامله"
                text="مرحله، مبلغ و احتمال را ببینید."
              />
              <WorkflowStep
                number="۰۳"
                icon={ClipboardCheck}
                title="پیگیری تیم"
                text="قدم بعدی را به مسئول و زمان وصل کنید."
              />
              <WorkflowStep
                number="۰۴"
                icon={CircleDollarSign}
                title="نتیجه و درآمد"
                text="فاکتور، پرداخت و گزارش را دنبال کنید."
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
                خرید و راه‌اندازی
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
                دال را برای جریان فروش خودتان راه‌اندازی کنید.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-slate-500 dark:text-slate-400">
                دموی عمومی را ببینید. اگر دال برای تیم شما مناسب بود، درباره خرید، نصب روی سرور
                خودتان و پشتیبانی شروع کار با ما صحبت کنید.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 gap-2 rounded-lg px-5">
              <a href={`${CRM_URL}/demo`}>
                مشاوره خرید و راه‌اندازی <ArrowUpLeft className="size-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-[#f5f3ee] px-5 pb-8 text-xs text-slate-500 dark:bg-slate-950 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-[#dfe2e6] pt-5 dark:border-slate-800">
          <span>سامانه مدیریت مشتریان دال · مدیریت فروش، مشتریان و درآمد</span>
          <a href={`${CRM_URL}/auth`} className="hover:text-slate-950 dark:hover:text-white">
            ورود به پنل
          </a>
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
            وقتی اطلاعات فروش پراکنده است، دال آن را به یک مسیر روشن تبدیل می‌کند.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            دال برای تیم‌هایی ساخته شده که می‌خواهند از فایل‌های پراکنده، پیام‌های گم‌شده و
            پیگیری‌های شفاهی فاصله بگیرند و بدانند هر مشتری در چه مرحله‌ای است و قدم بعدی چیست.
          </p>
        </div>
        <div className="mt-12 grid divide-y border-y border-[#dfe2e6] dark:divide-slate-800 dark:border-slate-800 md:grid-cols-3 md:divide-x md:divide-y-0 md:rtl:divide-x-reverse">
          <AudienceItem
            number="۰۱"
            title="تیم‌های فروش B2B"
            text="سرنخ، شرکت، مخاطب، معامله و احتمال بستن قرارداد را در یک پرونده دنبال کنید."
          />
          <AudienceItem
            number="۰۲"
            title="شرکت‌های خدماتی و پروژه‌ای"
            text="از اولین درخواست تا پیشنهاد، پرداخت و مانده حساب، سابقه رابطه را کنار فروش نگه دارید."
          />
          <AudienceItem
            number="۰۳"
            title="تیم‌های در حال نظم‌دادن به فروش"
            text="پیگیری‌های روزانه، کمپین‌ها و اتوماسیون‌ها را به مسئول، زمان و نتیجه وصل کنید."
          />
        </div>
      </div>
    </section>
  );
}

function AudienceItem({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="py-6 first:pt-0 last:pb-0 md:px-7 md:py-7 md:first:ps-0 md:last:pe-0">
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
            مدل همکاری دال
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
            محصول را می‌خرید؛ داده و زیرساخت نزد خودتان می‌ماند.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            دال برای سازمان‌هایی ساخته شده که می‌خواهند CRM را روی سرور خودشان داشته باشند. بعد از
            خرید، راه‌اندازی اولیه و شروع کار را همراه تیم شما پیش می‌بریم.
          </p>
        </div>
        <div className="mt-12 grid divide-y border-y border-[#dfe2e6] dark:divide-slate-800 dark:border-slate-800 md:grid-cols-4 md:divide-x md:divide-y-0 md:rtl:divide-x-reverse">
          <DeploymentItem
            number="۰۱"
            title="مشاوره قبل از خرید"
            text="نیاز تیم، تعداد کاربران و زیرساخت مناسب را قبل از تصمیم‌گیری بررسی می‌کنیم."
          />
          <DeploymentItem
            number="۰۲"
            title="راه‌اندازی اولیه رایگان"
            text="پس از خرید دال، نصب و تنظیمات اولیه روی سرور سازمان شما بدون هزینه جداگانه انجام می‌شود."
          />
          <DeploymentItem
            number="۰۳"
            title="کنترل داده با شماست"
            text="داده‌ها در زیرساخت خودتان نگه‌داری می‌شوند و سیاست دسترسی را سازمان شما تعیین می‌کند."
          />
          <DeploymentItem
            number="۰۴"
            title="همراهی شروع کار"
            text="برای آموزش، تنظیم مسیر فروش و استفاده درست از قابلیت‌ها در شروع کنار تیم شما هستیم."
          />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild className="gap-2 rounded-lg">
            <a href={`${CRM_URL}/demo`}>
              مشاوره خرید و راه‌اندازی <ArrowUpLeft className="size-4" />
            </a>
          </Button>
          <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
            دمو عمومی رایگان است؛ راه‌اندازی روی سرور شما بعد از خرید انجام می‌شود.
          </p>
        </div>
      </div>
    </section>
  );
}

function DeploymentItem({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="py-6 first:pt-0 last:pb-0 md:px-6 md:py-7 md:first:ps-0 md:last:pe-0">
      <p className="text-xs font-bold text-blue-600 dark:text-blue-300">{number}</p>
      <h3 className="mt-5 text-base font-bold text-[#101827] dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{text}</p>
    </article>
  );
}

type PricingPlan = {
  name: string;
  eyebrow: string;
  monthly: string;
  annual: string;
  users: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "شروع",
    eyebrow: "برای تیم‌های کوچک",
    monthly: "۲۹۹ هزار",
    annual: "۲۴۹ هزار",
    users: "حداقل ۳ کاربر",
    description: "برای اینکه تیم فروش سریع از اکسل و پیام‌رسان جدا شود و یک مسیر مشترک داشته باشد.",
    features: [
      "سرنخ، مخاطب و شرکت",
      "معاملات و قیف فروش",
      "پیگیری‌های روزانه و داشبورد",
      "پیش‌فاکتور، پرداخت و گزارش پایه",
    ],
    cta: "اول دمو را ببینید",
  },
  {
    name: "رشد",
    eyebrow: "برای تیم‌های فروش در حال رشد",
    monthly: "۳۹۹ هزار",
    annual: "۳۳۳ هزار",
    users: "حداقل ۳ کاربر",
    description:
      "برای تیمی که می‌خواهد پیگیری‌ها، کمپین‌ها و تصمیم‌های فروش را منظم و قابل‌اندازه‌گیری کند.",
    features: [
      "همه امکانات پلن شروع",
      "اتوماسیون و اجرای خودکار پیگیری",
      "کمپین‌های ایمیلی و پیامکی",
      "چت با داده‌ها و ایجنت‌های AI",
      "گزارش‌های تیمی و نقش‌های دسترسی",
    ],
    cta: "مشاهده دمو و دریافت قیمت",
    popular: true,
  },
  {
    name: "سازمانی",
    eyebrow: "برای استقرار اختصاصی",
    monthly: "۶۹۹ هزار",
    annual: "۵۸۳ هزار",
    users: "از ۱۰ کاربر",
    description:
      "برای سازمانی که داده را روی زیرساخت خودش نگه می‌دارد و راه‌اندازی همراه تیم می‌خواهد.",
    features: [
      "همه امکانات پلن رشد",
      "نصب خصوصی روی سرور سازمان",
      "مهاجرت داده و اتصال‌های اختصاصی",
      "آموزش و پشتیبانی اولویت‌دار",
      "تنظیمات متناسب با فرایند فروش سازمان",
    ],
    cta: "درخواست پیشنهاد سازمانی",
  },
];

function PricingSection() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-b border-[#dfe2e6] bg-white py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
            قیمت‌گذاری شروع دال
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#101827] dark:text-white sm:text-4xl">
            CRM کامل، با قیمتی که تیم ایرانی بتواند سریع شروع کند.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            قیمت‌ها به‌ازای هر کاربر فعال در ماه محاسبه شده‌اند تا بتوانید بدون قرارداد سنگین شروع
            کنید و با رشد تیم، هزینه را شفاف بالا ببرید. پرداخت سالانه شامل دو ماه رایگان است.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <PricingPlanCard key={plan.name} plan={plan} />
          ))}
        </div>
        <div className="mt-8 grid gap-3 border-y border-[#dfe2e6] py-5 text-xs leading-6 text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:grid-cols-3">
          <p>
            <span className="font-bold text-[#101827] dark:text-white">نصب اولیه:</span> بعد از
            خرید، بدون هزینه جداگانه.
          </p>
          <p>
            <span className="font-bold text-[#101827] dark:text-white">قیمت سالانه:</span> معادل دو
            ماه رایگان در هر پلن.
          </p>
          <p>
            <span className="font-bold text-[#101827] dark:text-white">سازمانی:</span> برای مهاجرت و
            اتصال ویژه، پیشنهاد دقیق می‌دهیم.
          </p>
        </div>
      </div>
    </section>
  );
}

function PricingPlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className={`relative flex h-full flex-col border p-5 sm:p-6 ${
        plan.popular
          ? "border-blue-500 bg-[#f2f6ff] shadow-[0_18px_45px_rgba(37,99,235,0.12)] dark:bg-blue-950/30"
          : "border-[#dfe2e6] bg-[#fbfaf8] dark:border-slate-800 dark:bg-slate-950/40"
      }`}
    >
      {plan.popular ? (
        <span className="absolute -top-3 right-5 bg-blue-600 px-3 py-1 text-[10px] font-bold text-white">
          انتخاب محبوب تیم‌ها
        </span>
      ) : null}
      <p className="text-xs font-bold text-blue-600 dark:text-blue-300">{plan.eyebrow}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <h3 className="text-2xl font-black text-[#101827] dark:text-white">{plan.name}</h3>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{plan.users}</span>
      </div>
      <div className="mt-6 border-y border-[#dfe2e6] py-4 dark:border-slate-800">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tight text-[#101827] dark:text-white">
            {plan.monthly}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">تومان / کاربر / ماه</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          پرداخت سالانه: <span className="font-bold">{plan.annual} تومان</span> برای هر کاربر در ماه
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
      <Button
        asChild
        className="mt-6 w-full gap-2 rounded-lg"
        variant={plan.popular ? "default" : "outline"}
      >
        <a href={`${CRM_URL}/demo`}>
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
            قبل از خرید، جواب سؤال‌های اصلی را بخوانید.
          </h2>
          <p className="mt-5 text-sm leading-8 text-slate-500 dark:text-slate-400">
            اگر جواب سؤال شما اینجا نیست، در فرم مشاوره خرید نیازتان را بنویسید تا دقیق‌تر
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
            <PanelLeft className="size-3.5" /> دال / داشبورد فروش
          </span>
        </div>
        <div className="grid md:grid-cols-[1fr_13rem]">
          <div className="p-5 sm:p-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] text-blue-300">امروز · تیم فروش</p>
                <h2 className="mt-2 text-xl font-bold">نمای عملیاتی فروش</h2>
              </div>
              <BarChart3 className="size-5 text-blue-300" />
            </div>
            <div className="mt-7 grid grid-cols-3 border-y border-white/10">
              <DarkStat label="ارزش قیف باز" value="۱٫۰۴ میلیارد" />
              <DarkStat label="ارزش وزنی" value="۴۱۴٫۸۸ میلیون" />
              <DarkStat label="پیگیری امروز" value="۱۲ کار" />
            </div>
            <div className="mt-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">معاملات در حرکت</h3>
                  <p className="mt-1 text-[10px] text-slate-400">آخرین تغییرات قیف فروش</p>
                </div>
                <span className="text-[10px] text-blue-300">۳ معامله فعال</span>
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
            <p className="mt-7 text-lg font-bold leading-8">هیچ سرنخی بدون مسئول نمی‌ماند.</p>
            <div className="mt-7 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold">تماس با سارا محمدی</p>
              <p className="mt-1 text-[10px] text-slate-400">راهکار نو · امروز، ۱۰:۳۰</p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold">ارسال پیشنهاد سازمانی</p>
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
          <p className="mt-1 text-[10px] text-slate-400">ثبت، اولویت‌بندی و تبدیل سرنخ‌های فروش</p>
        </div>
        <Search className="size-4 text-slate-400" />
      </div>
      <div className="mt-5 grid divide-y border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:rtl:divide-x-reverse dark:divide-slate-700 dark:border-slate-700">
        <DataLine icon={Users} label="مخاطب" value="سارا محمدی" />
        <DataLine icon={Building2} label="شرکت" value="راهکار نو" />
        <DataLine icon={MessageSquare} label="منبع" value="فرم مشاوره" />
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
    { label: "سرنخ جدید", title: "گسترش کاربران سازمانی", amount: "۴۸۸ میلیون" },
    { label: "پیشنهاد", title: "راه‌اندازی مرکز تماس", amount: "۳۳۶ میلیون" },
    { label: "مذاکره", title: "اشتراک سالانه تیم فروش", amount: "۱۴۸ میلیون" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">قیف فروش</p>
          <p className="mt-1 text-[10px] text-slate-400">
            مرحله، مبلغ و احتمال هر معامله در یک نگاه
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
          <p className="mt-1 text-[10px] text-slate-400">کار بعدی هر رابطه، با زمان و مسئول مشخص</p>
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
            <span className="text-[10px] text-slate-400">{index === 0 ? "فوری" : "باز"}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-700 dark:text-emerald-300">
        <Workflow className="size-3.5" /> اگر مخاطب جدید ثبت شد، پیگیری اولیه ساخته شود.
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
      title: "اشتراک سالانه تیم فروش",
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
          <p className="mt-1 text-[10px] text-slate-400">فروش را تا دریافت وجه از دست ندهید</p>
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
          <ReceiptText className="size-3.5" /> مانده حساب مشتریان
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
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">اتصال‌ها و AI</p>
          <p className="mt-1 text-[10px] text-slate-400">
            هر تیم می‌تواند مسیر هوشمندسازی خودش را تنظیم کند
          </p>
        </div>
        <Bot className="size-4 text-blue-600" />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1.2fr]">
        <div className="divide-y border-y border-slate-200 dark:divide-slate-700 dark:border-slate-700">
          <IntegrationRow icon={Mail} label="SMTP / ایمیل" status="متصل" />
          <IntegrationRow icon={MessageSquare} label="پیامک" status="قابل تنظیم" />
          <IntegrationRow icon={Plug} label="OpenAI / Local AI" status="قابل تنظیم" />
        </div>
        <div className="border-s border-blue-500 ps-4">
          <p className="text-[10px] text-slate-400">چت با داده‌های CRM</p>
          <p className="mt-3 text-xs font-semibold leading-6 text-slate-800 dark:text-slate-100">
            کدام پیگیری‌های امروز بیشترین احتمال تبدیل را دارند؟
          </p>
          <div className="mt-4 border-s border-blue-500 ps-3 text-[10px] leading-6 text-slate-500 dark:text-slate-400">
            سه معامله در مرحله پیشنهاد هستند؛ راه‌اندازی مرکز تماس به‌دلیل مبلغ و احتمال، اولویت
            بالاتری دارد.
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
