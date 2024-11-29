FROM node:18-slim AS build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

FROM node:18-slim AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

ENV TZ=Europe/Kyiv

COPY wait-for-it.sh /usr/src/app/

RUN chmod +x /usr/src/app/wait-for-it.sh

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

COPY --from=build /usr/src/app/dist ./dist

COPY --from=build /usr/src/app/assets ./assets

RUN pnpm install --prod --frozen-lockfile

EXPOSE 4200

CMD ["/bin/bash", "-c", "/usr/src/app/wait-for-it.sh db:5432 -- pnpm run migration:run:prod && node dist/main.js"]