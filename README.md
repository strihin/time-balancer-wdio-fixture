# Time Balancer Benchmarks

This is a monorepo containing benchmark tests for different end-to-end testing frameworks (Cypress, Playwright, Puppeteer, WebdriverIO), sharing common utilities and configurations.

## Prerequisites

- Node.js >= 20
- pnpm >= 9.15.4

## Installation

To install all dependencies for the workspaces, run the following command in the root directory:

```bash
pnpm install
```

This will install dependencies and link the local workspaces correctly.

## Running Tests

Each framework is contained in its own package and provides standard npm scripts to run tests either headlessly (for CI/CD) or with a UI (for local debugging). Since this is a `pnpm` monorepo, you can easily execute tests using the `pnpm --filter` command.

### Running a Specific Test Suite

By default, the tests will execute the entire suite of specs. To execute a specific test suite, you can append the suite name directly to the test command, or provide it via the `SUITE` environment variable depending on the framework.

- **Example (Puppeteer or Cypress pass as arg)**: `pnpm --filter @benchmarks/puppeteer test login`
- **Example (WebdriverIO pass as env var)**: `SUITE=checkout pnpm --filter @benchmarks/webdriverio test`

### Execution Logs and Time Stabilisator (GHA)

During test execution, each framework will output its execution data, traces, and metrics into a `.logs/` directory inside its respective package (e.g. `packages/cypress/.logs`). 
**Note for GitHub Actions**: These `.logs/` directories must be preserved because they serve as input to the time stabilisator tool, which parses them to normalize and analyze performance data on GHA.

### Cypress (`@benchmarks/cypress`)

- **Run Headless:** `pnpm --filter @benchmarks/cypress test`
- **Run with UI:** `pnpm --filter @benchmarks/cypress test:ui`

### Playwright (`@benchmarks/playwright`)

- **Run Headless:** `pnpm --filter @benchmarks/playwright test`
- **Run with UI:** `pnpm --filter @benchmarks/playwright test:ui`

### Puppeteer (`@benchmarks/puppeteer`)

- **Run Headless:** `pnpm --filter @benchmarks/puppeteer test`
- **Run with UI:** `pnpm --filter @benchmarks/puppeteer test:ui`

### WebdriverIO (`@benchmarks/webdriverio`)

- **Run Headless:** `pnpm --filter @benchmarks/webdriverio test`
- **Run with UI:** `pnpm --filter @benchmarks/webdriverio test:ui`

### Shared (`@benchmarks/shared`)

This package provides common configurations, selectors, and test utilities that are shared across all framework benchmarks.

## Project Structure

```text
.
├── packages/
│   ├── cypress/       # Cypress benchmark tests
│   ├── playwright/    # Playwright benchmark tests
│   ├── puppeteer/     # Puppeteer benchmark tests
│   ├── webdriverio/   # WebdriverIO benchmark tests
│   └── shared/        # Shared code and configurations
└── package.json       # Root monorepo configuration
```
