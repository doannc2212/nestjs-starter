
FROM node:20-alpine AS base 
WORKDIR /usr/src/app

FROM base AS install
RUN npm install -g pnpm
RUN mkdir -p /temp/dev
COPY package.json pnpm-lock.yaml /temp/dev/
RUN cd /temp/dev && pnpm install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json pnpm-lock.yaml /temp/prod/
RUN cd /temp/prod && pnpm install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN npx ts-node scripts/generate-typing.ts
RUN npx ts-node scripts/generate-protoc.ts

ENV NODE_ENV=production
# [optional] tests & build
# RUN npm run test
RUN npm run build

FROM node:20-alpine AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist dist
COPY --from=prerelease /usr/src/app/recipe recipe
