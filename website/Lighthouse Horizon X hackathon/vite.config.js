import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  test: {
    
    include: ['**/*.test.{js,jsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
    
    
  },
})
