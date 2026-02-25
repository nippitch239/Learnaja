FROM node:20-alpine

# better-sqlite3 requires native compilation tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN mkdir -p uploads

EXPOSE 3200

# On startup: initialise the DB schema (idempotent – uses CREATE TABLE IF NOT EXISTS),
# then launch the server.
CMD ["sh", "-c", "node init-db.js && node index.js"]
