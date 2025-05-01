import { factoryDrizzleClient } from "@/modules/database/infrastructure/drizzle/drizzle-client";
import {
  products,
  users,
} from "@/modules/database/infrastructure/drizzle/schema";
import { eq, and, gt, or, asc } from "drizzle-orm";

export const db = factoryDrizzleClient();
export const nextProducts = async (
  cursor?: {
    id: string | undefined;
    createdAt: string | undefined;
  },
  pageSize: string = "5",
) => {
  const pageSizeNumber = Number(pageSize);
  const cursorDate = cursor?.createdAt ? new Date(cursor.createdAt) : undefined;
  const cursorId = cursor?.id ? cursor.id : undefined;
  const query = await db
    .select()
    .from(products)
    .where(
      cursorId
        ? or(
            gt(products.createdAt, cursorDate as Date),
            and(
              eq(products.createdAt, cursorDate as Date),
              gt(products.id, cursorId),
            ),
          )
        : undefined,
    )
    .limit(pageSizeNumber)
    .orderBy(asc(products.createdAt), asc(products.id));

  return {
    data: query,
    nextCursor: query[query.length - 1],
    hasNext: query.length === pageSizeNumber,
  };
};

export const nextUsers = async (
  cursor?: string | undefined,
  pageSize = "3",
) => {
  const cursorNumber = cursor ? Number(cursor) : undefined;
  const pageSizeNumber = Number(pageSize);
  const query = await db
    .select()
    .from(users)
    .where(cursorNumber ? gt(users.id, cursorNumber) : undefined)
    .limit(pageSizeNumber)
    .orderBy(asc(users.id));

  return {
    data: query,
    nextCursor: query[query.length - 1]?.id,
    hasNext: query.length === pageSizeNumber,
  };
};

export const nextProductsV2 = async (
  cursor?: string | undefined,
  pageSize = "5",
) => {
  const pageSizeNumber = Number(pageSize);

  const decodedCursor = cursor
    ? Buffer.from(cursor, "base64").toString()
    : undefined;
  const cursorParts = decodedCursor
    ? (JSON.parse(decodedCursor) as { id: string; createdAt: string })
    : undefined;
  const cursorId = cursorParts?.id;
  const cursorCreatedAt = cursorParts?.createdAt
    ? new Date(cursorParts.createdAt)
    : undefined;

  const query = await db
    .select()
    .from(products)
    .where(
      cursorId
        ? or(
            gt(products.createdAt, cursorCreatedAt as Date),
            and(
              eq(products.createdAt, cursorCreatedAt as Date),
              gt(products.id, cursorId),
            ),
          )
        : undefined,
    )
    .limit(pageSizeNumber)
    .orderBy(asc(products.createdAt), asc(products.id));

  const nextCursor = query[query.length - 1];
  const nextCursorEncoded = nextCursor
    ? Buffer.from(JSON.stringify(nextCursor)).toString("base64")
    : undefined;

  return {
    data: query,
    nextCursor: nextCursorEncoded,
    hasNext: query.length === pageSizeNumber,
  };
};
