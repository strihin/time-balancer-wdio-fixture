# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim

# Receive the target framework from docker-compose build args
ARG FRAMEWORK=playwright

# Configure pnpm and browser cache paths
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV CYPRESS_CACHE_FOLDER=/cypress-cache

# Install universal system dependencies required by Cypress, Puppeteer, Playwright & WebdriverIO
# Using BuildKit cache mount for apt
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y \
    libglib2.0-0 libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libasound2 \
    xvfb xauth libgtk-3-0 libnotify-dev \
    chromium chromium-driver \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm workspace manager
RUN npm install -g pnpm@9.15.4

WORKDIR /app

# Pre-copy package configuration for optimized layer caching
COPY packages/shared/package.json ./packages/shared/
COPY packages/${FRAMEWORK}/package.json ./packages/${FRAMEWORK}/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install project dependencies explicitly filtered
# Using BuildKit cache mount for pnpm store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --filter @benchmarks/${FRAMEWORK}... --frozen-lockfile

# Copy only the relevant framework source code
COPY packages/shared ./packages/shared/
COPY packages/${FRAMEWORK} ./packages/${FRAMEWORK}/

# Pre-install framework-specific browsers with cache mounts
RUN --mount=type=cache,id=playwright,target=/ms-playwright \
    if [ "$FRAMEWORK" = "playwright" ]; then pnpm --filter @benchmarks/playwright exec playwright install --with-deps; fi

RUN --mount=type=cache,id=cypress,target=/cypress-cache \
    if [ "$FRAMEWORK" = "cypress" ]; then pnpm --filter @benchmarks/cypress exec cypress install; fi

RUN if [ "$FRAMEWORK" = "webdriverio" ]; then \
    cd /app/packages/webdriverio && \
    pnpm exec wdio install browser chrome; fi

# Defaults
ENV HEADLESS=true
ENV DOCKER=true
# Point WDIO at the system arm64 Chromium/Chromedriver from apt (skips runtime download)
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver
ENV CHROME_BIN=/usr/bin/chromium
