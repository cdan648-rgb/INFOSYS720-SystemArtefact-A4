import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RecordStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  RecordStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  COMPLETE: {
    label: "Complete",
    icon: CheckCircle2,
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  PENDING_REVIEW: {
    label: "Pending Review",
    icon: Clock,
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  DISPUTED: {
    label: "Disputed",
    icon: AlertTriangle,
    className: "bg-destructive/10 text-destructive",
  },
};

export function RecordStatusBadge({ status }: { status: RecordStatus }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <Badge className={className}>
      <Icon data-icon="inline-start" />
      {label}
    </Badge>
  );
}
