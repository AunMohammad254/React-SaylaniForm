import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react({
      // Enable React Refresh for HMR
      fastRefresh: true,
    }),
    tailwindcss(),
  ],
  
  // Build optimization
  build: {
    // Generate source maps for debugging (disable in production if not needed)
    sourcemap: false,
    
    // Minification settings
    minify: 'esbuild',
    
    // Target modern browsers for smaller bundle
    target: 'es2020',
    
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'animation': ['framer-motion'],
          'ui': ['lucide-react', 'react-hot-toast'],
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop() ?? 'asset';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // Entry file naming
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Development server settings
  server: {
    port: 3000,
    open: true,
    cors: true,
    // Enable HMR
    hmr: {
      overlay: true,
    },
  },
  
  // Preview server settings
  preview: {
    port: 4173,
    open: true,
  },
  
  // Optimization settings
  optimizeDeps: {
    // Pre-bundle these dependencies for faster dev startup
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'react-hot-toast',
    ],
  },
  
  // Enable CSS modules
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    // Enable CSS source maps in dev
    devSourcemap: true,
  },
  
  // Resolve aliases (optional, for cleaner imports)
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@constants': '/src/constants',
      '@styles': '/src/styles',
      '@assets': '/src/assets',
    },
  },
  
  // Environment variable prefix
  envPrefix: 'VITE_',
});