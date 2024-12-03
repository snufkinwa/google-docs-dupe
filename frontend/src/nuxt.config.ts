// @ts-nocheck
import nodePolyfills from "vite-plugin-node-stdlib-browser";

export default defineNuxtConfig({
  vite: {
    plugins: [nodePolyfills()],
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@import "~/assets/styles/_shared.sass"',
        },
      },
    },
    optimizeDeps: {
      include: ["@taleweaver/core"],
    },
  },
  css: ["~/assets/styles/global.scss"],
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  compatibilityDate: "2024-12-01",
  modules: ["@nuxt/devtools", "@clerk/nuxt", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      "Open+Sans": [400, 500],
    },
    preload: true,
    download: true,
  },
  // sourcemap: {
  //   server: true,
  //   client: true,
  // },
});
