
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React bundle
          'react-vendor': ['react', 'react-dom'],
          // Router for navigation
          'router': ['react-router-dom'],
          // UI components that are used everywhere
          'ui-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-toast',
            '@radix-ui/react-slot'
          ],
          // Icons used throughout the app
          'icons': ['lucide-react'],
          // Data fetching
          'query': ['@tanstack/react-query'],
          // Auth and database
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 500,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'lucide-react',
      '@tanstack/react-query',
      '@supabase/supabase-js'
    ],
    // Force optimization of these packages
    force: true,
  },
  // Enable better caching
  cacheDir: 'node_modules/.vite',
}));
