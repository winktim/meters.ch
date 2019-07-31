export const state = () => ({
  email: 'hello@naito.one',
  api: 'http://127.0.0.1:8000',
  sidebarOpened: false,

  locales: ['en', 'fr'],
  locale: 'en',
  apiToken: null,
  rememberMe: false,
  isProbablyClient: false,
})

export const mutations = {
  SET_SIDEBAR_OPENED(state, { sidebarOpened }) {
    state.sidebarOpened = sidebarOpened
  },
  SET_LOCALE(state, { locale }) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale

      this.app.i18n.locale = locale
      localStorage.setItem('locale', locale)
      document.documentElement.lang = locale
    }
  },
  SET_API_TOKEN(state, { apiToken }) {
    state.apiToken = apiToken
    state.isProbablyClient = true

    if (state.rememberMe) {
      localStorage.setItem('apiToken', apiToken)
    }
  },
  SET_REMEMBER_ME(state, { rememberMe }) {
    state.rememberMe = rememberMe
  },
  SET_IS_PROBABLY_CLIENT(state, { isProbablyClient }) {
    state.isProbablyClient = isProbablyClient
  },
}
