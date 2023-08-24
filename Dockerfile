FROM node:20.5.1-alpine AS builder

LABEL maintainer="Oleksandr Zaplitnyi <devogecut@gmail.com>"

ENV NODE_ENV="production"

RUN apk update && apk add git curl bash && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --no-audit --production --silent

COPY . .

FROM node:20.5.1-alpine as final

WORKDIR /app

# copy from build image
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/index.js ./
COPY --from=builder /app/package.json ./

CMD ["node", "index.js"]
