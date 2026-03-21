import { defineConfig } from "cypress";
import { BASE_URL } from "@constants/index";

// Chromium browser launch args to bypass macOS 15 GPU sandbox crashes
// in headed mode. Extracted for clarity — see src/config/browser.ts for docs.
const chromiumLaunchArgs: string[] = [
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-software-rasterizer',
];

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: '.logs/results-[hash].xml',
    toConsole: false
  },
  e2e: {
    chromeWebSecurity: false,
    experimentalWebKitSupport: true,
    baseUrl: BASE_URL,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push(...chromiumLaunchArgs);
          return launchOptions;
        }
      });
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts"
  },
});
