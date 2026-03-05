import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateBody = (schema: ZodSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ errors: err.flatten().fieldErrors });
            }
            next(err);
        }
    };
};
