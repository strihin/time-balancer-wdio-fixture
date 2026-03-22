import * as fs from 'fs';
import * as path from 'path';

/**
 * Erases the contents of the local .logs directory prior to executing testing suites, 
 * safely sidestepping Docker volume mount point destruction (EBUSY).
 */
export function purgeLogs() {
  const logsDir = path.resolve('.logs');
  if (fs.existsSync(logsDir)) {
    fs.readdirSync(logsDir).forEach(file => {
      fs.rmSync(path.join(logsDir, file), { recursive: true, force: true });
    });
  }
}
