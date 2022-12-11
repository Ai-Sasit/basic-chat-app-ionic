FROM node:19-alpine

WORKDIR /code

COPY package.json /code

RUN npm install

COPY . /code

EXPOSE 7000

CMD ["npm","start"]