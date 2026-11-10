import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@toast-ui/react-editor',
      '@toast-ui/editor',
      '@toast-ui/editor-plugin-code-syntax-highlight',
      '@toast-ui/editor-plugin-color-syntax',
    ],
  },
  css: {
    lightningcss: {
      errorRecovery: true,
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    env: { VITE_API_URL: 'http://api.test' },
    restoreMocks: true,
  },
});
