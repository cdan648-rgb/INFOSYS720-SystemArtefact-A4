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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { calculateRecordStatus } from "@/lib/accountability";
import { getDemoTeam, getRecordsWithReviews, getTeamMembers, toRecordLabel } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { RecordStatus } from "@/lib/types";

const FILTERS: { key: "all" | "pending" | "complete" | "disputed"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "complete", label: "Complete" },
  { key: "disputed", label: "Disputed" },
];

const FILTER_TO_STATUS: Record<string, RecordStatus> = {
  pending: "PENDING_REVIEW",
  complete: "COMPLETE",
  disputed: "DISPUTED",
};

export default async function LedgerPage({
  searchParams,
}: PageProps<"/ledger">) {
  const { filter = "all", status: statusParam } = await searchParams;
  const activeFilter = Array.isArray(filter) ? filter[0] : filter;

  const team = await getDemoTeam();
  const [members, records] = await Promise.all([
    getTeamMembers(team.id),
    getRecordsWithReviews(team.id),
  ]);

  const filteredRecords = records.filter((record) => {
    if (activeFilter === "all" || !activeFilter) return true;
    const targetStatus = FILTER_TO_STATUS[activeFilter];
    return calculateRecordStatus(record, record.reviews, members) === targetStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Shared Team AI Ledger
        </h1>
        <p className="text-sm text-muted-foreground">
          Every AI-use record for {team.name}, visible to the whole team.
        </p>
      </div>

      {statusParam === "created" && (
        <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          <AlertDescription>AI-use record saved successfully.</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-1">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/ledger" : `/ledger?filter=${f.key}`}
            className={cn(
              buttonVariants({
                variant: activeFilter === f.key || (f.key === "all" && !activeFilter) ? "default" : "outline",
                size: "sm",
              })
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {filteredRecords.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matching records.</p>
      ) : (
        <div className="rounded-xl border bg-card p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>AI Level</TableHead>
                <TableHead>Tool</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => {
                const owner = members.find((m) => m.id === record.member_id);
                const recordStatus = calculateRecordStatus(record, record.reviews, members);
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
                    <TableCell>{record.ai_tool || "—"}</TableCell>
                    <TableCell>
                      {record.evidence_reference ? "Provided" : "None"}
                    </TableCell>
                    <TableCell>
                      <RecordStatusBadge status={recordStatus} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
