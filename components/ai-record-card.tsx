import { Card, CardContent } from "@/components/ui/card";
import { AILevelBadge } from "@/components/ai-level-badge";
import type { AIRecordRow, Member } from "@/lib/types";

export function AIRecordCard({
  record,
  owner,
}: {
  record: AIRecordRow;
  owner: Member | undefined;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            {record.task_name}
          </h2>
          <AILevelBadge level={record.ai_level} />
        </div>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Responsible member</dt>
            <dd className="text-foreground">{owner?.name ?? "Unknown"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">AI tool</dt>
            <dd className="text-foreground">{record.ai_tool || "Not specified"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Description of AI use</dt>
            <dd className="text-foreground whitespace-pre-wrap">
              {record.description}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Evidence reference</dt>
            <dd className="text-foreground">
              {record.evidence_reference || "No evidence provided"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Created</dt>
            <dd className="text-foreground">
              {new Date(record.created_at).toLocaleString()}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
