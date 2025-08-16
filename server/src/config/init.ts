import client from "#/cache/redis";
import { db } from "#/database";

export async function bootstrap() {
  console.log("Connecting to Redis...");
  await client.connect();

  console.log("Connecting to Database...");
  await db.execute(`SELECT 1`);
}
