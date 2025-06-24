import dotenv from 'dotenv';

dotenv.config();

export const config = Object.freeze({
  port: process.env.PORT || 8000,
  cors: process.env.CORS || '*',
});
