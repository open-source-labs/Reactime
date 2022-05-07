FROM node:local machine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
