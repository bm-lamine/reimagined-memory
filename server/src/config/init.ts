import client from "#/src/cache/redis";

export async function bootstrap() {
  console.log("Connecting to Redis...");
  await client.connect();
}
