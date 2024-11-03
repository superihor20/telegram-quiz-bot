FROM node:18

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y tzdata && \
    apt-get install -y sqlite3 && \
    ln -snf /usr/share/zoneinfo/Europe/Kyiv /etc/localtime && echo "Europe/Kyiv" > /etc/timezone && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

RUN pnpm run migration:run

EXPOSE 4200

CMD ["node", "dist/main.js"]
