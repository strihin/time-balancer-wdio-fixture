# Mid-phase: Saucedemo Fixture Plan

> Replaces the static Todo/Notes app. Target: 30 tests against [saucedemo.com](https://www.saucedemo.com/) with deliberately varied execution times, driven by **WDIO 9 + [@wdio/mcp](https://webdriver.io/uk/blog/2026/02/04/introducing-webdriverio-mcp/)** as the MCP server.

---

## Goal

Produce a `test_results.log` with realistic timing spread:
- **Fast tests** (login, simple navigation) — ~3 s each
- **Slow tests** (full checkout flow, inventory sort) — ~60 s each

This spread is what makes the `weights:wdio` parser output meaningful durations for `time-balancer`.

---

## Spec structure (flat)

All specs live in `src/specs/saucedemo/`.

| File | Tests | Approx time | Edge cases |
|---|---|---|---|
| `login.spec.ts` | 5 | ~3 s each | 1 invalid-creds fail |
| `inventory.spec.ts` | 5 | ~5 s each | 1 skip (sort pending) |
| `cart.spec.ts` | 5 | ~10 s each | all pass |
| `checkout.spec.ts` | 5 | ~45–60 s each | 1 retry (form timing) |
| `product.spec.ts` | 5 | ~8 s each | all pass |
| `logout.spec.ts` | 5 | ~4 s each | all pass |

Total: **30 tests** across 6 spec files.

---

## MCP usage

`@wdio/mcp` acts as the MCP server — it exposes browser-automation tools (click, fill, navigate, assert) that WDIO 9 delegates to. Config key:

```ts
// wdio.conf.ts (to be updated)
services: ['mcp'],
```

Reference: [Introducing WebdriverIO MCP](https://webdriver.io/uk/blog/2026/02/04/introducing-webdriverio-mcp/)

---

## Checklist

### Remove old app
- [x] Delete `src/app/` (static Todo/Notes HTML + JS)
- [x] Delete `src/specs/my-app/` (old spec files)

### Saucedemo specs
- [x] `login.spec.ts` — 5 tests (valid login, invalid creds fail, locked-out user, empty fields, logout redirect)
- [x] `inventory.spec.ts` — 5 tests (page loads, item count, sort name A→Z skip, sort price, add to cart from list)
- [x] `cart.spec.ts` — 5 tests (add item, remove item, cart badge count, persist across nav, proceed to checkout)
- [x] `checkout.spec.ts` — 5 tests (fill info, continue, overview totals, finish, empty cart checkout)
- [x] `product.spec.ts` — 5 tests (open detail, back button, add from detail, image visible, name matches)
- [x] `logout.spec.ts` — 5 tests (menu opens, logout link visible, logout redirects to login, session cleared, re-login works)

### Config updates
- [x] Remove `src/app/` serve step from `wdio.conf.ts`
- [x] Set `baseUrl: 'https://www.saucedemo.com'`
- [ ] Add `services: ['mcp']` (or confirm `@wdio/mcp` integration approach)
- [x] Store saucedemo credentials in `.env` (`SAUCE_USER`, `SAUCE_PASS`)

### CI updates
- [x] Remove `npx serve` step from `.github/workflows/run.yml`
- [x] Add `SAUCE_USER` / `SAUCE_PASS` as GitHub Actions secrets

### Validation
- [ ] `yarn test:log` produces `test_results.log` with ~30 entries
- [ ] Login specs show ~3 s, checkout specs show ~45–60 s
- [ ] `yarn weights:wdio .input/<date>/` in `time-balancer` shows spread durations
- [ ] Retry, skip, fail lines all present in log

---

## Done criteria
- [ ] 30 tests run cleanly on CI against saucedemo.com
- [ ] `test_results.log` timing spread: fast (~3 s) vs slow (~60 s)
- [ ] Artifact uploaded and parseable by `time-balancer` weights script
