import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Erases the contents of the local .logs directory prior to executing testing suites,
 * safely sidestepping Docker volume mount point destruction (EBUSY).
 */
export function purgeLogs() {
  const logsDir = resolve('.logs');
  console.log(`[purgeLogs] CWD: ${process.cwd()}`);
  console.log(`[purgeLogs] Resolved logsDir: ${logsDir}`);
  if (existsSync(logsDir)) {
    for (const file of readdirSync(logsDir)) {
      rmSync(join(logsDir, file), { recursive: true, force: true });
    }
  } else {
    // Ensure the directory exists so Docker volume mounts are stable
    mkdirSync(logsDir, { recursive: true });
  }
}
