import cors from "cors";
import express from "express";
import { env } from "../../config/env";
import { routes } from "../../../interface-adapters/routes";
import { errorHandler } from "../../../interface-adapters/middlewares/errorHandler";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: false,
  }),
);
app.use(express.json());

app.use(routes);
app.use(errorHandler);

