import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' ทำให้ build ไปวางที่โฮสต์ไหนก็ได้ (GitHub Pages, Netlify, โฟลเดอร์ย่อย)
export default defineConfig({
  plugins: [react()],
  base: './',
})
