import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Use import.meta.url to derive the directory path
const dirname = new URL('.', import.meta.url).pathname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'), // Use dirname derived from import.meta.url
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
