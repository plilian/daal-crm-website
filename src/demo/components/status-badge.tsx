import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Badge } from "@/demo/components/ui/badge";
import { cn } from "@/demo/lib/utils";
import {
  APPOINTMENT_STATUS_LABELS,
  INVOICE_STATUS_LABELS,
  type AppointmentStatus,
} from "@/demo/lib/clinic";
import { STAGE_LABELS, type Stage } from "@/demo/lib/crm";

/**
 * واژگان وضعیت یکپارچه — رنگ معنایی در کل محصول.
 * وضعیت‌های عملیاتی تعاملات و فاکتورها در این فایل یکدست می‌شوند.
 */

const statusBadge = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[12px] font-medium shadow-none",
  {
    variants: {
      tone: {
        success: "border-transparent bg-success/12 text-success",
        info: "border-transparent bg-info/12 text-info",
        teal: "border-transparent bg-teal/12 text-teal",
        warning: "border-transparent bg-warning/15 text-warning-foreground dark:text-warning",
        danger: "border-transparent bg-destructive/12 text-destructive",
        muted: "border-border bg-muted text-muted-foreground",
        brand: "border-transparent bg-primary/10 text-primary",
        neutral: "border-border bg-card text-foreground",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export type StatusTone = NonNullable<VariantProps<typeof statusBadge>["tone"]>;

const APPOINTMENT_TONE: Record<AppointmentStatus, StatusTone> = {
  completed: "success",
  confirmed: "info",
  booked: "teal",
  no_show: "warning",
  cancelled: "muted",
};

const INVOICE_TONE: Record<string, StatusTone> = {
  paid: "success",
  partial: "warning",
  unpaid: "danger",
  draft: "muted",
  void: "muted",
};

const DEAL_TONE: Record<Stage, StatusTone> = {
  new: "info",
  qualified: "teal",
  proposal: "brand",
  negotiation: "warning",
  won: "success",
  lost: "muted",
};

export function appointmentStatusTone(status: AppointmentStatus): StatusTone {
  return APPOINTMENT_TONE[status] ?? "muted";
}

export function invoiceStatusTone(status: string): StatusTone {
  return INVOICE_TONE[status] ?? "muted";
}

export function dealStageTone(stage: string): StatusTone {
  return DEAL_TONE[stage as Stage] ?? "muted";
}

export function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: StatusTone;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <Badge variant="outline" className={cn(statusBadge({ tone }), className)}>
      {children}
    </Badge>
  );
}

export function AppointmentStatusBadge({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string | undefined;
}) {
  return (
    <StatusBadge tone={appointmentStatusTone(status)} className={className}>
      {APPOINTMENT_STATUS_LABELS[status] ?? status}
    </StatusBadge>
  );
}

export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string | undefined;
}) {
  return (
    <StatusBadge tone={invoiceStatusTone(status)} className={className}>
      {INVOICE_STATUS_LABELS[status] ?? status}
    </StatusBadge>
  );
}

export function DealStageBadge({
  stage,
  className,
}: {
  stage: string;
  className?: string | undefined;
}) {
  return (
    <StatusBadge tone={dealStageTone(stage)} className={className}>
      {STAGE_LABELS[stage as Stage] ?? stage}
    </StatusBadge>
  );
}
