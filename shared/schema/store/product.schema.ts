import * as drizzleZod from "drizzle-zod";
import * as database from "server/src/database";

export default class {
  static readonly create = drizzleZod
    .createInsertSchema(database.schema.products)
    .omit({
      id: true,
      userId: true,
    });

  static readonly update = drizzleZod
    .createUpdateSchema(database.schema.products)
    .omit({
      id: true,
      userId: true,
    });
}
