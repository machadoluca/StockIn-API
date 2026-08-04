FROM node:24.12-alpine AS base

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm ci

EXPOSE 3000

FROM base AS development

CMD ["npm", "run", "dev"]

FROM base AS build

RUN npm run build
