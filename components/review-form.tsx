"use client";

import { useActionState, useState } from "react";
import { submitReview, type SubmitReviewState } from "@/app/(app)/records/[id]/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ReviewDecision } from "@/lib/types";

const initialState: SubmitReviewState = {};

export function ReviewForm({
  recordId,
  existingDecision,
  existingComment,
}: {
  recordId: string;
  existingDecision?: ReviewDecision;
  existingComment?: string | null;
}) {
  const submitReviewForRecord = submitReview.bind(null, recordId);
  const [state, formAction, isPending] = useActionState(
    submitReviewForRecord,
    initialState
  );
  const [decision, setDecision] = useState<ReviewDecision>(
    existingDecision ?? "acknowledged"
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <Alert className="border-destructive/40 bg-destructive/5 text-destructive">
          <AlertDescription className="text-destructive">
            {state.error}
          </AlertDescription>
        </Alert>
      )}
      {state?.success && (
        <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          <AlertDescription>Your review has been saved.</AlertDescription>
        </Alert>
      )}

      <RadioGroup
        name="decision"
        value={decision}
        onValueChange={(value) => setDecision(value as ReviewDecision)}
      >
        <label className="flex items-start gap-2.5 rounded-lg border border-border p-2.5 has-data-checked:border-primary">
          <RadioGroupItem value="acknowledged" className="mt-0.5" />
          <span>
            <span className="block text-sm font-medium text-foreground">
              Acknowledge
            </span>
            <span className="block text-xs text-muted-foreground">
              I have seen this AI-use record and accept it as part of the
              team&apos;s account.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2.5 rounded-lg border border-border p-2.5 has-data-checked:border-primary">
          <RadioGroupItem value="non_endorsed" className="mt-0.5" />
          <span>
            <span className="block text-sm font-medium text-foreground">
              Non-Endorse
            </span>
            <span className="block text-xs text-muted-foreground">
              I have seen this record but do not currently endorse this
              account.
            </span>
          </span>
        </label>
      </RadioGroup>

      {decision === "non_endorsed" && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="comment">Reason for non-endorsement</Label>
          <Textarea
            id="comment"
            name="comment"
            required
            defaultValue={existingComment ?? ""}
            placeholder="e.g. The AI-use level appears understated."
          />
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Saving..." : "Submit review"}
      </Button>
    </form>
  );
}
