import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AILevelBadge } from "@/components/ai-level-badge";
import { RecordStatusBadge } from "@/components/record-status-badge";
import { calculateRecordStatus } from "@/lib/accountability";
import type { AIRecordWithReviews, Member } from "@/lib/types";

export function DeclarationRecord({
  record,
  label,
  members,
}: {
  record: AIRecordWithReviews;
  label: string;
  members: Member[];
}) {
  const owner = members.find((m) => m.id === record.member_id);
  const status = calculateRecordStatus(record, record.reviews, members);
  const nonEndorsements = record.reviews.filter(
    (r) => r.decision === "non_endorsed"
  );

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground">
            {label} &middot; {record.task_name}
          </h3>
          <div className="flex items-center gap-2">
            <AILevelBadge level={record.ai_level} />
            <RecordStatusBadge status={status} />
          </div>
        </div>

        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Member</dt>
            <dd className="text-foreground">{owner?.name ?? "Unknown"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">AI tool</dt>
            <dd className="text-foreground">{record.ai_tool || "Not specified"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Description</dt>
            <dd className="text-foreground whitespace-pre-wrap">
              {record.description}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Evidence reference</dt>
            <dd className="text-foreground">
              {record.evidence_reference || "No evidence provided"}
            </dd>
          </div>
        </dl>

        <Separator />

        <div>
          <p className="mb-1 text-sm font-medium text-foreground">
            Team review states
          </p>
          <ul className="space-y-1 text-sm">
            {members
              .filter((m) => m.id !== record.member_id)
              .map((member) => {
                const review = record.reviews.find(
                  (r) => r.reviewer_id === member.id
                );
                return (
                  <li key={member.id} className="text-muted-foreground">
                    <span className="text-foreground">{member.name}</span>:{" "}
                    {review
                      ? review.decision === "acknowledged"
                        ? "Acknowledged"
                        : "Non-endorsed"
                      : "Not yet reviewed"}
                  </li>
                );
              })}
          </ul>
        </div>

        {nonEndorsements.length > 0 && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-sm text-destructive">
            <p className="font-medium">Non-endorsement comments</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {nonEndorsements.map((review) => {
                const reviewer = members.find((m) => m.id === review.reviewer_id);
                return (
                  <li key={review.id}>
                    {reviewer?.name ?? "Unknown"}: {review.comment}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
