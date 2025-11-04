FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . . 

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d

EXPOSE 3001

ENTRYPOINT [ "nginx" ]

CMD [ "-g", "daemon off;"]
