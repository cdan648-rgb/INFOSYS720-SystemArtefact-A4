import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AIRecordRow,
  AIRecordWithReviews,
  Member,
  Team,
} from "@/lib/types";

export async function getDemoTeam(): Promise<Team> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load demo team: ${error?.message}`);
  }

  return data;
}

export async function getTeamMembers(teamId: string): Promise<Member[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load team members: ${error.message}`);
  }

  return data ?? [];
}

export async function getRecordsWithReviews(
  teamId: string
): Promise<AIRecordWithReviews[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_records")
    .select("*, reviews(*)")
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load AI-use records: ${error.message}`);
  }

  return data ?? [];
}

export async function getRecordWithReviews(
  id: string
): Promise<AIRecordWithReviews | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_records")
    .select("*, reviews(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load AI-use record: ${error.message}`);
  }

  return data;
}

/**
 * Records have UUID primary keys, so a stable "AI-001"-style display label
 * is computed from chronological position within the team, not stored.
 */
export function toRecordLabel(
  record: AIRecordRow,
  allRecords: AIRecordRow[]
): string {
  const index = allRecords.findIndex((r) => r.id === record.id);
  const position = index === -1 ? allRecords.length : index;
  return `AI-${String(position + 1).padStart(3, "0")}`;
}
