import otpGenerator from "otp-generator";

export const createOtp = (digits?: number) =>
  otpGenerator.generate(digits ?? 6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
