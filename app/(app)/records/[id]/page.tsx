import { notFound } from "next/navigation";
import { AIRecordCard } from "@/components/ai-record-card";
import { RecordEditForm } from "@/components/record-edit-form";
import { ReviewForm } from "@/components/review-form";
import { ReviewStatus } from "@/components/review-status";
import { RecordStatusBadge } from "@/components/record-status-badge";
import { Separator } from "@/components/ui/separator";
import {
  calculateRecordStatus,
  getCurrentReviews,
  getReviewHistory,
} from "@/lib/accountability";
import { getDemoTeam, getRecordWithReviews, getTeamMembers } from "@/lib/data";
import { getCurrentMemberId } from "@/lib/session";

export default async function RecordDetailPage({
  params,
}: PageProps<"/records/[id]">) {
  const { id } = await params;

  const [team, record] = await Promise.all([
    getDemoTeam(),
    getRecordWithReviews(id),
  ]);

  if (!record) {
    notFound();
  }

  const members = await getTeamMembers(team.id);
  const currentMemberId = await getCurrentMemberId();
  const owner = members.find((m) => m.id === record.member_id);
  const status = calculateRecordStatus(record, record.reviews, members);
  const isOwner = currentMemberId === record.member_id;
  const currentReviews = getCurrentReviews(record, record.reviews);
  const reviewHistory = getReviewHistory(record, record.reviews);
  const existingReview = currentReviews.find(
    (r) => r.reviewer_id === currentMemberId
  );
  const nonEndorsements = currentReviews.filter(
    (r) => r.decision === "non_endorsed"
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold text-foreground">
          AI Record Detail
        </h1>
        <RecordStatusBadge status={status} />
      </div>

      <AIRecordCard record={record} owner={owner} />

      <div>
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Team review
        </h2>
        <ul className="flex flex-col gap-1.5">
          {members
            .filter((m) => m.id !== record.member_id)
            .map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span className="text-foreground">{member.name}</span>
                <ReviewStatus
                  isOwner={false}
                  review={currentReviews.find((r) => r.reviewer_id === member.id)}
                />
              </li>
            ))}
        </ul>
      </div>

      <Separator />

      {isOwner && status === "DISPUTED" ? (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              Revise and resubmit for review
            </h2>
            <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <p className="mb-1 font-medium text-destructive">
                The following teammates non-endorsed this record:
              </p>
              <ul className="list-inside list-disc space-y-1 text-destructive">
                {nonEndorsements.map((review) => {
                  const reviewer = members.find((m) => m.id === review.reviewer_id);
                  return (
                    <li key={review.id}>
                      <span className="font-medium">{reviewer?.name ?? "Unknown"}:</span>{" "}
                      {review.comment}
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Revising the record starts a new review round. Previous
              acknowledgements will no longer apply, and all teammates will
              need to review the revised record again.
            </p>
          </div>
          <RecordEditForm record={record} />
        </div>
      ) : (
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Your review
          </h2>
          {isOwner ? (
            <p className="text-sm text-muted-foreground">
              You are the owner of this record and do not review your own
              AI-use record.
            </p>
          ) : (
            <ReviewForm
              recordId={record.id}
              existingDecision={existingReview?.decision as "acknowledged" | "non_endorsed" | undefined}
              existingComment={existingReview?.comment}
            />
          )}
        </div>
      )}

      {reviewHistory.length > 0 && (
        <>
          <Separator />
          <details className="rounded-lg border p-3">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Previous review history ({reviewHistory.length})
            </summary>
            <p className="mt-2 text-xs text-muted-foreground">
              Review decisions from earlier revisions of this record. This
              reflects prior review rounds only &mdash; it does not preserve
              the exact previous contents of the record itself.
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {reviewHistory.map((review) => {
                const reviewer = members.find((m) => m.id === review.reviewer_id);
                return (
                  <li key={review.id} className="rounded-md border px-3 py-2 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-foreground">
                        Revision {review.record_revision} &middot;{" "}
                        {reviewer?.name ?? "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {review.decision === "acknowledged"
                        ? "Acknowledged"
                        : "Non-endorsed"}
                      {review.comment ? `: ${review.comment}` : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          </details>
        </>
      )}
    </div>
  );
}
