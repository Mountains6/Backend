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
  // Domain Errors
  if (error instanceof UserAlreadyExistsError) {
    res.status(400).json({ error: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    res.status(400).json({ error: error.message });
  }
  // Zod errors (validations)
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ error: "Validation error", details: z.treeifyError(error) });
  }

  // DB errors
  const dbError = extractPgError(error);
  if (dbError) {
    return handleDbError(dbError, res);
  }

  // fallback
  return res.status(500).json({ error: "Internal Server Error" });
}

function extractPgError(error: unknown): DatabaseError | null {
  if (!error || typeof error !== "object") return null;
  if ("code" in error && typeof (error as any).code === "string") {
    return error as DatabaseError;
  }
  // {message: "asd", code: "asd"}
  // DrizzleQueryError
  // {message: "asd", cause: {code: "23505"}}
  if (
    "cause" in error &&
    error.cause &&
    typeof error.cause === "object" &&
    "code" in error.cause &&
    typeof (error.cause as any).code === "string"
  ) {
    return error.cause as DatabaseError;
  }
  return null;
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
