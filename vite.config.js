import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: "/soapstoneapp/", 
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Orange Soapstone",
        short_name: "Soapstone",
        description: "Leave messages on the map.",
        theme_color: "#1a110a",
        background_color: "#1a110a",
        display: "standalone",
        icons: [
          {
            src: "icon_x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon_x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
})