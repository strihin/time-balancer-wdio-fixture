import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Erases the contents of the local .logs directory prior to executing testing suites,
 * safely sidestepping Docker volume mount point destruction (EBUSY).
 */
export function purgeLogs() {
  const logsDir = resolve('.logs');
  if (existsSync(logsDir)) {
    for (const file of readdirSync(logsDir)) {
      rmSync(join(logsDir, file), { recursive: true, force: true });
    }
  }
}
