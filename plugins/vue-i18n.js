import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { numberLocale, dateLocale } from '../assets/utils'

Vue.use(VueI18n)

export default ({ app, store }, inject) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'en',
    messages: {
      en: require('~/locales/en.json'),
      fr: require('~/locales/fr.json'),
    },
  })

  inject('numberLocale', function() {
    return numberLocale[store.state.locale]
  })

  inject('dateLocale', function() {
    return dateLocale[store.state.locale]
  })
}
