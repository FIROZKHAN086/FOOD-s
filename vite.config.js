import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        './apple-icon-114x114/png'
      ],
      manifest: {
        name: 'Kings Food',
        short_name: 'KingsFood',
        description: 'Best online food ordering app 🍔',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffff',
        icons: [
          {
            src: './icons/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './icons/apple-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: './icons/apple-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  }
})
