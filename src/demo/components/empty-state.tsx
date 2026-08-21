import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Button } from "@/demo/components/ui/button";
import { cn } from "@/demo/lib/utils";

/** حالت خالی فشرده — بدون اشغال نصف صفحه */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center",
        className,
      )}
    >
      <Icon className="mb-2 size-6 text-muted-foreground/70" aria-hidden />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button type="button" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
