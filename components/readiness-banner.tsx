import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { TeamReadiness } from "@/lib/types";

const READINESS_CONFIG: Record<
  TeamReadiness,
  { title: string; icon: typeof Info; className: string }
> = {
  READY: {
    title: "READY FOR SUBMISSION",
    icon: CheckCircle2,
    className:
      "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  },
  NOT_READY: {
    title: "NOT READY FOR SUBMISSION",
    icon: AlertTriangle,
    className:
      "border-destructive/40 bg-destructive/5 text-destructive",
  },
  NO_RECORDS: {
    title: "NO AI-USE RECORDS YET",
    icon: Info,
    className: "border-border bg-muted text-muted-foreground",
  },
};

export function ReadinessBanner({
  readiness,
  reasons,
}: {
  readiness: TeamReadiness;
  reasons?: string[];
}) {
  const { title, icon: Icon, className } = READINESS_CONFIG[readiness];

  return (
    <Alert className={className}>
      <Icon />
      <AlertTitle className="text-base font-semibold">{title}</AlertTitle>
      <AlertDescription className={className}>
        {readiness === "NO_RECORDS" &&
          "No AI-use records have been created yet. This is not the same as a completed accountability declaration."}
        {readiness === "READY" &&
          "Every AI-use record has been reviewed and acknowledged by all required team members."}
        {readiness === "NOT_READY" && reasons && reasons.length > 0 && (
          <>
            <p className="mb-1 font-medium">Not ready because:</p>
            <ul className="list-inside list-disc space-y-0.5">
              {reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
