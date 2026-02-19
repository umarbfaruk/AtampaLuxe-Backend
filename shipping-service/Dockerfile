FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src

EXPOSE 3006

CMD ["npx", "nodemon", "src/index.js"]
