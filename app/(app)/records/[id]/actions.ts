"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRecordWithReviews } from "@/lib/data";
import { getCurrentMemberId } from "@/lib/session";

export interface SubmitReviewState {
  error?: string;
  success?: boolean;
}

export async function submitReview(
  recordId: string,
  _prevState: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  const reviewerId = await getCurrentMemberId();
  if (!reviewerId) {
    return { error: "No current user is selected. Please switch user and try again." };
  }

  const record = await getRecordWithReviews(recordId);
  if (!record) {
    return { error: "Record not found." };
  }

  if (record.member_id === reviewerId) {
    return { error: "You cannot review your own record." };
  }

  const decision = String(formData.get("decision") ?? "");
  if (decision !== "acknowledged" && decision !== "non_endorsed") {
    return { error: "Select Acknowledge or Non-Endorse." };
  }

  const comment = String(formData.get("comment") ?? "").trim();
  if (decision === "non_endorsed" && !comment) {
    return { error: "A reason is required when non-endorsing a record." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("reviews").upsert(
    {
      record_id: recordId,
      reviewer_id: reviewerId,
      record_revision: record.revision,
      decision,
      comment: comment || null,
    },
    { onConflict: "record_id,reviewer_id,record_revision" }
  );

  if (error) {
    return { error: `Failed to save review: ${error.message}` };
  }

  revalidatePath(`/records/${recordId}`);
  revalidatePath("/dashboard");
  revalidatePath("/ledger");
  revalidatePath("/declaration");
  return { success: true };
}

export interface ReviseRecordState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

export async function reviseRecord(
  recordId: string,
  _prevState: ReviseRecordState,
  formData: FormData
): Promise<ReviseRecordState> {
  const currentMemberId = await getCurrentMemberId();
  if (!currentMemberId) {
    return { error: "No current user is selected. Please switch user and try again." };
  }

  const record = await getRecordWithReviews(recordId);
  if (!record) {
    return { error: "Record not found." };
  }

  if (record.member_id !== currentMemberId) {
    return { error: "Only the record owner can revise this record." };
  }

  const taskName = String(formData.get("task_name") ?? "").trim();
  const aiLevelRaw = String(formData.get("ai_level") ?? "");
  const aiTool = String(formData.get("ai_tool") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const evidenceReference = String(formData.get("evidence_reference") ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (!taskName) fieldErrors.task_name = "Task / contribution name is required.";
  const aiLevel = Number(aiLevelRaw);
  if (aiLevelRaw === "" || Number.isNaN(aiLevel) || aiLevel < 0 || aiLevel > 4) {
    fieldErrors.ai_level = "Select an AI-use level.";
  }
  if (!description) fieldErrors.description = "Description of AI use is required.";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("ai_records")
    .update({
      task_name: taskName,
      ai_level: aiLevel,
      ai_tool: aiTool || null,
      description,
      evidence_reference: evidenceReference || null,
      revision: record.revision + 1,
    })
    .eq("id", recordId);

  if (error) {
    return { error: `Failed to save revision: ${error.message}` };
  }

  revalidatePath(`/records/${recordId}`);
  revalidatePath("/dashboard");
  revalidatePath("/ledger");
  revalidatePath("/declaration");
  return { success: true };
}
