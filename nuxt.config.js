import path from 'path'
import glob from 'glob-all'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Naito One',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', 'content': 'ie=edge' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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
  plugins: ['~/plugins/vue-i18n'],
  /*
   ** Nuxt.js modules
   */
  modules: ['nuxt-purgecss'],

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
}
