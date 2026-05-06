FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY server.ts db.ts notify.ts homepage.html revenue-residency.html mid-market-tech.html studio-os.html headshot.jpg og.png ./
COPY partials ./partials

EXPOSE 8080

CMD ["bun", "server.ts"]
