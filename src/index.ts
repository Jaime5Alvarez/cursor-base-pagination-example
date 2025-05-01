import { type Request, type Response, type Application } from "express";
import express from "express";
import { nextProducts } from "@/lib/queries";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger_output.json";

const app: Application = express();
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

app.get("/products", async (req: Request, res: Response) => {
  try {
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

  res.status(200).json({
    data: data,
      nextCursor: data[data.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
