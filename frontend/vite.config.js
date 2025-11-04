
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { env } from 'process';

const target = env.VITE_API_URL;

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
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
