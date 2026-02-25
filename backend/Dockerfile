FROM node:20-slim

# better-sqlite3 requires native build tools (python3, make, g++)
# node:20-slim is Debian-based which has better native module support than Alpine
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

# Ensure required directories exist
RUN mkdir -p uploads database

EXPOSE 3200

CMD ["node", "index.js"]
