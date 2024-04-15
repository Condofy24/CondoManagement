FROM node:21

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

EXPOSE 3000
EXPOSE 4000

CMD ["pnpm", "run", "dev"]