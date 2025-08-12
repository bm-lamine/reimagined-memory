import { env } from "#/src/env";
import { createClient } from "redis";

const client = createClient({ url: env.REDIS_URL });

await client.connect();

client.on("error", (err) => console.error(`[REDIS]: ${err}`));

export default client;
