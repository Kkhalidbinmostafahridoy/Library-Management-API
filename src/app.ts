import { Application } from "express";
import express, { Request, Response } from "express";
import { booksRoutes } from "./app/controlars/books.controlar";
import { borrowRouter } from "./app/controlars/borrow.controlars";

const app: Application = express();

app.use(express.json());

app.use("/api", booksRoutes);

app.use("/api", borrowRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to Library Management");
});

export default app;
