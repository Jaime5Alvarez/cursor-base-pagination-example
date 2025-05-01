import { DatabaseServiceFactory } from "@/modules/database/application/database-factory";
import * as schema from "@/modules/database/infrastructure/drizzle/schema";
import { eq, and, gt, or, asc } from "drizzle-orm";

const db = DatabaseServiceFactory().getConnection();
export const nextProducts = async (
  cursor?: {
    id: string;
    createdAt: Date;
  },
  pageSize: number = 5
) => {
  const query = db
    .select()
    .from(schema.products)
    .where(
      cursor
        ? or(
            gt(schema.products.createdAt, cursor.createdAt),
            and(
              eq(schema.products.createdAt, cursor.createdAt),
              gt(schema.products.id, cursor.id)
            )
          )
        : undefined
    )
    .limit(pageSize)
    .orderBy(asc(schema.products.createdAt), asc(schema.products.id));

  return await query;
};