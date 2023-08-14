FROM node:19.9.0 AS dev

ENV PNPM_VERSION 8.6.12
RUN npm install -g pnpm@${PNPM_VERSION}
COPY . .
RUN pnpm install

EXPOSE 3000
CMD ["npm", "start"]

# ---------------------------------------------

FROM node:19.9.0-slim

ENV PNPM_VERSION 8.6.12
WORKDIR /app
RUN npm install -g pnpm@${PNPM_VERSION}
COPY . .
RUN pnpm install --frozen-lockfile --prod

EXPOSE 3000
CMD ["npm", "start"]
