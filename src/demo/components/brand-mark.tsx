import { cn } from "@/demo/lib/utils";

/** لوگوی رسمی گروه فناوری دال برای سایت و محصول DaalCRM */
export function BrandMark({
  className,
  markClassName,
  decorative = false,
  variant = "solid",
}: {
  className?: string;
  markClassName?: string;
  decorative?: boolean;
  /** solid = لوگوی اصلی؛ ghost = نسخه سبک برای ورود */
  variant?: "solid" | "ghost";
}) {
  const mark = (
    <span
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-[0.35rem] bg-white shadow-sm",
        variant === "ghost" ? "size-11" : "size-full",
        markClassName,
      )}
      aria-hidden="true"
    >
      <img src="/daalgp-logo.png" alt="" className="size-full object-contain" />
    </span>
  );

  if (variant === "ghost") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-primary/10 p-1",
          className,
        )}
        aria-hidden={decorative ? true : undefined}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : "لوگوی دال"}
      >
        {mark}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 p-1",
        className,
      )}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "لوگوی دال"}
    >
      {mark}
    </span>
  );
}

/** الگوی هندسی کم‌کنتراست و مستقل از برند برای صفحه ورود */
export function AppBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <svg
        className="absolute -start-[6%] top-[8%] h-[78vmin] w-[78vmin] text-primary opacity-[0.11] dark:opacity-[0.16]"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M200 28c22 68 78 112 158 128-80 16-136 60-158 128-22-68-78-112-158-128 80-16 136-60 158-128Z"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M200 110c14 40 48 68 96 78-48 10-82 38-96 78-14-40-48-68-96-78 48-10 82-38 96-78Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M98 268c48-14 82 8 106 52 24-44 58-66 106-52-28 62-64 108-106 138-42-30-78-76-106-138Z"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.85"
        />
        <circle cx="200" cy="198" r="2.5" fill="currentColor" opacity="0.5" />
      </svg>
      <svg
        className="absolute -end-[10%] bottom-[-8%] h-[62vmin] w-[62vmin] text-primary opacity-[0.09] dark:opacity-[0.14]"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36 288c34-100 98-168 198-200-22 78-8 156 48 220"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M88 248c46-24 92-22 138 8"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M208 78c-16 28-16 56 0 84 22-12 44-12 66 0-12-34-12-62 0-90-22 6-44 6-66 6Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M248 48c10 16 10 32 0 48"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M70 160c20-40 56-64 100-70"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,oklch(0.97_0.01_250_/_0.45)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_25%,oklch(0.18_0.02_250_/_0.55)_100%)]" />
    </div>
  );
}
