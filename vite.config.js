// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 서비스워커가 자동으로 새 버전 가져오게
      registerType: 'autoUpdate',
      workbox: {
        // 어떤 파일들을 캐시할지
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        id: '/', // App ID 명시해주면 경고 하나 사라짐
        name: 'Sportly',
        short_name: 'Sportly',
        start_url: '/',
        display: 'standalone',
        background_color: '#f7f5f0',
        theme_color: '#f4c94f',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        // 이건 지금 당장은 없어도 되고, 경고 없애고 싶으면 넣기
        // public/screenshots/ 에 스샷 2장 넣었을 때만 켜
        // screenshots: [
        //   {
        //     src: '/screenshots/home-wide.png',
        //     sizes: '1280x720',
        //     type: 'image/png',
        //     form_factor: 'wide',
        //   },
        //   {
        //     src: '/screenshots/home-mobile.png',
        //     sizes: '750x1334',
        //     type: 'image/png',
        //   },
        // ],
      },
    }),
  ],
})
