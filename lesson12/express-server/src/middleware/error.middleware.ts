import { NextFunction, Request, Response } from "express";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../lib/errors";
import z, { ZodError } from "zod";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Domain Errors
  if (error instanceof UserAlreadyExistsError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    return res.status(400).json({ error: error.message });
  }
  // Zod errors (validations)
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ error: "Validation error", details: z.treeifyError(error) });
  }
  // DB errors

  // fallback
  return res.status(500).json({ error: "Internal Server Error" });
}
