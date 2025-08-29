FROM node:20-alpine AS build
WORKDIR /app/my-admin
COPY my-admin/ ./
COPY my-admin/.env .env
RUN npm install --production=false
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/my-admin/dist .
COPY my-admin/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]