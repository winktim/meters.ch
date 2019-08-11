import path from 'path'
import glob from 'glob-all'

import config from './config'

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Meters',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', 'content': 'ie=edge' },
      {
        hid: 'description',
        name: 'description',
        content:
          "Meters is a service that helps you manage your company's energy consumption and temperatures",
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    noscript: [{ innerHTML: 'This website requires JavaScript.' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/scss/tailwind.scss',
    '~/assets/scss/icons.scss',
    '~/assets/scss/components.scss',
    '~/assets/scss/fonts.scss',
    '~/assets/scss/styles.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-i18n',
    { src: '~/plugins/requests', mode: 'client' },
    { src: '~/plugins/api', mode: 'client' },
  ],

  router: {
    middleware: 'client-data',
  },

  /*
   ** Nuxt.js modules
   */
  modules: ['nuxt-purgecss', '@nuxtjs/pwa'],

  // PWA
  manifest: {
    name: 'Meters.ch',
    author: 'Naito One',
    description:
      "Meters is a service that helps you manage your company's energy consumption and temperatures",
    theme_color: '#3C6285',
  },

  purgeCSS: {
    paths: glob.sync([
      path.join(__dirname, './pages/**/*.vue'),
      path.join(__dirname, './components/**/*.vue'),
    ]),
  },

  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js',
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },

  env: config.parsed,
}
