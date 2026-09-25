import { z } from "zod";
import { parseEnv } from "@/lib/config";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters. Generate one: openssl rand -base64 32"),
});

// Never import this module from a client component — these values must not reach
// the browser bundle. Parsed eagerly so a misconfigured deploy fails at startup
// rather than falling back to Better Auth's built-in development secret.
export const serverEnv = parseEnv(
  serverEnvSchema,
  {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
  "server"
);
