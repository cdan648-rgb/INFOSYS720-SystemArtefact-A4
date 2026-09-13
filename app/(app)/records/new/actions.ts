"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDemoTeam } from "@/lib/data";
import { getCurrentMemberId } from "@/lib/session";

export interface CreateRecordState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createAiRecord(
  _prevState: CreateRecordState,
  formData: FormData
): Promise<CreateRecordState> {
  const memberId = await getCurrentMemberId();
  if (!memberId) {
    return { error: "No current user is selected. Please switch user and try again." };
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

  const team = await getDemoTeam();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("ai_records").insert({
    team_id: team.id,
    member_id: memberId,
    task_name: taskName,
    ai_level: aiLevel,
    ai_tool: aiTool || null,
    description,
    evidence_reference: evidenceReference || null,
  });

  if (error) {
    return { error: `Failed to save record: ${error.message}` };
  }

  revalidatePath("/dashboard");
  revalidatePath("/ledger");
  revalidatePath("/declaration");
  redirect("/ledger?status=created");
}
