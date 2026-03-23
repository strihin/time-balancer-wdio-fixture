import * as child_process from 'child_process';
import { purgeLogs } from '@utils/cleanup';
import { suites } from './config/suites';

const mode = process.argv[2]; // 'run' or 'ui'
const userArgs = process.argv.slice(3);

let suiteName: string | undefined;

// Match positional string to a key in our suites object
const suiteArg = userArgs.find((arg: string) => suites[arg]);
if (suiteArg) {
  suiteName = suiteArg;
} else if (userArgs.length > 0) {
  const maybeSuite = userArgs.find((arg: string) => !arg.startsWith('-'));
  if (maybeSuite) {
    console.error(`\nUnknown suite: "${maybeSuite}"\nAvailable: ${Object.keys(suites).join(', ')}\n`);
    process.exit(1);
  }
}

// Build spec pattern for Jest
const specPattern = suiteName ? suites[suiteName].join(' ') : '';

// Build execution command
// ui mode uses --verbose for detailed output; jest has no interactive GUI
const jestFlags = mode === 'ui' ? '--verbose' : '--silent';
const jestCmd = `jest ${jestFlags} --config jest.config.ts`;

// Purge old performance logs prior to execution
purgeLogs();

console.log(`\n> Executing Puppeteer Suite: ${suiteName || 'ALL SPECS'}\n`);
child_process.execSync(`./node_modules/.bin/jest ${jestFlags} --config jest.config.ts ${specPattern}`, { stdio: 'inherit' });
