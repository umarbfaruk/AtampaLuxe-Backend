FROM node:20-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y openssl ca-certificates postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --omit=dev

COPY prisma ./prisma

# Force Prisma to use OpenSSL 3
RUN npx prisma generate

COPY app.js ./
COPY src ./src

EXPOSE 3003

CMD ["node", "src/server.js"]