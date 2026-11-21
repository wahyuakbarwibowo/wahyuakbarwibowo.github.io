import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://wahyuakbarwibowo.github.io',
  base: '/',
  vite: { plugins: [tailwindcss()] },
});
