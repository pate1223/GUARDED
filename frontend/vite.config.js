
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const target = JSON.stringify(process.env.VITE_API_URL);

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    VITE_API_URL: target,
  },
  server: {
    port: 3001,
    proxy: {
      '/api/': {
        target
      },
    }
  }
});
