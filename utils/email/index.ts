import { createTransport } from "nodemailer";
import otpGenerator from "otp-generator";

const transporter = createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
});

export const getOtp = (digits?: number) =>
  otpGenerator.generate(digits ?? 6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

export const sendMail = async (email: Email) =>
  await transporter.sendMail({
    from: "bilgreen",
    ...email,
  });

export type Email = {
  to: string;
  subject: string;
  html: string;
};
