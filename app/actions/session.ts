"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CURRENT_MEMBER_COOKIE } from "@/lib/session";

export async function switchUser(memberId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CURRENT_MEMBER_COOKIE, memberId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect("/dashboard");
}
