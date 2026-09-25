import { z } from "zod";

// Shared by the Better Auth server config and the sign-up form, so client-side
// validation cannot disagree with the server's floor.
export const MIN_PASSWORD_LENGTH = 8;

export function parseEnv<T extends z.ZodTypeAny>(schema: T, input: unknown, scope: string) {
  const result = schema.safeParse(input);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid ${scope} environment variables:\n${issues}`);
  }

  return result.data as z.infer<T>;
}

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
});

// Referenced as literals, not iterated: Next.js only inlines `process.env.NEXT_PUBLIC_*`
// into the client bundle for statically analyzable member expressions.
export const env = parseEnv(
  clientEnvSchema,
  {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
  },
  "client"
);
