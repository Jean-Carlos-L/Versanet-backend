FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY ./public ./public
COPY ./src ./src

RUN npm install

EXPOSE 5000

CMD ["npm", "start"]