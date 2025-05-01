import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../infrastructure/drizzle/schema";

export interface IDatabaseClient {
  getClient(): PostgresJsDatabase<typeof schema>;
}

export interface IDatabaseService {
  getConnection(): PostgresJsDatabase<typeof schema>;
}
