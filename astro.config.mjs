// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: true
  },

  integrations: [react()],

  image: {
    // Use custom noop service (no optimization) - compatible with Termux/Android
    service: {
      entrypoint: './src/services/noop-image-service.ts',
    },
    // Configure remote image domains
    domains: ['images.unsplash.com'],
  },

  vite: {
    plugins: [tailwindcss()]
  }
});