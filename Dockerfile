FROM node:20.5.1-alpine AS builder

LABEL maintainer="Oleksandr Zaplitnyi <devogecut@gmail.com>"

ENV NODE_ENV="production"

RUN apk update && apk add git curl bash && rm -rf /var/cache/apk/*

#RUN curl -sf https://gobinaries.com/tj/node-prune | sh

RUN mkdir -p /app

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --no-audit --production --silent

COPY . .

#RUN node-prune ./node_modules

FROM node:20.5.1-alpine as final

RUN mkdir -p /app && chown -R node:node /app

USER node:node

WORKDIR /app

# copy from build image
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/src ./src
COPY --from=builder --chown=node:node /app/index.js ./
COPY --from=builder --chown=node:node /app/package.json ./

CMD ["node", "index.js"]
