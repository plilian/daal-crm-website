import { PLACEHOLDER_META } from "@/demo/lib/clinic";
import { cn } from "@/demo/lib/utils";

/** دکمه‌های درج متغیر شخصی‌سازی برای قالب پیام */
export function PlaceholderChips({
  onInsert,
  className,
  hint = "با کلیک، متغیر داخل متن درج می‌شود — هنگام ارسال با دادهٔ هر مخاطب جایگزین می‌گردد.",
}: {
  onInsert: (token: string) => void;
  className?: string;
  hint?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex flex-wrap gap-1.5">
        {PLACEHOLDER_META.map((p) => (
          <button
            key={p.token}
            type="button"
            title={`${p.label} — ${p.token}`}
            onClick={() => onInsert(p.token)}
            className="rounded-lg border border-border bg-muted/80 px-2 py-1 text-[11px] text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            <span className="font-medium">{p.label}</span>
            <span className="ms-1.5 text-[10px] text-muted-foreground" dir="ltr">
              {p.token}
            </span>
          </button>
        ))}
      </div>
      {hint ? <p className="text-[11px] leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** درج توکن در textarea/input کنترل‌نشدهٔ فرم (با position caret اگر ممکن باشد) */
export function insertIntoNamedField(form: HTMLFormElement | null, name: string, token: string) {
  if (!form) return;
  const el = form.elements.namedItem(name);
  if (!(el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement)) return;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  const next = el.value.slice(0, start) + token + el.value.slice(end);
  el.value = next;
  const caret = start + token.length;
  el.focus();
  el.setSelectionRange(caret, caret);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
