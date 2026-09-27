import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const message = err.issues.map((i) => i.message).join(", ");
    return res.status(400).json({ message });
  }

  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: err.message ?? "Lỗi hệ thống" });
}
