FROM node:20-slim

WORKDIR /app

# Stable system dependencies (no broken Debian repo edits)
RUN apt-get update -o Acquire::Retries=5 && \
    apt-get install -y \
        curl \
        bash \
        openssl \
        postgresql-client && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY src ./src
COPY .env ./

EXPOSE 3000

CMD ["node", "src/app.js"]