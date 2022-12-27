import express, { Express, Request, Response } from "express";
import requestLogger from "./middlewares/request-logger";
import cors from "cors";
import { CORS_OPTIONS } from "./configs/cors";
import { CompressDraco } from "./services/compressDraco";

const app: Express = express();
const port = process.env.PORT;

app.use(cors(CORS_OPTIONS));
app.use(requestLogger);

app.get("/", (req: Request, res: Response) => {
  CompressDraco();
  res.status(200);
  res.send("test failed");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
