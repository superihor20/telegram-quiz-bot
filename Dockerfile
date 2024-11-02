FROM node:18

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y tzdata

RUN ln -snf /usr/share/zoneinfo/Europe/Kyiv /etc/localtime && echo "Europe/Kyiv" > /etc/timezone

RUN apt-get clean

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install 

COPY . .

RUN pnpm run build

RUN pnpm run migration:run

EXPOSE 4200

CMD ["node", "dist/main.js"]
