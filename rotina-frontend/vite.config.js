import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuração para GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/sistema-rotina-recompensas/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Otimizações para produção
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-switch']
        }
      }
    }
  },
  // Configurações do servidor de desenvolvimento
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
  // Configurações de preview
  preview: {
    host: true,
    port: 4173,
  }
})

