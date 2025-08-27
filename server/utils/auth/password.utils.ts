import { password } from "bun";

export default class {
  static async hash(p: string) {
    return await password.hash(p);
  }

  static async verify(p: string, h: string) {
    return await password.verify(p, h);
  }
}
