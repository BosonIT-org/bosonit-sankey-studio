import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  base: '/bosonit-sankey-studio/',
  server: { port: 5173 },
  build: { outDir: 'dist' },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
});