import { Resend } from "resend";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn("[notify] RESEND_API_KEY not set, email notifications disabled");
}

export interface NotifyPayload {
  name: string;
  email: string;
  revenue: string;
  fix_first: string;
}

export async function notifyNewApplication(app: NotifyPayload): Promise<void> {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: "principl.ai <notifications@principl.ai>",
      to: "danny@principl.ai",
      subject: `New Revenue Residency Application: ${app.name}`,
      text: [
        `Name: ${app.name}`,
        `Email: ${app.email}`,
        `Revenue: ${app.revenue}`,
        `Would fix first: ${app.fix_first}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[notify] Failed to send email:", err);
  }
}
