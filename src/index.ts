import { type Request, type Response, type Application } from "express";
import express from "express";
import { DatabaseServiceFactory } from "./modules/database/application/database-factory";
import * as schema from "./modules/database/infrastructure/drizzle/schema";
import { eq, and, gt, or, asc } from "drizzle-orm";
const db = DatabaseServiceFactory().getConnection();
const nextProducts = async (
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
const app: Application = express();
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

app.get("/products", async (req: Request, res: Response) => {
  const { productId, createdAt, pageSize } = req.query as {
    productId?: string;
    createdAt?: string;
    pageSize?: string;
  };
  
  let cursor = undefined;
  if (productId && createdAt) {
    cursor = {
      id: productId,
      createdAt: new Date(createdAt),
    };
  }
  let pageSizeNumber = undefined;
  if (pageSize) {
    pageSizeNumber = Number(pageSize);
  }

  const data = await nextProducts(cursor, pageSizeNumber);

  res.json({
    data: data,
    nextCursor: data[data.length - 1],
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
