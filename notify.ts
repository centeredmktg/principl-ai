import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NotifyPayload {
  name: string;
  email: string;
  revenue: string;
  fix_first: string;
}

export async function notifyNewApplication(app: NotifyPayload): Promise<void> {
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
