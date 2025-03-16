import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  esbuild: {
    loader: {
      '.js': 'jsx', // تنظیم لودر برای فایل‌های .js به jsx
    },
  },
});