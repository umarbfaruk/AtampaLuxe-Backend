FROM node:20-alpine

WORKDIR /app

# Copy package.json first to leverage Docker cache
COPY package*.json ./

RUN npm install

# Copy the source folder
COPY src ./src

# Start the app
CMD ["node", "src/app.js"]
