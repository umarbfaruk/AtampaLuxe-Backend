FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    bash \
    openssl \
    postgresql-client \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*


COPY package*.json ./

RUN npm install


COPY prisma ./prisma

RUN npx prisma generate


COPY src ./src

COPY .env ./


EXPOSE 3001


CMD ["/bin/bash", "-c", "\
echo '⏳ Waiting for user database...'; \
until pg_isready -h postgres-user -p 5432 -U postgres; do \
sleep 2; \
done; \
echo '✅ User database ready'; \
echo '🚀 Checking Prisma schema...'; \
if [ -d prisma/migrations ] && [ \"$(ls -A prisma/migrations)\" ]; then \
npx prisma migrate deploy; \
else \
echo '⚠️ No migrations found. Using db push...'; \
npx prisma db push; \
fi; \
echo '🔥 Starting User Service'; \
node src/server.js \
"]