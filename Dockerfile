FROM node:14


WORKDIR /usr/src
COPY . .

WORKDIR /usr/src/server

RUN pwd
RUN ls

RUN npm install

CMD [ "npm", "start" ]
