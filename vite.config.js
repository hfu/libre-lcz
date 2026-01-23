import { defineConfig } from 'vite';
import inlineAssetsPlugin from './inline-plugin.js';

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      }
    },
    cssCodeSplit: false,
  },
  plugins: [inlineAssetsPlugin()],
});
