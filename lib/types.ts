import type { Database } from "@/lib/supabase/database.types";

export type Team = Database["public"]["Tables"]["teams"]["Row"];
export type Member = Database["public"]["Tables"]["members"]["Row"];
export type AIRecordRow = Database["public"]["Tables"]["ai_records"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export type AILevel = 0 | 1 | 2 | 3 | 4;

export type ReviewDecision = "acknowledged" | "non_endorsed";

export type RecordStatus = "PENDING_REVIEW" | "DISPUTED" | "COMPLETE";

export type TeamReadiness = "READY" | "NOT_READY" | "NO_RECORDS";

export interface AIRecordWithReviews extends AIRecordRow {
  reviews: ReviewRow[];
}
