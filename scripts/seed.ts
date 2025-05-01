import { DATABASE_URL } from "@/config/server-constants";
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import * as schema from "@/modules/database/infrastructure/drizzle/schema";
const db = drizzle(DATABASE_URL);

await seed(db, schema, { count: 1000 });
