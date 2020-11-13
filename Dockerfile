FROM node:12.18-slim as builder

WORKDIR /app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install

COPY . .

RUN npm run build -- --prod




FROM nginx:1.15-alpine

COPY --from=builder /app/dist/personify/ /var/www/personify
