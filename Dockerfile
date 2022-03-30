FROM --platform=linux/amd64 node:16.13.2

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

CMD [ "yarn", "start:prod" ]
