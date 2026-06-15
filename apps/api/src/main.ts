/**
 * @file main.ts
 * @description Entry point for the @kabah/api server.
 *
 * Loads environment config, starts the Express app and listens on the
 * configured port.
 */

import { app } from './app.js';
import { logger } from './shared/logger.js';

const PORT = process.env['PORT'] !== undefined ? Number(process.env['PORT']) : 3001;

app.listen(PORT, () => {
  logger.info(`Kabah API running on port ${PORT}`, {
    env: process.env['NODE_ENV'] ?? 'development',
    port: PORT,
  });
});
