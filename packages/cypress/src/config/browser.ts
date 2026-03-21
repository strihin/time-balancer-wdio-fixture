/**
 * Chromium browser launch args to bypass macOS 15 GPU sandbox crashes
 * in headed mode (Chrome, Chromium, Edge).
 */
export const chromiumLaunchArgs: string[] = [
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-software-rasterizer',
];
