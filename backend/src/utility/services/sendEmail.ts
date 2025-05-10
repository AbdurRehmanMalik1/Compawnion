import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";
import HttpExceptions from "../exceptions/HttpExceptions";
import { config } from "../../config";

interface SendMailOptions {
  subject: string;
  message: string;
  send_to: string;
  sent_from?: string;
  reply_to?: string;
  attachments?: Attachment[];
}

export const sendMail = async ({
  subject,
  message,
  send_to,
  sent_from,
  reply_to,
  attachments,
}: SendMailOptions): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: config.email.auth,
  });

  const mailOptions = {
    from: sent_from || config.email.defaultFrom,
    to: send_to,
    subject,
    html: message,
    ...(reply_to ? { replyTo: reply_to } : {}),
    ...(attachments ? { attachments } : {}),
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    throw HttpExceptions.CustomError(
      500,
      (err as Error).message || "Error sending mail"
    );
  }
};

interface SendOTPOptions {
  email: string;
  otpCode: string;
  purpose?: "signup" | "mfa" | "login" | string;
  from?: string;
  expiresIn?: number;
}

export const sendOTPEmail = async ({
  email,
  otpCode,
  purpose = "verification",
  from,
  expiresIn = config.otp.expiresIn,
}: SendOTPOptions): Promise<boolean> => {
  const subject = `Your OTP Code for ${purpose}`;
  const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Verify your ${purpose}</h2>
      <p>Use the OTP below to complete your ${purpose} process:</p>
      <p style="font-size: 24px; font-weight: bold;">${otpCode}</p>
      <p>This code will expire in ${expiresIn} minutes. Do not share it with anyone.</p>
    </div>
  `;

  return await sendMail({
    subject,
    message,
    send_to: email,
    sent_from: from,
  });
};
