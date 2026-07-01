FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    bash \
    openssl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY .env ./

EXPOSE 3006

CMD ["node", "src/server.js"]