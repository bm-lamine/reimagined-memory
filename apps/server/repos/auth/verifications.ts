import client from "#/infrastructure/redis";

export default class {
  static readonly duration = 15 * 60;

  static async get(type: Type, email: string) {
    return await client.get(`${type}:${email}`);
  }

  static async store(type: Type, email: string, token: string) {
    await client.setEx(`${type}:${email}`, this.duration, token);
  }

  static async invalidate(type: Type, email: string) {
    await client.del(`${type}:${email}`);
  }
}

export type Type = "email-verification" | "password-reset";
