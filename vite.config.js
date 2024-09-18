import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        docs: './docs.html',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ww2.lu',
        changeOrigin: true,
        // rewrite: (path) => {
        //   console.log('proxy path', path)
        //   return path.replace(/^\/api/, '/api')
        // },
      },
    },
  },
})
