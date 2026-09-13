import { DemoUserSelector } from "@/components/demo-user-selector";
import { AppNav } from "@/components/app-nav";
import { getDemoTeam, getTeamMembers } from "@/lib/data";
import { getCurrentMemberId } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const team = await getDemoTeam();
  const members = await getTeamMembers(team.id);
  const currentMemberId = await getCurrentMemberId();
  const currentMember = members.find((m) => m.id === currentMemberId);

  if (!currentMember) {
    return <DemoUserSelector members={members} />;
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-muted/20">
      <AppNav team={team} members={members} currentMemberId={currentMember.id} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
