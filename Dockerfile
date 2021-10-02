FROM node:alpine3.11

WORKDIR /app

RUN npm i -g typescript
RUN apk add python make gcc g++

COPY package*.json .
RUN npm i

COPY . .
RUN tsc

CMD ["node", "."]