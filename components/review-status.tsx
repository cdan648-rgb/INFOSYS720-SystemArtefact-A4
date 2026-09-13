import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReviewRow } from "@/lib/types";

export function ReviewStatus({
  review,
  isOwner,
}: {
  review: ReviewRow | undefined;
  isOwner: boolean;
}) {
  if (isOwner) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <CircleDashed className="size-3.5" />
        Owner
      </span>
    );
  }

  if (!review) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <CircleDashed className="size-3.5" />
        Not reviewed
      </span>
    );
  }

  if (review.decision === "acknowledged") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="size-3.5" />
        Acknowledged
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs text-destructive"
      )}
      title={review.comment ?? undefined}
    >
      <XCircle className="size-3.5" />
      Non-endorsed
    </span>
  );
}
