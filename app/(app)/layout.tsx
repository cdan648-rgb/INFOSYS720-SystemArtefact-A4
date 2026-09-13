import { DemoUserSelector } from "@/components/demo-user-selector";
import { AppNav } from "@/components/app-nav";
import { getDemoTeam, getTeamMembers } from "@/lib/data";
import { getCurrentMemberId } from "@/lib/session";

// This app is entirely per-request (cookie-gated demo user, live Supabase
// data) and must never be statically prerendered or have its data fetched
// at build time — force-dynamic guarantees Next skips any build-time
// render attempt for every page under this layout.
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentMemberId = await getCurrentMemberId();
  const team = await getDemoTeam();
  const members = await getTeamMembers(team.id);
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
