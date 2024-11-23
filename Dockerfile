FROM node:18

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -snf /usr/share/zoneinfo/Europe/Kyiv /etc/localtime && echo "Europe/Kyiv" > /etc/timezone && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY wait-for-it.sh /usr/src/app/
RUN chmod +x /usr/src/app/wait-for-it.sh

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

RUN rm -rf node_modules

RUN pnpm install --prod

EXPOSE 4200

CMD ["/bin/bash", "-c", "/usr/src/app/wait-for-it.sh db:5432 -- pnpm run migration:run:prod && node dist/main.js"]
