import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import mkcert from 'vite-plugin-mkcert';

// Vite configuration
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  // ensure relative asset paths in index.html file
  base: './',
  plugins: [
    // add type check directly to vite
    checker({ typescript: true, overlay: false }),
    // ssl für lokalen dev server (cors int api)
    mkcert(),
  ],
}));
