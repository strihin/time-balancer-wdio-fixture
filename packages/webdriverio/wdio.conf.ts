import fs from 'fs';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import { BASE_URL } from '@constants/index';
import path from 'path';
import { suites } from './src/config/suites';

const headless = process.env.HEADLESS !== 'false';
const logsDir = path.resolve('.logs');

let suiteName = process.env.SUITE;

if (!suiteName) {
  const argSuite = process.argv.find(arg => suites[arg]);
  if (argSuite) {
    suiteName = argSuite;
  }
}

if (suiteName && !suites[suiteName]) {
  console.error(`\nUnknown suite: "${suiteName}"\nAvailable: ${Object.keys(suites).join(', ')}\n`);
  process.exit(1);
}
const activeSpecs: string[] = suiteName ? suites[suiteName] : ['./src/specs/**/*.spec.ts'];

const chromeArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
];
if (headless) chromeArgs.unshift('--headless=new');

export const config: WebdriverIO.Config = {
  runner: 'local',

  specs: activeSpecs,

  suites,

  exclude: [],

  maxInstances: 3,

  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        binary: process.env.CHROME_BIN,
        args: chromeArgs,
      },
      'wdio:chromedriverOptions': {
        verbose: true,
        log: `${logsDir}/chromedriver.log`,
      },
    },
  ],

  logLevel: 'trace',

  outputDir: logsDir,

  bail: 0,

  baseUrl: BASE_URL,

  waitforTimeout: 10000,

  connectionRetryTimeout: 120000,

  connectionRetryCount: 3,

  services: [],

  framework: 'mocha',

  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
    retries: 2,
  },

  onPrepare() {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log('[WDIO] HEADLESS:', process.env.HEADLESS);
    console.log('[WDIO] DOCKER:', process.env.DOCKER);
    console.log('[WDIO] chromeArgs:', chromeArgs);
  },
};
