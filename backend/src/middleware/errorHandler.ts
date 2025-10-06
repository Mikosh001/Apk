import type { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (res.headersSent) {
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
};
