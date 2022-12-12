import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import requestLogger from "./middlewares/request-logger";
import { createRoleTable } from "./database/role-table";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(requestLogger);

app.get("/", (req: Request, res: Response) => {
  createRoleTable()
    .then(() => {
      res.send("Create success");
    })
    .catch(() => {
      res.send("Create failed");
    });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
