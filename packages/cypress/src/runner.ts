import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { suites } from './config/suites';

const mode = process.argv[2]; // 'run' or 'open'
const userArgs = process.argv.slice(3); // any trailing commands like 'checkout'

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

// Convert the mapped paths back into a comma-separated string for Cypress
const targetSpecs = suiteName ? suites[suiteName].join(',') : '';

// Build execution command
const cypressCmd = mode === 'open' ? 'cypress run --headed --no-exit --browser firefox' : 'cypress run';
const specFlag = targetSpecs ? `--spec "${targetSpecs}"` : '';

// Purge old performance logs prior to execution
const logsDir = path.resolve('.logs');
if (fs.existsSync(logsDir)) {
  fs.rmSync(logsDir, { recursive: true, force: true });
}

console.log(`\n> Executing Cypress Suite: ${suiteName || 'ALL SPECS'}\n`);
child_process.execSync(`npx ${cypressCmd} ${specFlag}`, { stdio: 'inherit' });
