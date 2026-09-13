import { notFound } from "next/navigation";
import { AIRecordCard } from "@/components/ai-record-card";
import { ReviewForm } from "@/components/review-form";
import { ReviewStatus } from "@/components/review-status";
import { RecordStatusBadge } from "@/components/record-status-badge";
import { Separator } from "@/components/ui/separator";
import { calculateRecordStatus } from "@/lib/accountability";
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
  const existingReview = record.reviews.find(
    (r) => r.reviewer_id === currentMemberId
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
                  review={record.reviews.find((r) => r.reviewer_id === member.id)}
                />
              </li>
            ))}
        </ul>
      </div>

      <Separator />

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
    </div>
  );
}
