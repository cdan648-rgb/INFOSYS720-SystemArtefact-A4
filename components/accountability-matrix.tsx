import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AILevelBadge } from "@/components/ai-level-badge";
import { RecordStatusBadge } from "@/components/record-status-badge";
import { ReviewStatus } from "@/components/review-status";
import { calculateRecordStatus, getCurrentReviews } from "@/lib/accountability";
import { toRecordLabel } from "@/lib/data";
import type { AIRecordWithReviews, Member } from "@/lib/types";

export function AccountabilityMatrix({
  records,
  members,
}: {
  records: AIRecordWithReviews[];
  members: Member[];
}) {
  if (records.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No AI-use records have been created yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Record</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>AI Level</TableHead>
          <TableHead>Evidence</TableHead>
          {members.map((member) => (
            <TableHead key={member.id}>{member.name}</TableHead>
          ))}
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => {
          const owner = members.find((m) => m.id === record.member_id);
          const status = calculateRecordStatus(record, record.reviews, members);
          const currentReviews = getCurrentReviews(record, record.reviews);
          return (
            <TableRow key={record.id}>
              <TableCell>
                <Link
                  href={`/records/${record.id}`}
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  {toRecordLabel(record, records)}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {record.task_name}
                </div>
              </TableCell>
              <TableCell>{owner?.name ?? "Unknown"}</TableCell>
              <TableCell>
                <AILevelBadge level={record.ai_level} />
              </TableCell>
              <TableCell>
                {record.evidence_reference ? "Provided" : "None"}
              </TableCell>
              {members.map((member) => (
                <TableCell key={member.id}>
                  <ReviewStatus
                    isOwner={member.id === record.member_id}
                    review={currentReviews.find(
                      (r) => r.reviewer_id === member.id
                    )}
                  />
                </TableCell>
              ))}
              <TableCell>
                <RecordStatusBadge status={status} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
