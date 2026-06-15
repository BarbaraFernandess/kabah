import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['tests/**/*.test.ts'],
    alias: {
      '@kabah/engine': new URL('../../packages/engine/src/index.ts', import.meta.url).pathname,
    },
  },
});
