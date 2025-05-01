import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import * as schema from "@/modules/database/infrastructure/drizzle/schema";

import { type IDatabaseService } from "@/modules/database/domain/interfaces";
import { DrizzleClient } from "@/modules/database/infrastructure/drizzle/drizzle-client";

export class DatabaseService implements IDatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getConnection(): PostgresJsDatabase<typeof schema> {
    return DrizzleClient.getInstance();
  }
}
