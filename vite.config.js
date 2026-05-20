import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from './vite-plugin-sitemap.js';

export default defineConfig({
  plugins: [react(), sitemap()],
});
