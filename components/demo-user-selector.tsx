import { switchUser } from "@/app/actions/session";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Member } from "@/lib/types";

export function DemoUserSelector({ members }: { members: Member[] }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Continue as</CardTitle>
          <CardDescription>
            Select which team member you are for this session. This stands in
            for real authentication in the prototype.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {members.map((member) => (
            <form key={member.id} action={switchUser.bind(null, member.id)}>
              <Button type="submit" variant="outline" className="w-full justify-start">
                {member.name}
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
