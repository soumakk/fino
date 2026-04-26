import { Resend } from "resend";
import { HTTPException } from "hono/http-exception";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  name: string,
  email: string,
  token: string,
) {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Fino <onboarding@resend.dev>",
    to: email,
    subject: "",
    html: `
      <h2>${name}</h2>
      <p>Thanks for signing up. Click the link below to verify your email.</p>
      <a href="${verifyLink}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });

  if (error) {
    throw new HTTPException(403, { message: "Failed to send email" });
  }

  return data;
}
