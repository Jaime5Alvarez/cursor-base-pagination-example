import { type Request, type Response, type Application } from "express";
import express from "express";
import { nextProducts, nextUsers } from "@/lib/queries";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger_output.json";
import cors from "cors";

const app: Application = express();
app.use(express.json());
app.use(cors());

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

    const { data, nextCursor, hasNext } = await nextProducts(
      { id: productId, createdAt: createdAt },
      pageSize,
    );

    res.status(200).json({
      data: data,
      nextCursor: nextCursor,
      hasNext: hasNext,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const { userId, pageSize } = req.query as {
      userId?: string;
      pageSize?: string;
    };

    const { data, nextCursor, hasNext } = await nextUsers(userId, pageSize);

    res.status(200).json({
      data: data,
      nextCursor: nextCursor,
      hasNext: hasNext,
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
