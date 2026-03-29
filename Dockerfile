FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY server.ts db.ts notify.ts index.html headshot.jpg ./

EXPOSE 8080

CMD ["bun", "server.ts"]
