# AI Agent Instructions

## Command Execution Policy
**CRITICAL RULE**: Do not automatically execute long-running or computationally heavy commands (such as `docker-compose up`, test suite executions, or heavy `pnpm install` commands) via terminal/execution tools unless explicitly asked.

**Reasoning**: The User will run these long-running scripts manually in their native terminal to avoid unnecessary token consumption, excessive polling loops, and agent idle time.

**Workflow**: 
1. The AI should generate, update, or prepare the necessary code, configuration, or Dockerfiles.
2. The AI should print the exact terminal command required into the chat response.
3. The AI should halt and wait for the User to copy/paste the command, execute it, and provide the resulting output manually if there are errors.

## File & Folder Naming Conventions

**CRITICAL RULE**: All file and folder names MUST use **kebab-case** (words separated by hyphens). Never use camelCase, PascalCase, or snake_case for file or folder names.

**Examples:**
| ❌ Wrong | ✅ Correct |
|---|---|
| `clickMenuLink.ts` | `click-menu-link.ts` |
| `fillForm.ts` | `fill-form.ts` |
| `checkoutSelectors.ts` | `checkout-selectors.ts` |
| `UserJourney/` | `user-journey/` |
| `loginPage.ts` | `login-page.ts` |

**Scope**: This rule applies to:
- All TypeScript source files (`*.ts`)
- All test/spec files (`*.spec.ts`)
- All configuration files (e.g. `jest.config.ts`)
- All support/helper files
- All folder names

**Exceptions**: Files dictated by external tooling conventions (e.g. `package.json`, `tsconfig.json`, `pnpm-workspace.yaml`, `Dockerfile`, `.env`) are exempt.

## Selector Import Alias Convention

**CRITICAL RULE**: When importing selector objects, the `as` alias MUST always end with the **`Sel` suffix**. Never shorten it to just the domain name.

**Pattern**: `import { <Name>Selectors as <Name>Sel } from '...'`

**Examples:**
| ❌ Wrong | ✅ Correct |
|---|---|
| `import { CartSelectors as Cart }` | `import { CartSelectors as CartSel }` |
| `import { CheckoutSelectors as Checkout }` | `import { CheckoutSelectors as CheckoutSel }` |
| `import { InventorySelectors as Inv }` | `import { InventorySelectors as InventorySel }` |
| `import { NavSelectors as Nav }` | `import { NavSelectors as NavSel }` |
| `import { LoginSelectors as Login }` | `import { LoginSelectors as LoginSel }` |
| `import { ProductSelectors as Product }` | `import { ProductSelectors as ProductSel }` |

**Reasoning**: Dropping `Sel` makes the alias look like a data model or component import (e.g. `Cart` could be a cart object, not a selector map). The `Sel` suffix makes the intent unambiguous at a glance.


## Spec File Purity

**CRITICAL RULE**: Spec/test files (`.spec.ts`, `cy.ts`, WDIO spec files) MUST contain **only test cases (`it`/`test` blocks) and lifecycle hooks (`before`, `beforeEach`, `after`, `afterEach`)**. No reusable logic should be defined inline inside a spec file.

**What belongs in a `support/` folder, not in a spec:**
- Page interaction helpers (e.g. filling forms, adding items to cart, clicking menus)
- Navigation helpers (e.g. navigating to a specific page, logging in/out)
- Data setup helpers (e.g. seeding items, resetting state)
- Any `async function` that is called from more than one place, or could be reused

**Structure rule**: Each test framework package must have a dedicated `support/` folder:
```
packages/
  puppeteer/src/support/    ← helpers for Puppeteer specs
  cypress/cypress/support/  ← helpers for Cypress specs
  webdriverio/src/support/  ← helpers for WDIO specs
```

**Examples:**
| ❌ Wrong — helper defined in spec | ✅ Correct — imported from support |
|---|---|
| `async function fillForm(page) { ... }` inside `checkout.spec.ts` | `import { fillForm } from '@support/fill-form'` |
| `async function addThreeItems(page) { ... }` inside `checkout-multi-item.spec.ts` | `import { addThreeItems } from '@support/inventory'` |
| `cy.get(...).type(...)` repeated in every test | `import { fillCheckoutForm } from '../support/checkout'` |

**Enforcement**: When generating or modifying spec files, the AI must check if any function is defined inside the spec. If so, it must move it to the appropriate `support/` file and import it.
