FROM node:lts-alpine

WORKDIR /home/app

COPY . .

RUN npm ci
RUN npx tsc -p .

WORKDIR /home/app/dist

EXPOSE 80

CMD ["node", "index.js"]