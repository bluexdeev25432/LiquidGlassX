import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'LiquidGlassX';
const base = process.env.VITE_BASE ?? (process.env.CI ? `/${repoName}/` : '/');

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    chunkSizeWarningLimit: 800,
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  }
});
