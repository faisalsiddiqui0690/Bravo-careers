import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react(),
    // Gzip compression for all assets
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: 'localhost',
    port: 4000,
  },
  build: {
    // Use esbuild for faster builds with more aggressive minification
    minify: 'esbuild',
    target: 'es2015',
    // Code splitting with better chunk strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
        // Smaller chunk size for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Smaller chunks
    chunkSizeWarningLimit: 600,
    // No sourcemaps in production for faster builds and smaller size
    sourcemap: false,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Reduce asset inline size limit (smaller base64 embeds)
    assetsInlineLimit: 2048,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Faster module resolution
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
