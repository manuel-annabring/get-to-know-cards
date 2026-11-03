import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative asset paths, so the build works under any path (GitHub Pages sub-path).
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
  test: {
    environment: 'node',
    css: { include: [/.*/] },
    include: ['src/**/*.test.ts'],
  },
});
