"use client";

import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { switchUser } from "@/app/actions/session";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Member } from "@/lib/types";

export function UserSwitcher({
  members,
  currentMemberId,
}: {
  members: Member[];
  currentMemberId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const currentMember = members.find((m) => m.id === currentMemberId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" disabled={isPending}>
            <span className="text-muted-foreground">Current user:</span>{" "}
            {currentMember?.name ?? "Unknown"}
            <ChevronDown className="opacity-60" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch user</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {members.map((member) => (
            <DropdownMenuItem
              key={member.id}
              disabled={member.id === currentMemberId}
              onClick={() => startTransition(() => switchUser(member.id))}
            >
              {member.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
