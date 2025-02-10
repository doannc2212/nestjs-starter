
# use the official Bun image 
# see all versions at https://hub.docker.com/r/oven/bun/tags
from oven/bun:1-alpine as base
workdir /usr/src/app

from base as install
run mkdir -p /temp/dev
copy package.json bun.lock /temp/dev/
run cd /temp/dev && bun install --frozen-lockfile

run mkdir -p /temp/prod
copy package.json bun.lock /temp/prod/
run cd /temp/prod && bun install --frozen-lockfile --production

from base as prerelease
copy --from=install /temp/dev/node_modules node_modules
copy . .

run bun scripts/generate-typing.ts
run bun scripts/generate-protoc.sh

env NODE_ENV=production
# [optional] tests & build
# run bun test
run bun run build

from oven/bun:1-distroless as release
copy --from=install /temp/prod/node_modules node_modules
copy --from=prerelease /usr/src/app .

