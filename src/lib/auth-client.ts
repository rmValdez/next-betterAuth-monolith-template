import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/config";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : env.NEXT_PUBLIC_SITE_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
