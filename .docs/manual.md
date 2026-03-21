# Monorepo Testing Checklist

Because `webdriverio`, `cypress`, and `playwright` all require aggressively downloading heavy browser binaries to your machine (which can hang the assistant), you should manually trigger their installations securely.

## Phase 1: WebdriverIO (Completed)
You can run the existing WebdriverIO tests out of the centralized workspace:
```bash
pnpm --filter @benchmarks/webdriverio run test:ui cart
```

## Phase 2: Cypress
The Cypress workspace has been fully scaffolded. We created `packages/cypress`, hooked up typescript resolution so it can read configurations natively from the `@benchmarks/shared` module, and translated the `login` suite from WebDriver syntax to Cypress queuing syntax.

### 1. Install Cypress
To pull the Cypress binary into your `node_modules`, run:
```bash
pnpm install
```

### 2. Verify Execution
To open the Cypress runner and test out the new `login.cy.ts` integration, execute:
```bash
pnpm --filter @benchmarks/cypress run test:ui
```
*(Select E2E Testing -> Chrome -> click on `login.cy.ts` to see it execute the 5 assertions!)*

Let me know whenever you're satisfied with Cypress and we can begin Phase 3 (Playwright)!