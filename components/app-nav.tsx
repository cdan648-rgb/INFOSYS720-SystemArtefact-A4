import Link from "next/link";
import { UserSwitcher } from "@/components/user-switcher";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Member, Team } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/records/new", label: "Record AI Use" },
  { href: "/ledger", label: "Team Ledger" },
  { href: "/declaration", label: "Declaration" },
];

export function AppNav({
  team,
  members,
  currentMemberId,
}: {
  team: Team;
  members: Member[];
  currentMemberId: string;
}) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/dashboard" className="font-semibold text-foreground">
            {team.course_name} &middot; {team.name}
          </Link>
          <nav className="flex flex-wrap gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" })
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <UserSwitcher members={members} currentMemberId={currentMemberId} />
      </div>
    </header>
  );
}
