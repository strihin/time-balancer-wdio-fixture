import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { purgeLogs } from '../../shared/src/utils/cleanup';
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

// Convert suite paths into a space-separated list for Vitest
// Vitest just takes paths/files to filter
const targetSpecs = suiteName ? suites[suiteName].join(' ') : '';

// Build execution command
const vitestFlags = mode === 'ui' ? '--ui' : '--run';
const specFlag = targetSpecs ? `${targetSpecs}` : '';

// Purge old performance logs prior to execution
purgeLogs();

console.log(`\n> Executing Vitest Suite: ${suiteName || 'ALL SPECS'}\n`);
child_process.execSync(`./node_modules/.bin/vitest ${vitestFlags} ${specFlag}`, { stdio: 'inherit' });
