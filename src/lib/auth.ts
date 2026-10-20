import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { env, MIN_PASSWORD_LENGTH } from "@/lib/config";
import { serverEnv } from "@/lib/config.server";
import { sendEmail } from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: serverEnv.AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_SITE_URL,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    // Unverified users cannot create a session. Sign-up returns no session and the
    // UI shows a "check your email" state instead. The seeded admin is created with
    // emailVerified: true, so it is unaffected.
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Someone requested a password reset for this account.\n\nReset it here (valid for 1 hour):\n${url}\n\nIf this wasn't you, ignore this email.`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    // Resends are explicit (the "Resend verification email" button on /login)
    // rather than triggered by every failed sign-in attempt.
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Confirm your email address to finish setting up your account (link valid for 1 hour):\n${url}`,
      });
    },
  },
  rateLimit: {
    // Better Auth only enables this in production by default; enabling it
    // everywhere keeps local behavior identical to deployed behavior.
    enabled: true,
    // In-memory storage is per-process. Behind multiple instances or on
    // serverless, switch to "database" (needs a RateLimit model) or
    // "secondary-storage" (e.g. Redis) so limits are shared.
    storage: "memory",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
      "/request-password-reset": { window: 300, max: 3 },
      "/reset-password": { window: 300, max: 5 },
      "/send-verification-email": { window: 300, max: 3 },
    },
  },
});
