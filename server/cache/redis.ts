import env from "config/env";
import { createClient } from "redis";

const client = createClient({ url: env.REDIS_URL });
client.on("error", (err) => console.error(`[REDIS]: ${err}`));

export default client;

export const keys = {
  authToken: (token: string) => `auth-token:${token}`,
  emailVerification: (token: string) => `email-verification:${token}`,
  passwordReset: (token: string) => `password-reset:${token}`,
};
