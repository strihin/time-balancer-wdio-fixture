# Monorepo Migration Plan: Testing Benchmarks

This guide details the step-by-step phases to migrate the existing testing repository into a modular monorepo containing WebdriverIO, Cypress, and Playwright.

## Phase 1: Set up Monorepo Structure & WebdriverIO
In this phase, we establish the root workspace, create a `shared` package to hold common capabilities (like test data and CSS selectors), and gracefully move the existing WebdriverIO tests into their own isolated package.

### 1. Initialize the Monorepo Root
- Create a `packages/` directory at the root: `mkdir packages`
- Create a generic `package.json` at the project root to define the workspaces:
  ```json
  {
    "name": "time-balancer-benchmarks",
    "private": true,
    "workspaces": [
      "packages/*"
    ]
  }
  ```
- Move your root configurations (e.g., global `./.gitignore`, `./.prettierrc`, etc.) to stay in this root.

### 2. Isolate WebdriverIO
- Create `packages/webdriverio`
- Move your current `package.json`, `wdio.conf.ts`, `tsconfig.json`, and the `src/specs` directory into `packages/webdriverio/`.
- Update the WebdriverIO `package.json` name to something distinct, like `"name": "@benchmarks/webdriverio"`.

### 3. Abstract Shared Resources
- Create `packages/shared` with its own `package.json` (`"name": "@benchmarks/shared"`).
- Move your current `src/fixtures`, `src/selectors`, and shared configurations into `packages/shared/src/`.
- Export them cleanly via a `packages/shared/index.ts` barrel file.

### 4. Re-link WebdriverIO to Shared
- In `packages/webdriverio/package.json`, add `@benchmarks/shared` to your dependencies so it can consume the local workspace package:
  ```json
  "dependencies": {
    "@benchmarks/shared": "*"
  }
  ```
- Update `packages/webdriverio/tsconfig.json` paths so that your `@support/*`, `@fixtures/*`, and `@selectors/*` aliases now correctly map up a directory into `../shared/src/*`.
- Run `yarn install` from the root directory to link the workspaces.
- Run your `yarn test:ui login` inside `packages/webdriverio` to guarantee all existing WDIO specs still pass before proceeding.

---

## Phase 2: Integrate Cypress
In this phase, we introduce Cypress into the monorepo, consuming the exact same shared variables.

### 1. Initialize Cypress Package
- Create `packages/cypress/` and add a `package.json` (`"name": "@benchmarks/cypress"`).
- Include `"cypress": "^13.0.0"` in your devDependencies for this package.
- Add `"@benchmarks/shared": "*"` to use the shared selectors.
- Run `yarn install` from the root.

### 2. Configure Cypress
- Inside `packages/cypress`, run `yarn cypress open` to generate the default scaffold (`cypress.config.ts`, `/cypress/e2e/`, `/cypress/support/`).
- Inside `packages/cypress/tsconfig.json`, ensure your `paths` map to the `shared` repository exactly as WDIO does so Cypress can understand your `@selectors` aliases.
- *Note:* Make sure to add `"types": ["cypress"]` to ensure TS ignores WDIO typings and isolated contexts are held intact.

### 3. Replicate Tests
- Re-create `login.cy.ts` inside `packages/cypress/cypress/e2e/`.
- Import the same strings/objects: `import { LoginSelectors as LoginSel } from '@selectors/login.selectors';`
- Rewrite the WebDriver code into Cypress commands. E.g., `await $(LoginSel.username).setValue('user')` becomes `cy.get(LoginSel.username).type('user')`.
- Execute Cypress tests to verify success.

---

## Phase 3: Integrate Playwright
In this phase, we add Playwright to the mix, enabling a three-way direct comparison.

### 1. Initialize Playwright Package
- Create `packages/playwright/` and add a `package.json` (`"name": "@benchmarks/playwright"`).
- Include `"@playwright/test": "^1.40.0"` in your devDependencies.
- Add `"@benchmarks/shared": "*"` to import your selectors.
- Run `yarn install` from the root.

### 2. Configure Playwright
- Create `playwright.config.ts` in `packages/playwright/`. Define the base URL (`https://www.saucedemo.com`) and browser matrices here.
- Create a `packages/playwright/tsconfig.json` replicating the `@selectors` path maps. 

### 3. Replicate Tests
- Create `login.spec.ts` inside `packages/playwright/tests/`.
- Import the Playwright test handler and the shared selectors: 
  ```ts
  import { test, expect } from '@playwright/test';
  import { LoginSelectors as LoginSel } from '@selectors/login.selectors';
  ```
- Rewrite the WebDriver locators into Playwright format. E.g., `await $(LoginSel.loginButton).click()` becomes `await page.locator(LoginSel.loginButton).click()`.
- Add a script in the root `package.json` tracking start/end times across all 3 tests dynamically!
