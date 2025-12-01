import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      // Base path: production (GitHub Pages) vs development (local)
      base: mode === 'production' ? '/Clo-Visual/' : '/',
      plugins: [react()],
      // Vite automatically exposes env vars prefixed with VITE_ to client
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
