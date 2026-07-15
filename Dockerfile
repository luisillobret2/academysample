FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY backend/ ./backend/

EXPOSE 3000

CMD ["node", "backend/server.js"]
