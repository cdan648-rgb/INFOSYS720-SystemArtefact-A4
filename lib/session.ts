import { cookies } from "next/headers";

export const CURRENT_MEMBER_COOKIE = "demo_member_id";

export async function getCurrentMemberId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CURRENT_MEMBER_COOKIE)?.value ?? null;
}
