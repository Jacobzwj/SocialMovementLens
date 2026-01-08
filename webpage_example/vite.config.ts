import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 允许通过 IP 访问，绕过部分 VPN 限制
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8000' // 强制使用 IPv4 本地地址
    }
  }
})

