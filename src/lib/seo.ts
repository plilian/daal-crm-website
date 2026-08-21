export const PRODUCT_NAME = "DaalCRM";
export const PRODUCT_LABEL = "سامانه مدیریت مشتریان دال";
export const OFFICIAL_DAAL_URL = "https://www.daalgp.com/";

const configuredSiteUrl = (import.meta.env["VITE_SITE_URL"] ?? "").trim();

export const SITE_URL = configuredSiteUrl ? configuredSiteUrl.replace(/\/+$/, "") : undefined;

export const DEMO_FAQ_ITEMS = [
  {
    question: "DaalCRM چیست؟",
    answer:
      "سامانه مدیریت مشتریان دال یک CRM فارسی برای ثبت سرنخ، مدیریت مخاطب و شرکت، پیگیری فروش، مدیریت معاملات، پیش‌فاکتور، پرداخت و گزارش‌گیری است.",
  },
  {
    question: "دال برای چه تیم‌هایی مناسب است؟",
    answer:
      "دال برای تیم‌های فروش B2B، شرکت‌های خدماتی و پروژه‌ای و سازمان‌هایی مناسب است که می‌خواهند اطلاعات مشتری، قیف فروش و پیگیری‌های تیم را در یک جریان کاری روشن نگه دارند.",
  },
  {
    question: "در دموی عمومی چه چیزی را می‌توانم ببینم؟",
    answer:
      "بعد از تکمیل فرم کوتاه، وارد همان محیط واقعی CRM می‌شوید و مسیر سرنخ، معامله، پیگیری، پیش‌فاکتور، پرداخت، گزارش و اتصال‌ها را با داده‌های نمونه می‌بینید.",
  },
  {
    question: "آیا دیدن دموی عمومی هزینه دارد؟",
    answer:
      "خیر. مشاهده دمو رایگان است؛ فقط برای باز شدن محیط، مشخصات کوتاهی دریافت می‌شود. دمو برای بررسی قابلیت‌هاست و استفاده عملی از سامانه به خرید لایسنس و استقرار نیاز دارد.",
  },
  {
    question: "قیمت لایسنس دال چقدر است؟",
    answer:
      "دال با لایسنس سالانه و بر اساس ظرفیت تیم ارائه می‌شود: پلن شروع برای تیم تا ۵ کاربر از ۱۹٫۹ میلیون تومان، پلن رشد تا ۱۵ کاربر ۳۹٫۹ میلیون تومان و پلن سازمانی از ۷۹٫۹ میلیون تومان در سال شروع می‌شود. نصب اولیه، پشتیبانی و به‌روزرسانی در طول اعتبار لایسنس پوشش داده می‌شود.",
  },
  {
    question: "آیا داده‌های داخل دمو واقعی هستند؟",
    answer:
      "خیر. دمو با داده‌های نمونه اجرا می‌شود. در محیط دمو هیچ پیامک، ایمیل، تماس یا اتصال واقعی ارسال نمی‌شود و اطلاعات کسب‌وکار شما هم وارد آن نمی‌شود.",
  },
  {
    question: "آیا دال روی سرور سازمان نصب می‌شود؟",
    answer:
      "بله. دال روی سرور سازمان شما نصب می‌شود تا اطلاعات در زیرساخت خودتان بماند. نصب و تنظیمات اولیه پس از خرید لایسنس، بدون هزینه جداگانه انجام می‌شود.",
  },
  {
    question: "هزینه راه‌اندازی و استقرار چطور محاسبه می‌شود؟",
    answer:
      "نصب و تنظیمات اولیه پس از خرید لایسنس سالانه رایگان است. مهاجرت داده، اتصال‌های ویژه و توسعه اختصاصی، در صورت نیاز، جداگانه بررسی و برآورد می‌شوند.",
  },
  {
    question: "آیا تمدید لایسنس دال لازم است؟",
    answer:
      "بله. دال با لایسنس یک‌ساله ارائه می‌شود و برای ادامه استفاده از نرم‌افزار، لایسنس باید هر سال تمدید شود. پشتیبانی و به‌روزرسانی‌ها در طول اعتبار لایسنس در اختیار تیم شماست.",
  },
  {
    question: "آیا دال به پیامک، ایمیل، تلفن و هوش مصنوعی وصل می‌شود؟",
    answer:
      "بله. دال به پیامک، ایمیل SMTP و تلفن Asterisk یا Issabel متصل می‌شود و با PostgreSQL، OpenAI، Gemini، سرویس‌های سازگار با OpenAI و هوش مصنوعی محلی کار می‌کند.",
  },
  {
    question: "آیا دال به حسابفا و زرین‌پال وصل می‌شود؟",
    answer:
      "بله. در صفحه یکپارچه‌سازی‌ها می‌توانید حسابفا را برای همگام‌سازی مخاطبان و زرین‌پال را برای ساخت لینک پرداخت از روی فاکتور تنظیم کنید. نتیجه پرداخت پس از تأیید درگاه در CRM ثبت می‌شود.",
  },
  {
    question: "آیا قبل از خرید جلسه معرفی داریم؟",
    answer:
      "بله. بعد از دیدن دمو، بر اساس صنعت، اندازه تیم و مسیر فروش شما جلسه معرفی و بررسی استقرار هماهنگ می‌کنیم تا درباره لایسنس، نصب و شروع کار تصمیم بگیرید.",
  },
] as const;

