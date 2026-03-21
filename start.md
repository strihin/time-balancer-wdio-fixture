# WDIO Fixture Repo

> Companion to [wdio.md](./wdio.md). Covers the `time-balancer-wdio-fixture` repo setup and the trigger workflow in `time-balancer`.

---

## Architecture

**Fixture repo**: `time-balancer-wdio-fixture` (separate GitHub repo)
- Real E2E tests against a simple Todo/Notes app served locally (`npx serve`)
- 20–30 tests across multiple spec files, with deliberate retries, skips, and failures to cover all log-format edge cases
- Produces `test_results.log` via standard WDIO stdout (captured by the CI runner)
- GitHub Actions workflow accepts `repository_dispatch` trigger from `time-balancer` repo, runs tests, uploads log as artifact

**Developer workflow**:
1. Trigger fixture run from `time-balancer` via `repository_dispatch`
2. Download artifact from `time-balancer-wdio-fixture` GH Actions
3. Drop into `.input/<date>/` folder
4. Run `yarn weights:wdio .input/<date>/`

**Trigger flow**:
```
time-balancer (workflow_dispatch)
  → repository_dispatch → time-balancer-wdio-fixture
    → WDIO tests run → artifact uploaded (test_results.log)
      → developer: download → .input/ → yarn weights:wdio
```

---

## Log format produced by the fixture

The fixture must emit logs in the standard WDIO format the parser already handles:

### Web (chrome)
```
[0-0] RUNNING in chrome - file:///src/specs/my-app/todo/create.spec.ts
[chrome 145.0.0.0 linux #0-0] 5 passing (45.2s)
```

### Retry
```
[0-4] RETRYING in chrome - file:///src/specs/my-app/notes/tags.spec.ts
[0-4] RUNNING in chrome - file:///src/specs/my-app/notes/tags.spec.ts
[chrome 145.0.0.0 linux #0-4] 3 passing (1m 12.0s) (1 retries)
```

### Mixed pass/fail
```
[chrome 145.0.0.0 linux #0-2] 3 passing (33.1s)
[chrome 145.0.0.0 linux #0-2] 1 failing
```

> All logs are captured to `test_results.log` via `| tee test_results.log` or WDIO's `outputDir`.

---

## Fixture repo spec structure (20–30 tests)

```
wdio-fixture/
  src/
    app/                      # Simple static Todo/Notes app
      index.html
      app.js
    specs/
      my-app/
        todo/
          create.spec.ts      # 5 tests, all pass
          delete.spec.ts      # 4 tests, 1 skip
          edit.spec.ts        # 5 tests, 1 retry
        notes/
          create.spec.ts      # 5 tests, all pass
          search.spec.ts      # 4 tests, 1 failing
          tags.spec.ts        # 5 tests, 2 retries
  wdio.conf.ts                # chrome, maxInstances: 3, retries: 2
  .github/workflows/run.yml   # triggered by repository_dispatch
```

---

## Checklist

### `time-balancer-wdio-fixture` repo
- [ ] Create fixture repo with static app + 20–30 tests
- [ ] Configure `wdio.conf.ts` — chrome runner, `maxInstances: 3`, `retries: 2`
- [ ] Capture WDIO stdout to `test_results.log` (via `outputDir` or shell redirect)
- [ ] Add GitHub Actions workflow with `repository_dispatch` trigger
- [ ] Workflow uploads `test_results.log` as artifact

### `time-balancer` — trigger workflow
- [ ] Add `.github/workflows/trigger-wdio-fixture.yml`
  - `workflow_dispatch` input for ref/branch
  - Sends `repository_dispatch` with `event-type: run-wdio`

### `time-balancer` — validation
- [ ] Download artifact → `.input/<date>/test_results.log`
- [ ] Run `yarn weights:wdio .input/<date>/` and confirm output matches expected spec keys
- [ ] Cross-check retry handling: specs with `retries: 2` should show averaged duration
- [ ] Cross-check fail handling: `N failing` line adds to `count`

---

## Done criteria
- [ ] Fixture repo produces a valid `test_results.log` via CI
- [ ] `yarn weights:wdio .input/<date>/` produces valid weights JSON from fixture artifact
- [ ] All edge cases covered: retries, skips, failures, multi-shard, seconds-only duration
- [ ] Output matches AWK baseline (same spec keys, integer-rounded durations)
