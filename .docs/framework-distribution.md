# Test Framework Distribution

Based on the analysis of the monorepo packages, here is the distribution of the testing frameworks specified in your request (Jest, Mocha, Vitest, Cucumber) for each package:

- **WebdriverIO** (`@benchmarks/webdriverio`): **Mocha**
  - Configured in `wdio.conf.ts` (`framework: 'mocha'`) and utilizes mocha types.

- **Cypress** (`@benchmarks/cypress`): **Mocha**
  - Cypress has Mocha bundled internally and is configured via its package dependencies (`"mocha"`).

- **Puppeteer** (`@benchmarks/puppeteer`): **Jest**
  - Uses `jest` and `ts-jest` for executing browser interactions via the Puppeteer API.

- **Playwright** (`@benchmarks/playwright`): **None of the above**
  - Playwright uses its own dedicated test runner (`@playwright/test`), which shares syntactic similarities with Jest/Mocha but is a standalone framework.

*Note: **Vitest** and **Cucumber** are currently not being used in any package within this project.*
