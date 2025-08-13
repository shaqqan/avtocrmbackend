# 1-bosqich: Build bosqichi
FROM node:22-alpine AS builder
WORKDIR /app

# Barcha dependency’lar (dev + prod)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# 2-bosqich: Production bosqichi
FROM node:22-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/i18n ./src/i18n
COPY .env .env

RUN npm install pm2 -g

EXPOSE 3000
CMD ["pm2-runtime", "dist/main.js"]
