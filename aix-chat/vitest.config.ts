import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
    include: ['src/**/*.{test,spec}.ts?(x)'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
    },
  },
});


