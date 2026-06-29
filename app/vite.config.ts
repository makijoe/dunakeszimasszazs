import fs from "node:fs"
import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

function patchHtmlFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('rel="preload" as="style"')) {
    html = html.replace(
      /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/,
      '<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" crossorigin href="$1"></noscript>'
    );
  }

  const entryMatch = html.match(/<script type="module" crossorigin src="(\/assets\/index-[^"]+\.js)"><\/script>/);
  if (entryMatch && !html.includes('rel="modulepreload"')) {
    const href = entryMatch[1];
    html = html.replace(
      /<script type="module"/,
      `<link rel="modulepreload" href="${href}" crossorigin />\n    <script type="module"`
    );
  }

  fs.writeFileSync(filePath, html);
}

function postBuildHtmlPlugin() {
  return {
    name: 'post-build-html',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      patchHtmlFile(path.join(distDir, 'index.html'));
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (entry.name === 'index.html') patchHtmlFile(full);
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
    ...(process.env.NODE_ENV !== 'production' ? [inspectAttr()] : []),
    react(),
    postBuildHtmlPlugin(),
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
