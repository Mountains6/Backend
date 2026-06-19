import { NextFunction, Request, Response } from "express";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../lib/errors";
import { DatabaseError } from "pg";
import z, { ZodError } from "zod";
import { logger } from "../lib/logger";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof UserAlreadyExistsError) {
    res.status(400).json({ error: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    res.status(400).json({ error: error.message });
  }

  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ error: "Validation error", details: z.treeifyError(error) });
  }

  if (error instanceof DatabaseError) {
    return handleDbError(error, res);
  }

  return res.status(500).json({ error: "Internal Server Error" });
}

function handleDbError(error: DatabaseError, res: Response) {
  logger.info("**** DB Errors *****");

  switch (error.code) {
    case "23505":
      return res.status(409).json({
        error: "Dublicate value",
        details: error.detail,
      });
    case "23503":
      return res.status(400).json({
        error: "Invalid reference",
        details: error.detail,
      });
    case "23502":
      return res.status(400).json({
        error: "Missing required field",
        details: error.detail,
      });
    default:
      return res.status(500).json({ error: "DB Error", code: error.code });
  }
}
