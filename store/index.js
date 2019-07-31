import createPersistedState from 'vuex-persistedstate'

export const state = () => ({
  email: 'hello@naito.one',
  api: 'http://127.0.0.1:8000',
  sidebarOpened: false,

  locales: ['en', 'fr'],
  locale: 'en',
  apiToken: null,
  rememberMe: false,
})

export const mutations = {
  SET_SIDEBAR_OPENED(state, { sidebarOpened }) {
    state.sidebarOpened = sidebarOpened
  },
  SET_LOCALE(state, { locale }) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale

      this.app.i18n.locale = locale
    }
  },
}

export const plugins = process.browser
  ? [
      createPersistedState({
        paths: ['locale', 'apiToken'],
      }),
    ]
  : []
