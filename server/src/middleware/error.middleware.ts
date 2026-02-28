import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

// Only enable pretty transport in development (not in test/CI)
const logger = pino({
    transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined
});

export { logger };

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error({ err, url: req.url, body: req.body }, 'Unhandled error');
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({ message });
};
