// @ts-nocheck
import nodePolyfills from "vite-plugin-node-stdlib-browser";

export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          api: "modern-compiler",
          additionalData: '@use "~/assets/styles/_shared.scss" as shared;',
        },
      },
    },
  },
  css: ["~/assets/styles/global.scss"],
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  compatibilityDate: "2024-12-01",
  modules: [
    "@nuxt/devtools",
    "vue-clerk/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxt/icon",
  ],
  clerk: {
    appearance: {},
    publishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  googleFonts: {
    families: {
      "Open+Sans": [400, 500],
      "Noto+Sans": [400, 500, 600],
    },
    preload: true,
    download: true,
  },
  // sourcemap: {
  //   server: true,
  //   client: true,
  // },
});
