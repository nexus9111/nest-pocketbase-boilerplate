import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createLogger, transports, format } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV !== 'test') {
      const originalUrl = req.originalUrl;
      const method = req.method;
      const date = new Date().toLocaleString();

      // Create a new Winston Logger (json format and only in console)
      const logger = createLogger({
        transports: [
          new transports.Console({
            format: format.combine(format.json()),
          }),
        ],
      });

      // Log the request
      logger.info({
        date,
        method,
        originalUrl,
      });
    }

    // Ends middleware function execution, hence allowing to move on
    if (next) {
      next();
    }
  }
}
