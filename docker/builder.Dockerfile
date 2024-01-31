FROM node:16-alpine as BUILDER

WORKDIR /builder
COPY . .
RUN yarn install --frozen-lockfile
