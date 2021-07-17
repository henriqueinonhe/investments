FROM node:lts-alpine

WORKDIR /home/app

COPY . .

RUN npm ci
RUN npm run prod-build

EXPOSE 80

CMD ["node", "./src/server.js"]