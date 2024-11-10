import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'build/static'),  // Set the frontend output to build/static
    emptyOutDir: true,  // Clears the output directory before each build
  },
  server: {
    host: true,  // This will allow access from your local network
    port: 5713,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});