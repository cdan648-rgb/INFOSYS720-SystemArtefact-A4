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
      decision,
      comment: comment || null,
    },
    { onConflict: "record_id,reviewer_id" }
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
