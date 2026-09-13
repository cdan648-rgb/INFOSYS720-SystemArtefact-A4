import { DeclarationRecord } from "@/components/declaration-record";
import { ReadinessBanner } from "@/components/readiness-banner";
import { calculateTeamReadiness, getReadinessReasons } from "@/lib/accountability";
import { getDemoTeam, getRecordsWithReviews, getTeamMembers, toRecordLabel } from "@/lib/data";

export default async function DeclarationPage() {
  const team = await getDemoTeam();
  const [members, records] = await Promise.all([
    getTeamMembers(team.id),
    getRecordsWithReviews(team.id),
  ]);

  const readiness = calculateTeamReadiness(records, members);
  const reasons = getReadinessReasons(records, members, (record) =>
    toRecordLabel(record, records)
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Generated Team AI Declaration
        </h1>
        <p className="text-sm text-muted-foreground">
          {team.course_name} &middot; {team.assignment_name} &middot; {team.name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          This declaration is generated automatically from the team&apos;s
          AI-use records and review states below &mdash; it is never
          manually typed.
        </p>
      </div>

      <ReadinessBanner readiness={readiness} reasons={reasons} />

      {records.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No AI-use records have been created yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {records.map((record) => (
            <DeclarationRecord
              key={record.id}
              record={record}
              label={toRecordLabel(record, records)}
              members={members}
            />
          ))}
        </div>
      )}
    </div>
  );
}
