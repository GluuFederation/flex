FROM node:22.13.1-alpine3.21 AS builder

RUN apk add --no-cache openjdk17

RUN deluser --remove-home node \
    && addgroup -S node -g 1000 \ 
    && adduser -S -G node -u 1000 node

WORKDIR /app
ENV HOME /app/.cache

RUN mkdir /app/.cache

RUN chown -R 1000:1000 /app

COPY --chown=1000:1000 ./package*.json /app/

ENV NODE_ENV=${ENVIRONMENT:-development}
RUN npm install @openapitools/openapi-generator-cli -g
RUN npm install


COPY --chown=1000:1000 . /app

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
