FROM node:13.1.0

COPY package.json ./

RUN npm install --production

COPY . .

EXPOSE 4242
