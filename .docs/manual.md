# Phase 1: Manual Execution Checklist

Since the directory restructuring has been completed automatically (establishing `packages/webdriverio` and `packages/shared`, alongside linking `pnpm-workspace.yaml`), all that is left to finish Phase 1 is invoking the package manager.

## 1. Install Dependencies
Open your terminal at the root of your project (`time-balancer-wdio-fixture`) and run:
```bash
pnpm install
```

## 2. Verify Execution
Once `pnpm` finishes downloading browser binaries and node modules, verify that the `@selectors` configuration accurately maps between the webdriver suite and the shared module by launching a test:
```bash
pnpm --filter @benchmarks/webdriverio run test:ui checkout
```

*(Note: You can pass any suite name defined in your `suites` config like `cart`, `login`, `checkout`, etc.)*

If WebdriverIO boots cleanly, your monorepo base is officially solidified! Let me know whenever you're ready for Phase 2 (Cypress), Phase 3 (Playwright) or if you encounter any strange path resolution issues!