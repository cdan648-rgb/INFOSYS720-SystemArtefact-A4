import type {
  AIRecordRow,
  AIRecordWithReviews,
  AILevel,
  Member,
  RecordStatus,
  ReviewRow,
  TeamReadiness,
} from "@/lib/types";

export const AI_LEVEL_INFO: {
  level: AILevel;
  label: string;
  description: string;
}[] = [
  {
    level: 0,
    label: "No AI use",
    description: "No generative AI tool was used for this task.",
  },
  {
    level: 1,
    label: "Minor assistance",
    description:
      "AI was used lightly, e.g. brainstorming, wording suggestions, or minor edits.",
  },
  {
    level: 2,
    label: "AI-assisted",
    description:
      "AI meaningfully contributed to the work, but the member directed and substantially reworked the output.",
  },
  {
    level: 3,
    label: "Substantial AI assistance",
    description:
      "AI generated a large portion of the content or analysis, with member review and editing.",
  },
  {
    level: 4,
    label: "Predominantly AI-generated",
    description:
      "The output is mostly AI-generated, with minimal member modification.",
  },
];

export function getAILevelInfo(level: number) {
  return AI_LEVEL_INFO.find((info) => info.level === level) ?? null;
}

/**
 * The record owner does not review their own record, so required reviewers
 * are every other team member.
 */
export function getRequiredReviewers(
  record: AIRecordRow,
  members: Member[]
): Member[] {
  return members.filter((member) => member.id !== record.member_id);
}

export function getMissingReviewers(
  record: AIRecordRow,
  reviews: ReviewRow[],
  members: Member[]
): Member[] {
  const reviewedIds = new Set(reviews.map((review) => review.reviewer_id));
  return getRequiredReviewers(record, members).filter(
    (member) => !reviewedIds.has(member.id)
  );
}

export function calculateRecordStatus(
  record: AIRecordRow,
  reviews: ReviewRow[],
  members: Member[]
): RecordStatus {
  if (reviews.some((review) => review.decision === "non_endorsed")) {
    return "DISPUTED";
  }

  if (getMissingReviewers(record, reviews, members).length > 0) {
    return "PENDING_REVIEW";
  }

  return "COMPLETE";
}

export function calculateTeamReadiness(
  records: AIRecordWithReviews[],
  members: Member[]
): TeamReadiness {
  if (records.length === 0) {
    return "NO_RECORDS";
  }

  const allComplete = records.every(
    (record) =>
      calculateRecordStatus(record, record.reviews, members) === "COMPLETE"
  );

  return allComplete ? "READY" : "NOT_READY";
}

export function getReadinessReasons(
  records: AIRecordWithReviews[],
  members: Member[],
  labelFor: (record: AIRecordRow) => string
): string[] {
  const reasons: string[] = [];

  for (const record of records) {
    const status = calculateRecordStatus(record, record.reviews, members);
    const label = labelFor(record);

    if (status === "DISPUTED") {
      reasons.push(`Record ${label} has an unresolved non-endorsement.`);
    } else if (status === "PENDING_REVIEW") {
      for (const member of getMissingReviewers(record, record.reviews, members)) {
        reasons.push(`${member.name} has not reviewed ${label}.`);
      }
    }
  }

  return reasons;
}
