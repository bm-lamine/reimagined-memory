import client from "#/cache/redis";
import type { VerificationType } from "#/types/auth";

export default class VerificationRepo {
  static readonly duration = 15 * 60;

  static async get(type: VerificationType, email: string) {
    return await client.get(`${type}:${email}`);
  }

  static async store(type: VerificationType, email: string, token: string) {
    await client.setEx(`${type}:${email}`, this.duration, token);
  }

  static async invalidate(type: VerificationType, email: string) {
    await client.del(`${type}:${email}`);
  }
}
