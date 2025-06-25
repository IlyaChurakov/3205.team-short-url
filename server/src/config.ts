import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = Object.freeze({
  port: process.env.PORT || 8000,
  cors: process.env.CORS || '*',
  staticPath: path.resolve(path.join(__dirname, 'client')),
  baseUrl: process.env.BASE_URL || '/',
});
