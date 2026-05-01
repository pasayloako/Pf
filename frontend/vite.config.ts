import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // esbuild is built into Vite, no installation needed
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  optimizeDeps: {
    include: ['three', 'gsap', 'typed.js']
  }
});
