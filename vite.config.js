import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        login: resolve(__dirname, 'public/auth/login.html'),
        signup: resolve(__dirname, 'public/auth/signup.html'),
        verify: resolve(__dirname, 'public/auth/verify.html'),
        forgotPassword: resolve(__dirname, 'public/auth/forgot-password.html'),
        resetPassword: resolve(__dirname, 'public/auth/reset-password.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    open: '/auth/login.html',
  },
});
