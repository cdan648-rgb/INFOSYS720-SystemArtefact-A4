import { Badge } from "@/components/ui/badge";
import { getAILevelInfo } from "@/lib/accountability";

export function AILevelBadge({ level }: { level: number }) {
  const info = getAILevelInfo(level);
  return (
    <Badge variant="outline">
      Level {level} &mdash; {info?.label ?? "Unknown"}
    </Badge>
  );
}
