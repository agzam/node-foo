import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import * as middlewares from "./middlewares";
import { handler } from "./filteredResponseHandler"
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/:formId", handler);
app.get("/", (_, res)=> {
  res.json({
    message: '/formId is missing',
  });
})

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
