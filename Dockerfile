# Base Node.js
FROM node:24.12-alpine

# set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Copy source code
COPY . .

# Install dependencies
RUN npm ci


RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]