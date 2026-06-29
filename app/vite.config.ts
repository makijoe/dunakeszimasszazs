import fs from "node:fs"
import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

function asyncCssPlugin() {
  return {
    name: 'async-css',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const patch = (filePath: string) => {
        if (!fs.existsSync(filePath)) return;
        let html = fs.readFileSync(filePath, 'utf8');
        if (html.includes('rel="preload" as="style"')) return;
        html = html.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/,
          '<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" crossorigin href="$1"></noscript>'
        );
        fs.writeFileSync(filePath, html);
      };
      patch(path.join(distDir, 'index.html'));
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (entry.name === 'index.html') patch(full);
        }
      };
      walk(distDir);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@radix-ui')) return 'vendor-ui';
          }
          if (id.includes('/pages/portal-pages')) return 'portal-pages';
        },
      },
    },
  },
  plugins: [
    inspectAttr(),
    react(),
    asyncCssPlugin(),
    ViteImageOptimizer({
      jpg: { quality: 82 },
      jpeg: { quality: 82 },
      png: { quality: 82 },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
