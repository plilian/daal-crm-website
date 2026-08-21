export const PRODUCT_NAME = "DaalCRM";
export const PRODUCT_LABEL = "سامانه مدیریت مشتریان دال";
export const OFFICIAL_DAAL_URL = "https://www.daalgp.com/";

const configuredSiteUrl = (import.meta.env["VITE_SITE_URL"] ?? "").trim();

export const SITE_URL = configuredSiteUrl ? configuredSiteUrl.replace(/\/+$/, "") : undefined;

export const DEMO_FAQ_ITEMS = [
  {
    question: "DaalCRM چیست؟",
    answer:
      "DaalCRM یک سامانه مدیریت ارتباط با مشتری فارسی برای ثبت سرنخ، مدیریت مخاطب و شرکت، پیگیری فروش، مدیریت معاملات، پیش‌فاکتور، پرداخت و گزارش‌گیری است.",
  },
  {
    question: "DaalCRM برای چه تیم‌هایی مناسب است؟",
    answer:
      "این سامانه برای تیم‌های فروش B2B، شرکت‌های خدماتی و پروژه‌ای و کسب‌وکارهایی مناسب است که می‌خواهند اطلاعات مشتری، قیف فروش و پیگیری‌های تیم را در یک جریان کاری منظم نگه دارند.",
  },
  {
    question: "در دموی عمومی چه چیزی را می‌توانم ببینم؟",
    answer:
      "بعد از تکمیل فرم کوتاه، همان صفحه‌های واقعی CRM را از مسیر سرنخ تا معامله، پیگیری، پیش‌فاکتور، پرداخت، گزارش و اتصال‌ها با داده‌های نمونه می‌بینید.",
  },
  {
    question: "آیا استفاده از دموی عمومی هزینه دارد؟",
    answer:
      "خیر. مشاهده‌ی دمو رایگان است؛ فقط برای باز شدن محیط، مشخصات کوتاهی دریافت می‌شود. استفاده عملی از سامانه، خرید و راه‌اندازی لازم دارد.",
  },
  {
    question: "قیمت استفاده از CRM دال چقدر است؟",
    answer:
      "دال با لایسنس سالانه و بر اساس ظرفیت تیم ارائه می‌شود: پلن شروع برای تیم تا ۵ کاربر از ۱۹٫۹ میلیون تومان، پلن رشد تا ۱۵ کاربر ۳۹٫۹ میلیون تومان و پلن سازمانی از ۷۹٫۹ میلیون تومان در سال شروع می‌شود. نصب اولیه، پشتیبانی و به‌روزرسانی در طول اعتبار لایسنس پوشش داده می‌شود.",
  },
  {
    question: "آیا داده‌های دمو واقعی هستند؟",
    answer:
      "خیر. دموی عمومی با داده‌های نمونه اجرا می‌شود و هیچ پیام، تماس، ایمیل یا اتصال واقعی از آن ارسال نمی‌شود.",
  },
  {
    question: "آیا امکان نصب خصوصی DaalCRM وجود دارد؟",
    answer:
      "بله. DaalCRM روی سرور سازمان شما راه‌اندازی می‌شود تا داده‌ها در زیرساخت خودتان بماند و کنترل دسترسی در اختیار سازمان شما باشد. راه‌اندازی اولیه پس از خرید، بدون هزینه جداگانه انجام می‌شود.",
  },
  {
    question: "هزینه راه‌اندازی دال چطور محاسبه می‌شود؟",
    answer:
      "راه‌اندازی اولیه پس از خرید لایسنس سالانه دال رایگان است. قیمت بر اساس ظرفیت تیم و سطح امکانات مشخص می‌شود؛ مهاجرت داده، اتصال‌های ویژه و توسعه اختصاصی در صورت نیاز جداگانه بررسی می‌شوند.",
  },
  {
    question: "آیا تمدید لایسنس دال اختیاری است؟",
    answer:
      "خیر. دال با لایسنس سالانه ارائه می‌شود و برای ادامه استفاده از نرم‌افزار، لایسنس باید هر سال تمدید شود. در طول اعتبار لایسنس، پشتیبانی و به‌روزرسانی‌ها در اختیار تیم شماست.",
  },
  {
    question: "آیا برای خرید، جلسه معرفی متناسب با کسب‌وکارم دارید؟",
    answer:
      "بله. برای مشتریانی که قصد خرید دارند، یک جلسه معرفی بر اساس صنعت، اندازه تیم و مسیر فروششان هماهنگ می‌کنیم تا بخش‌های مرتبط دال را ببینند و درباره راه‌اندازی و پشتیبانی تصمیم بگیرند.",
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
          "سامانه مدیریت ارتباط با مشتری فارسی برای مدیریت سرنخ، قیف فروش، پیگیری، اتوماسیون، فاکتور و گزارش.",
        featureList: [
          "مدیریت سرنخ، مخاطب و شرکت",
          "مدیریت معاملات و قیف فروش",
          "پیگیری، کمپین و اتوماسیون فروش",
          "پیش‌فاکتور، پرداخت و گزارش‌گیری",
          "اتصال پیامک، ایمیل، تلفن و هوش مصنوعی",
          "نصب خصوصی با PostgreSQL و Docker Compose",
        ],
        provider: { "@id": "https://www.daalgp.com/#organization" },
      },
      {
        "@type": "WebPage",
        ...(pageId ? { "@id": pageId, url: demoUrl } : {}),
        name:
          pathname === "/"
            ? "سامانه مدیریت مشتریان دال | CRM فارسی فروش"
            : "دموی سامانه مدیریت مشتریان دال | DaalCRM",
        description:
          pathname === "/"
            ? "سامانه مدیریت مشتریان دال برای مدیریت سرنخ، فروش، پیگیری، فاکتور و گزارش؛ دموی تعاملی را ببینید و درباره خرید و راه‌اندازی روی زیرساخت خودتان مشاوره بگیرید."
            : "محیط تعاملی سامانه مدیریت مشتریان دال را با داده‌های نمونه بررسی کنید؛ از سرنخ و قیف فروش تا پیگیری، فاکتور و گزارش.",
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
    name: "مشاوره خرید و راه‌اندازی | سامانه مدیریت مشتریان دال",
    description:
      "برای آشنایی با مسیر خرید، راه‌اندازی روی سرور سازمان و پشتیبانی دال، چند سؤال کوتاه را پاسخ دهید.",
    inLanguage: "fa-IR",
    isPartOf: SITE_URL ? { "@type": "WebSite", url: SITE_URL, name: PRODUCT_LABEL } : undefined,
    about: { "@type": "SoftwareApplication", name: PRODUCT_NAME },
  };
}
