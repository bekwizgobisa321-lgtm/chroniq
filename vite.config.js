import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Two entry points, because an extension has two parts:
//   popup      -> index.html (the React page you see when you click the icon)
//   background -> src/background.js (the service worker, plain JavaScript)
//
// entryFileNames keeps the file names fixed (no random hashes),
// because manifest.json refers to "background.js" by name.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
        background: 'src/background.js',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
})
