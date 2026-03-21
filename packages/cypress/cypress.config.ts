import { defineConfig } from "cypress";

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: '.logs/results-[hash].xml',
    toConsole: false
  },
  e2e: {
    chromeWebSecurity: false,
    baseUrl: "https://www.saucedemo.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts"
  },
});
