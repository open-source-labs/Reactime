FROM node:10.16.2
WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm i
