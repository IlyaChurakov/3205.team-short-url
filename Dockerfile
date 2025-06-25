FROM node:20-alpine as client

WORKDIR /usr/src

COPY client/package.json ./
RUN npm install
COPY client/ ./

ENV NODE_ENV production
RUN npm run build

FROM node:20-alpine as builder

WORKDIR /usr/src

COPY server/package.json ./
RUN npm install 

COPY server/ ./
RUN npm run build

RUN npx prisma generate

FROM node:20-alpine

ENV NODE_ENV production
ENV SERVE_STATIC 1

WORKDIR /usr/app

COPY --from=builder /usr/src/package*.json ./
COPY --from=builder /usr/src/dist ./
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/prisma ./prisma
COPY --from=client /usr/src/dist ./client

CMD ["npm", "run", "start:migrate"]