# File location: apps/server/Dockerfile
FROM node:20-slim

# OpenSSL is required for Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# 1. Copy ONLY the server's package.json
COPY package*.json ./

# 2. Copy the server's Prisma folder
COPY prisma ./prisma/

# 3. Install dependencies (This uses ONLY the server's package.json)
RUN npm install

# 4. Generate the Prisma client
RUN npx prisma generate

# 5. Copy the rest of the server code
COPY . .

# 6. Build the TypeScript code
RUN npm run build

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
