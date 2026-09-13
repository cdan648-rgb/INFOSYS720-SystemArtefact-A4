import { RecordForm } from "@/components/record-form";
import { getDemoTeam, getTeamMembers } from "@/lib/data";
import { getCurrentMemberId } from "@/lib/session";

export default async function NewRecordPage() {
  const team = await getDemoTeam();
  const members = await getTeamMembers(team.id);
  const currentMemberId = await getCurrentMemberId();
  const currentMember = members.find((m) => m.id === currentMemberId)!;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Record AI Use
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a task-level AI-use record for {team.name}.
        </p>
      </div>
      <RecordForm currentMember={currentMember} />
    </div>
  );
}
