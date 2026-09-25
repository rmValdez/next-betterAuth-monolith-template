import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type CurrentSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}

// Verifies against the database rather than trusting cookie presence, so a revoked
// or expired session cannot render protected markup.
export async function requireAuth(): Promise<CurrentSession> {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}
