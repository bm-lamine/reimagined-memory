export const name = "auth";

export const hash = async (plain: string) => {
  return await Bun.password.hash(plain);
};

export const verify = async (plain: string, hash: string) => {
  return await Bun.password.verify(plain, hash);
};
