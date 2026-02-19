FROM node:20-slim

# Install OpenSSL (required for Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files & install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY src ./src

EXPOSE 3001

# Start service
CMD ["npm", "run", "dev"]
