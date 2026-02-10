import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  compilerOptions: {
    experimental: {
      async: true
    }
  },
  kit: {
    experimental: {
      remoteFunctions: true
    },
    adapter: adapter(),
    alias: {
      "~components": "src/components",
      "~libs": "src/libs",
      "~remotes": "src/remotes",
      "~stores": "src/stores",
      "~utils": "src/utils"
    }
  }
};

export default config;
