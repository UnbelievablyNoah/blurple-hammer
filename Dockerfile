FROM node:14

WORKDIR /app

RUN npm i -g typescript

COPY package*.json .
RUN npm i

COPY . .
RUN tsc

CMD ["node", "."]