export function absoluteUrl(pathname: string): string | undefined {
  if (!SITE_URL) return undefined;
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function canonicalLinks(pathname: string) {
  const href = absoluteUrl(pathname);
  return href ? [{ rel: "canonical" as const, href }] : [];
}

export function publicSocialMeta({
  title,
  description,
  pathname,
}: {
  title: string;
  description: string;
  pathname: string;
}) {
  const url = absoluteUrl(pathname);
  const image = absoluteUrl("/daalgp-logo.png");

  return [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "fa_IR" },
    ...(url ? [{ property: "og:url", content: url }] : []),
    ...(image
      ? [
          { property: "og:image", content: image },
          { property: "og:image:alt", content: `${PRODUCT_LABEL} | ${PRODUCT_NAME}` },
        ]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(image ? [{ name: "twitter:image", content: image }] : []),
  ];
}

export function getDemoStructuredData(pathname: string = "/demo") {
  const demoUrl = absoluteUrl(pathname);
  const softwareId = demoUrl ? `${demoUrl}#software` : undefined;
  const pageId = demoUrl ? `${demoUrl}#webpage` : undefined;
  const websiteId = SITE_URL ? `${SITE_URL}#website` : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.daalgp.com/#organization",
        name: "گروه فناوری دال",
        alternateName: ["Daal Group", "دال"],
        url: OFFICIAL_DAAL_URL,
      },
      {
        "@type": "WebSite",
        ...(websiteId ? { "@id": websiteId } : {}),
        ...(SITE_URL ? { url: SITE_URL } : {}),
        name: PRODUCT_LABEL,
        alternateName: PRODUCT_NAME,
        inLanguage: "fa-IR",
        publisher: { "@id": "https://www.daalgp.com/#organization" },
      },
      {
        "@type": "SoftwareApplication",
        ...(softwareId ? { "@id": softwareId } : {}),
        ...(demoUrl ? { url: demoUrl } : {}),
        name: PRODUCT_NAME,
        alternateName: PRODUCT_LABEL,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "fa-IR",
        description:
          "سامانه مدیریت مشتریان دال برای مدیریت سرنخ، معاملات، پیگیری، پیش‌فاکتور، پرداخت، گزارش و اتصال‌های فروش.",
        featureList: [
          "مدیریت سرنخ، مخاطب و شرکت",
          "مدیریت معاملات و قیف فروش",
          "تقویم پیگیری، کمپین و اتوماسیون فروش",
          "پیش‌فاکتور، پرداخت و گزارش‌گیری",
          "اتصال حسابفا برای حسابداری و زرین‌پال برای پرداخت آنلاین",
          "چت با داده‌ها و ایجنت‌های هوش مصنوعی",
          "اتصال پیامک، ایمیل SMTP، تلفن Asterisk و مدل‌های هوش مصنوعی",
          "نصب خصوصی روی زیرساخت سازمان",
        ],
        provider: { "@id": "https://www.daalgp.com/#organization" },
      },
      {
        "@type": "WebPage",
        ...(pageId ? { "@id": pageId, url: demoUrl } : {}),
        name:
          pathname === "/"
            ? "سامانه مدیریت مشتریان دال | CRM فارسی برای فروش"
            : "دموی سامانه مدیریت مشتریان دال | DaalCRM",
        description:
          pathname === "/"
            ? "سامانه مدیریت مشتریان دال برای مدیریت سرنخ، معاملات، پیگیری، پیش‌فاکتور، پرداخت و گزارش؛ دموی واقعی را ببینید و دال را روی سرور خودتان مستقر کنید."
            : "محیط واقعی سامانه مدیریت مشتریان دال را با داده‌های نمونه ببینید؛ از سرنخ و قیف فروش تا پیگیری، پیش‌فاکتور، پرداخت و گزارش.",
        inLanguage: "fa-IR",
        isPartOf: websiteId ? { "@id": websiteId } : undefined,
        about: softwareId ? { "@id": softwareId } : undefined,
      },
      {
        "@type": "FAQPage",
        ...(pageId ? { "@id": `${pageId}-faq` } : {}),
        mainEntity: DEMO_FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export function getRequestDemoStructuredData() {
  const pageUrl = absoluteUrl("/request-demo");

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    ...(pageUrl ? { url: pageUrl } : {}),
    name: "مشاهده دموی واقعی و خرید | سامانه مدیریت مشتریان دال",
    description:
      "برای دیدن محیط واقعی CRM، آشنایی با قابلیت‌ها و بررسی خرید و استقرار دال، فرم کوتاه را تکمیل کنید.",
    inLanguage: "fa-IR",
    isPartOf: SITE_URL ? { "@type": "WebSite", url: SITE_URL, name: PRODUCT_LABEL } : undefined,
    about: { "@type": "SoftwareApplication", name: PRODUCT_NAME },
  };
}
