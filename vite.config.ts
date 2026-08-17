import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site is served from https://stergioscha.github.io/karagiorgou/
// When moving to a custom domain, set base to '/' (see README).
export default defineConfig({
  base: '/karagiorgou/',
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
