FROM node:16-alpine

WORKDIR /api

COPY ["package.json", "./"]
COPY ["package-lock.json", "./"]
COPY ["nest-cli.json", "./"]
COPY ["tsconfig.build.json", "./"]
COPY ["tsconfig.json", "./"]

RUN npm ci && npm run build

COPY . .

EXPOSE 8080

CMD npm cache clean && npm run start:prod