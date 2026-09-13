import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  FileCheck2,
  ShieldAlert,
  Users,
} from "lucide-react";

const CAPABILITIES = [
  {
    icon: ClipboardList,
    title: "Task-level, graduated recording",
    description:
      "AI use is logged against a specific task with a 0-4 level, not a single yes/no declaration for the whole group.",
  },
  {
    icon: Users,
    title: "Member attribution",
    description:
      "Every record identifies the team member responsible for that contribution.",
  },
  {
    icon: FileCheck2,
    title: "Peer acknowledgement",
    description:
      "Other members review each record and either acknowledge it or non-endorse it with a reason.",
  },
  {
    icon: ShieldAlert,
    title: "Records-derived declaration",
    description:
      "The final AI declaration is generated automatically from the underlying records and review states.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            INFOSYS 720 &middot; Research Prototype
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Team AI Accountability
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Make AI use visible, attributable and accountable within
            collaborative assessment.
          </p>
        </div>

        <div className="grid w-full gap-4 text-left sm:grid-cols-2">
          {CAPABILITIES.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardContent className="flex flex-col gap-2">
                <Icon className="size-5 text-primary" />
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/dashboard">Open Demo</Link>}
        />
      </main>
    </div>
  );
}
