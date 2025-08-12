import { AuthSchema, VerifyEmailSchema } from "./schema/auth";

const hash = async (plain: string) => {
  return await Bun.password.hash(plain, "bcrypt");
};

const verify = async (plain: string, hash: string) => {
  return await Bun.password.verify(plain, hash, "bcrypt");
};

type Auth = {
  userId: string;
  email: string;
  verified: boolean;
};

export { AuthSchema, hash, verify, VerifyEmailSchema, type Auth };
