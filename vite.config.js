import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// React plugin enables JSX and Fast Refresh for React components
export default defineConfig({
  plugins: [react()],
})
