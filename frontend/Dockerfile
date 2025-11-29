FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . . 

RUN npm run build

FROM nginx:alpine
EXPOSE 3001
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/

ENTRYPOINT ["nginx"]
CMD ["-g daemon off;"]