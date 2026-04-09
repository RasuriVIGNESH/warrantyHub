import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
      hmr: {
        clientPort: 443
      },
      allowedHosts: ['3000-iv0n35psf1vp1akvm8hva-19f10cf5.manusvm.computer']
    },
    // Define env variables to expose to the client
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
      __MODE__: JSON.stringify(env.VITE_MODE)
    }
  }
})
