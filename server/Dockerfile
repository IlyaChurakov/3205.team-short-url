FROM node:22-alpine as builder

WORKDIR /usr/src

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npx prisma generate

FROM node:22-alpine

ENV NODE_ENV production
WORKDIR /usr/app

COPY --from=builder /usr/src/package*.json ./
COPY --from=builder /usr/src/dist ./
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/prisma ./prisma

CMD ["npm", "run", "start:migrate"]






