FROM node:18

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 4200

CMD ["node", "dist/main.js"]