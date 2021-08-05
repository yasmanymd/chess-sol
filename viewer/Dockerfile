FROM node:14.17.4-alpine as build-step

RUN mkdir /app

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["tail", "-f", "/dev/null"]