# ---------- Builder Stage ----------
FROM oven/bun:1.2.19 AS builder

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

# ---------- Runtime Stage ----------
FROM oven/bun:1.2.19 AS runner

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["bun", "run", "dev"]
