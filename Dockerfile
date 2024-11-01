FROM node:18

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

COPY ./.env ./

RUN pnpm run build

RUN pnpm run migration:run

EXPOSE 4200

CMD ["node", "dist/main.js"]