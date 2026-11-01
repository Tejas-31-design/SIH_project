import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: '.vite_cache',
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'lucide-react',
        replacement: path.resolve(__dirname, 'node_modules/lucide-react/dist/cjs/lucide-react.js'),
      },
      {
        find: /^lodash\/(.*)/,
        replacement: path.resolve(__dirname, 'node_modules/lodash/$1.js'),
      },
    ],
  },
})
