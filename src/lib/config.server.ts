import { z } from "zod";
import { parseEnv } from "@/lib/config";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters. Generate one: openssl rand -base64 32"),
  // Only "console" ships today; extend this enum when wiring a real provider in
  // src/lib/email.ts.
  EMAIL_TRANSPORT: z.enum(["console"]).default("console"),
  EMAIL_FROM: z.string().min(1).default("Next BetterAuth <no-reply@localhost>"),
});

// Never import this module from a client component — these values must not reach
// the browser bundle. Parsed eagerly so a misconfigured deploy fails at startup
// rather than falling back to Better Auth's built-in development secret.
export const serverEnv = parseEnv(
  serverEnvSchema,
  {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    EMAIL_TRANSPORT: process.env.EMAIL_TRANSPORT || undefined,
    EMAIL_FROM: process.env.EMAIL_FROM || undefined,
  },
  "server"
);
