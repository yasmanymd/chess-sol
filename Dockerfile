FROM node:10.18.1-alpine

# For much faster builds, install node packages first because that's the longest
# part and we don't want to invalidate that work each time we change source files
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]