import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // اضافه کردن پسوندها برای رزولوشن بهتر
  },
});
