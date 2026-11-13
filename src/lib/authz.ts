import "server-only";
import type { Session } from "next-auth";
import { auth } from "@/auth";

export function isAdminSession(session: Session | null) {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();
  return Boolean(configuredEmail && sessionEmail && configuredEmail === sessionEmail);
}

export async function isAdmin() {
  return isAdminSession(await auth());
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}
