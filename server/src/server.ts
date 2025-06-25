import cors from 'cors';
import express from 'express';
import { config } from './config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import router from './routes';
import ErrorMiddleware from './middlewares/Error.middleware';
import prisma from './db';
import path from 'path';
import { readFileSync } from 'fs';

export const app = express();

const main = async () => {
  app.use(express.json());

  app.use(cookieParser());

  app.use(cors({ credentials: true, origin: config.cors }));

  app.use(morgan('dev'));

  app.use('/api', router);

  if (config.staticPath) {
    const index = readFileSync(path.join(config.staticPath, 'index.html'), 'utf-8').replace(
      '<head>',
      `<head><base href="${config.baseUrl}" />`,
    );

    app.use(express.static(config.staticPath, { index: false }));
    app.use(/.*/, (_, res, next) => {
      if (res.headersSent) return next();

      res.status(200).set({ 'Content-Type': 'text/html' }).end(index);
    });
  }

  app.use(ErrorMiddleware);

  app.listen(config.port);
};

main()
  .then(() => console.log(`Server is running on port ${config.port}`))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
