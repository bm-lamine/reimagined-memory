export default class Password {
  static hash = async (plain: string) => {
    return await Bun.password.hash(plain, "bcrypt");
  };

  static verify = async (plain: string, hash: string) => {
    return await Bun.password.verify(plain, hash, "bcrypt");
  };
}
