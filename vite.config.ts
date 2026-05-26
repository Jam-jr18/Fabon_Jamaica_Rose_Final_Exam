import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile()
  ],

  server: {
    host: '0.0.0.0'
  },

  preview: {
    host: '0.0.0.0',
    port: process.env.PORT,
    allowedHosts: [
      'fabon-jamaica-rose-final-exam.onrender.com'
    ]
  }
})
