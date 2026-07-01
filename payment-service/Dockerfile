FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    bash \
    iputils-ping \
    openssl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

EXPOSE 3005

# ✅ FIXED STARTUP FLOW
CMD ["sh", "-c", "\
  echo '⏳ Waiting for database...'; \
  sleep 10; \
  echo '🚀 Running migrations...'; \
  npx prisma migrate deploy || true; \
  echo '🔥 Starting service...'; \
  node src/server.js \
"]