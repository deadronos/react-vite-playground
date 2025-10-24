import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest configuration with Vite plugins and coverage using coverage-v8
export default defineConfig({
  plugins: [react()] as any,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json'],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['**/node_modules/**', 'test/**', 'src/**/*.test.{ts,tsx}'],
      thresholds: {
        global: {
          lines: 80,
          statements: 80,
          branches: 70,
          functions: 75,
        },
      },
    },
  },
}) as any;
