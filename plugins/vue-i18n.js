import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

/**
 * Map from the simple language local to the full locale for number formatting
 */
const numberLocale = {
  en: 'en-ch',
  fr: 'de-ch',
  de: 'de-ch',
}

/**
 * Map from the simple language local to the full locale for date formatting
 */
const dateLocale = {
  en: 'en-ch',
  fr: 'fr-ch',
  de: 'de-ch',
}

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
