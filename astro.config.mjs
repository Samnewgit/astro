// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Enable server-side rendering for API endpoints
  output: 'server',
  adapter: cloudflare(),
  // Make environment variables available at build time
  vite: {
    define: {
      'import.meta.env.DEEPSEEK_API_KEY': JSON.stringify(process.env.DEEPSEEK_API_KEY),
    },
  },
});
