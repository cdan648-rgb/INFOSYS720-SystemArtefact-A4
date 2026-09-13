import { AccountabilityMatrix } from "@/components/accountability-matrix";
import { ReadinessBanner } from "@/components/readiness-banner";
import { TeamStatusCard } from "@/components/team-status-card";
import {
  calculateRecordStatus,
  calculateTeamReadiness,
  getReadinessReasons,
} from "@/lib/accountability";
import { getDemoTeam, getRecordsWithReviews, getTeamMembers, toRecordLabel } from "@/lib/data";

export default async function DashboardPage() {
  const team = await getDemoTeam();
  const [members, records] = await Promise.all([
    getTeamMembers(team.id),
    getRecordsWithReviews(team.id),
  ]);

  const readiness = calculateTeamReadiness(records, members);
  const reasons = getReadinessReasons(records, members, (record) =>
    toRecordLabel(record, records)
  );

  const statuses = records.map((r) => calculateRecordStatus(r, r.reviews, members));
  const complete = statuses.filter((s) => s === "COMPLETE").length;
  const pending = statuses.filter((s) => s === "PENDING_REVIEW").length;
  const disputed = statuses.filter((s) => s === "DISPUTED").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">
          {team.course_name} &middot; {team.assignment_name}
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Team Accountability Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Team: {team.name} ({members.map((m) => m.name).join(", ")})
        </p>
      </div>

      <ReadinessBanner readiness={readiness} reasons={reasons} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TeamStatusCard label="Total AI-use records" value={records.length} />
        <TeamStatusCard label="Complete" value={complete} />
        <TeamStatusCard label="Pending Review" value={pending} />
        <TeamStatusCard label="Disputed" value={disputed} />
      </div>

      <div className="rounded-xl border bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Accountability Matrix
        </h2>
        <AccountabilityMatrix records={records} members={members} />
      </div>
    </div>
  );
}
