# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# The API is reached through this container's own /api/ path, which nginx proxies to the
# backend named by API_URL at startup. Nothing about the backend is baked into the bundle.
ENV VITE_API_URL=/api/v1
RUN npm run build

FROM nginx:1.27-alpine

COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

# Backend the /api/ path is proxied to. Override it when the API lives elsewhere.
ENV API_URL=http://api:8080
ENV PORT=80

EXPOSE 80
