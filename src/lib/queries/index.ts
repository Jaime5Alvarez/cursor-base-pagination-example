import { factoryDrizzleClient } from "@/modules/database/infrastructure/drizzle/drizzle-client";
import {
  products,
  users,
} from "@/modules/database/infrastructure/drizzle/schema";
import { eq, and, gt, or, asc } from "drizzle-orm";

export const db = factoryDrizzleClient();
export const nextProducts = async (
  cursor?: {
    id: string;
    createdAt: Date;
  },
  pageSize: number = 5
) => {
  const query = db
    .select()
    .from(products)
    .where(
      cursor
        ? or(
            gt(products.createdAt, cursor.createdAt),
            and(
              eq(products.createdAt, cursor.createdAt),
              gt(products.id, cursor.id)
            )
          )
        : undefined
    )
    .limit(pageSize)
    .orderBy(asc(products.createdAt), asc(products.id));

  return await query;
};

export const nextUsers = async (cursor?: number, pageSize = 3) => {
  const query = db
    .select()
    .from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));

  return await query;
};
