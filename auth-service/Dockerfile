FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY src ./src
COPY .env ./
COPY entrypoint.sh ./

RUN npx prisma generate

RUN chmod +x entrypoint.sh

EXPOSE 3002

CMD ["./entrypoint.sh"]