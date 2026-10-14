# ---------- Web Builder ----------
FROM node:22-slim AS frontend
WORKDIR /app

# Install
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy
COPY . .

# Build
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# ---------- Runtime ----------
FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=frontend /app/.next/standalone ./
COPY --from=frontend /app/.next/static ./.next/static

EXPOSE 3000
CMD ["server.js"]
