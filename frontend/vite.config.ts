import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    define: {
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(
        process.env.NEXT_PUBLIC_API_URL || env.NEXT_PUBLIC_API_URL || env.VITE_API_URL || ''
      )
    }
  }
})
