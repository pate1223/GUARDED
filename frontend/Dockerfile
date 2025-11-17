FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . . 

RUN npm run build

FROM nginx:alpine
EXPOSE 3001
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

COPY env-config.js.template /usr/share/nginx/html/env-config.js.template

RUN apk add --no-cache gettext

CMD ["sh", "-c", "envsubst '${VITE_API_URL}' < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js && envsubst '${VITE_API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'" ]