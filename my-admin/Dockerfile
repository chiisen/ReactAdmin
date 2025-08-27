# Dockerfile for React Admin (Vite + React)
FROM node:20-alpine AS build
WORKDIR /app
COPY my-admin/package.json my-admin/package-lock.json ./my-admin/
WORKDIR /app/my-admin
RUN npm install --production=false
COPY my-admin/ ./
RUN npm run build

# Production image
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/my-admin/dist .
COPY my-admin/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
