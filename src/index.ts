import { type Request, type Response, type Application } from "express";
import express from "express";
import { DatabaseServiceFactory } from "./modules/database/application/database-factory";
import * as schema from "./modules/database/infrastructure/drizzle/schema";
import { eq, and, gt, or, asc } from "drizzle-orm";
const db = DatabaseServiceFactory().getConnection();
const nextProducts = async (cursor?: {
  id: string;
  createdAt: Date;
}, pageSize: number = 10) => {
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
  const { cursor } = req.query as { cursor?: {
    id: string;
    createdAt: Date;
  } };
  const { pageSize } = req.query;
  console.log(cursor, pageSize);


  res.json(await nextProducts());
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
