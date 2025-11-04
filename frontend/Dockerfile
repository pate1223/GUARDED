FROM node:alpine AS builder

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./ 

RUN npm install

COPY . . 

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 3001

ENTRYPOINT [ "nginx" ]

CMD [ "-g", "daemon off;"]
