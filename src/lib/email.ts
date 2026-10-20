import { env } from "@/lib/config";
import { serverEnv } from "@/lib/config.server";

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Server-only. The only transport shipped is "console": it prints the message
// (including any verification/reset link) to the server log so the auth flows
// can be exercised locally without an email provider.
//
// To send real email, add a transport here (e.g. Resend, Postmark, SES, or SMTP
// via nodemailer), add its name to EMAIL_TRANSPORT in config.server.ts along
// with any credentials it needs, and branch on it below.
export async function sendEmail(message: EmailMessage): Promise<void> {
  switch (serverEnv.EMAIL_TRANSPORT) {
    case "console":
      return logToConsole(message);
  }
}

function logToConsole({ to, subject, text }: EmailMessage) {
  // Printing auth links into production logs would hand account takeover to
  // anyone with log access, so outside development the body is withheld and the
  // missing transport is reported instead. Not thrown: Better Auth awaits some
  // senders inline, and a throw there would fail sign-up after the user row exists.
  if (env.NODE_ENV === "production") {
    console.error(
      `[email] No email transport configured — message "${subject}" to ${to} was NOT delivered. ` +
        "Configure a provider in src/lib/email.ts."
    );
    return;
  }

  console.info(
    [
      "",
      "──────────────── [email: console transport] ────────────────",
      `From:    ${serverEnv.EMAIL_FROM}`,
      `To:      ${to}`,
      `Subject: ${subject}`,
      "",
      text,
      "────────────────────────────────────────────────────────────",
      "",
    ].join("\n")
  );
}
