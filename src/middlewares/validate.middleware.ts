import { Request, Response, NextFunction } from 'express';
import { BaseSchema, safeParse } from 'valibot';

export const validate =
  (schema: BaseSchema<unknown, unknown, any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = safeParse(schema, req.body);

    if (!result.success) {
      const errors = result.issues.map((issue) => ({
        field: issue.path?.map((p: any) => p.key).join('.') ?? 'unknown',
        message: issue.message,
      }));
      res.status(400).json({ message: 'Datos invalidos', errors });
      return;
    }

    req.body = result.output;
    next();
  };
