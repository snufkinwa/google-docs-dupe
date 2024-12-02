// @ts-nocheck
import nodePolyfills from "vite-plugin-node-stdlib-browser";

export default defineNuxtConfig({
  vite: {
    plugins: [nodePolyfills()],
    app: {
      head: {
        link: [{ rel: "icon", type: "image/ico", href: "/favicon.ico" }],
      },
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@import "@/assets/style/global.sass"',
        },
      },
    },
    optimizeDeps: {
      include: ["@taleweaver/core"],
    },
  },
  compatibilityDate: "2024-12-01",
  modules: ["@nuxt/devtools"],
  // sourcemap: {
  //   server: true,
  //   client: true,
  // },
});
