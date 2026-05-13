import express, { Request, Response, NextFunction } from "express";
import { checkApiKey } from "./middleware/check-api-key";

const app = express();

app.use(express.json());

app.get("/secure", checkApiKey, (_req, res) => {
  res.status(200).json("Access granted");
});

export default app;
