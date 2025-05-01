import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});
