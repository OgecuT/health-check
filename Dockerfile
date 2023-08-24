FROM node:20.5.1-alpine AS builder

LABEL maintainer="Oleksandr Zaplitnyi <devogecut@gmail.com>"

ENV NODE_ENV="production"

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci --no-audit --production --silent

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
