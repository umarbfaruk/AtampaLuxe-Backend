FROM node:20-slim

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --omit=dev

COPY prisma ./prisma

RUN npx prisma generate

COPY src ./src

EXPOSE 3004

CMD ["node", "src/server.js"]