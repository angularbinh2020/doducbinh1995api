import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import requestLogger from "./middlewares/request-logger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(requestLogger);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server 11");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
