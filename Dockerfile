FROM node:14


COPY ./api /usr/src/api

# Create app directory
WORKDIR /usr/src/app
COPY ./compiler/package*.json .

RUN pwd
RUN ls

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./compiler .

CMD [ "npm", "start" ]
