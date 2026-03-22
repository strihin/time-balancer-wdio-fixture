# Testing GitHub Actions Workflows Locally

Before pushing changes and testing them on GitHub directly, you can simulate and run the exact workflow logic locally on your machine using Docker and `act` (or the GitHub CLI extension `gh act`).

This ensures you can validate the dynamic pipeline configurations, environment variable passthroughs, and container spins without cluttering your repository's Actions history.

## Prerequisites
1. **Docker Desktop**: Since GitHub Actions runners are essentially Linux containers, `act` uses Docker to simulate them. Ensure Docker Desktop is installed and running on your Mac.
2. **GitHub CLI (`gh`)**: Ensure you have `gh` installed and authenticated (`gh auth login`).

## Setup: Installing Local Runner
You can run actions locally by installing the `gh-act` extension (which runs the popular `nektos/act` engine natively through your `gh` CLI).

```bash
# Install the extension via GitHub CLI
gh ext install nektos/gh-act
```

*(Alternatively, you can just install standard `act` directly via Homebrew: `brew install act`)*

## Running the Workflows 

### 1. Run a Default Pipeline
Because our workflows are designed around `workflow_dispatch` (manual triggers) and `repository_dispatch` rather than automatic `push` events, you **must explicitly tell `act` which event to trigger**. If you omit the event name, `act` looks for `push` events by default and will fail with a "Could not find any stages to run" error.

```bash
# Test the Playwright pipeline natively using the workflow_dispatch event
gh act workflow_dispatch -W .github/workflows/playwright.yml

# Test the WebdriverIO pipeline natively
gh act workflow_dispatch -W .github/workflows/wdio.yml
```

### 2. Testing `workflow_dispatch` with Inputs
We parameterized the GHA Workflows to support selective test suite execution (e.g., `inputs: { suite: 'login' }`). You can pass these inputs seamlessly into your local simulation by specifying the event type and using the `--input` flag:

```bash
# Trigger the playwright pipeline and pass 'login' as the suite input
gh act workflow_dispatch -W .github/workflows/playwright.yml --input suite=login

# Trigger the cypress pipeline and pass 'checkout' as the suite input
gh act workflow_dispatch -W .github/workflows/cypress.yml --input suite=checkout
```

## Important Considerations for Local Execution
- **Image Size**: The very first time you trigger `gh act`, it may download the simulated `ubuntu-latest` container image (`node:20-bookworm-slim` environment). This might take a minute or two depending on your connection.
- **Docker-in-Docker**: Because our workflows rely on `docker-compose up` natively, the simulated runner needs to run Docker inside the `act` container. `act` generally supports Docker-in-Docker (DinD), but it will map directly to your local daemon host.
- **Secrets**: We utilize `SAUCE_USER` and `SAUCE_PASS`. If those are required to pass tests successfully locally, you can provide them securely via an `.secrets` file or via terminal flags: 
  ```bash
  gh act workflow_dispatch -W .github/workflows/playwright.yml -s SAUCE_USER=admin -s SAUCE_PASS=pass123
  ```
