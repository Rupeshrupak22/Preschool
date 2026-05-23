import nodemailer from "nodemailer";

type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(input: EmailInput) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log(`[mail:dev] ${input.subject} -> ${input.to}`);
    return { queued: true, mode: "dev" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "ADYAPAN <hello@adyapan.com>",
    ...input
  });

  return { queued: true, mode: "smtp" };
}
