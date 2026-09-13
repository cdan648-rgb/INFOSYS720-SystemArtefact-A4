"use client";

import { useActionState } from "react";
import { createAiRecord, type CreateRecordState } from "@/app/(app)/records/new/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AI_LEVEL_INFO } from "@/lib/accountability";
import type { Member } from "@/lib/types";

const initialState: CreateRecordState = {};

export function RecordForm({ currentMember }: { currentMember: Member }) {
  const [state, formAction, isPending] = useActionState(
    createAiRecord,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <Alert className="border-destructive/40 bg-destructive/5 text-destructive">
          <AlertDescription className="text-destructive">
            {state.error}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-1.5">
        <Label>Current member</Label>
        <Input value={currentMember.name} disabled readOnly />
        <p className="text-xs text-muted-foreground">
          Records are attributed to the current demo user automatically.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="task_name">Task / contribution name</Label>
        <Input id="task_name" name="task_name" placeholder="e.g. Literature review draft" required />
        {state?.fieldErrors?.task_name && (
          <p className="text-xs text-destructive">{state.fieldErrors.task_name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>AI-use level</Label>
        <RadioGroup name="ai_level" required className="gap-3">
          {AI_LEVEL_INFO.map((info) => (
            <label
              key={info.level}
              className="flex items-start gap-2.5 rounded-lg border border-border p-2.5 has-data-checked:border-primary"
            >
              <RadioGroupItem value={String(info.level)} className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium text-foreground">
                  {info.level} &mdash; {info.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {info.description}
                </span>
              </span>
            </label>
          ))}
        </RadioGroup>
        {state?.fieldErrors?.ai_level && (
          <p className="text-xs text-destructive">{state.fieldErrors.ai_level}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ai_tool">AI tool</Label>
        <Input id="ai_tool" name="ai_tool" placeholder="e.g. ChatGPT, Claude, Copilot (optional)" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description of AI use</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe how AI was used for this task"
          required
        />
        {state?.fieldErrors?.description && (
          <p className="text-xs text-destructive">{state.fieldErrors.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="evidence_reference">Evidence reference</Label>
        <Input
          id="evidence_reference"
          name="evidence_reference"
          placeholder="Link, prompt reference, or note (optional)"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save record"}
      </Button>
    </form>
  );
}
