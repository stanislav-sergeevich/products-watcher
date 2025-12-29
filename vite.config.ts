import {type ConfigEnv, defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/'),
      },
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'src/popup.html'),
          background: resolve(__dirname, 'src/background/index.ts'),
        },
        // @ts-ignore
        output: {
          entryFileNames: (chunk) => {
            if (chunk.name === 'background') return 'background.js';
            return 'assets/[name].js';
          },
        }
      },
      outDir: 'dist',
      emptyOutDir: mode === 'production'
    }
  }
});
