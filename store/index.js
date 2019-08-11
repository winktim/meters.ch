export const state = () => ({
  api: `${process.env.API_ROOT}/${process.env.API_VERSION}`,

  locales: ['en', 'fr', 'de'],
  locale: 'en',
  apiToken: null,
  rememberMe: false,
  isProbablyClient: false,

  messageBox: {
    show: false,
    isError: false,
    lastMessage: '',
    timeout: null,
  },

  data: {
    user: null,
    alerts: null,
    objectives: null,
    sites: null,
    sensors: null,
    resources: null,
    readings: [],
  },
})

export const mutations = {
  SET_LOCALE(state, { locale }) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale

      this.app.i18n.locale = locale
      localStorage.setItem('locale', locale)
      // document.documentElement.lang = locale
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
  SET_MESSAGE(state, { message, isError }) {
    state.messageBox.lastMessage = message
    state.messageBox.isError = isError
  },
  SET_SHOW_MESSAGE(state, { show }) {
    state.messageBox.show = show
  },
  SET_MESSAGE_TIMEOUT(state, { timeout }) {
    state.messageBox.timeout = timeout
  },
  SET_USER(state, { user }) {
    state.data.user = user
  },
  SET_RESOURCES(state, { resources }) {
    state.data.resources = resources
  },
  SET_SITES(state, { sites }) {
    state.data.sites = sites
  },
}

export const actions = {
  showMessage({ commit, state }, { message, isError }) {
    commit('SET_MESSAGE', { message, isError })

    clearTimeout(state.messageBox.timeout)

    commit('SET_SHOW_MESSAGE', { show: true })

    const timeout = setTimeout(() => {
      commit('SET_SHOW_MESSAGE', { show: false })
    }, 10000)

    commit('SET_MESSAGE_TIMEOUT', { timeout })
  },
  hideMessage({ commit, state }) {
    clearTimeout(state.messageBox.timeout)

    commit('SET_SHOW_MESSAGE', { show: false })
  },
  logout({ commit }) {
    commit('SET_REMEMBER_ME', { rememberMe: false })
    commit('SET_API_TOKEN', { apiToken: null })
    localStorage.removeItem('apiToken')
  },
}

export const getters = {
  name: state => (state.data.user ? state.data.user.name : '...'),
  numResources: state =>
    state.data.resources ? state.data.resources.length : 0,
  numSites: state => (state.data.sites ? state.data.sites.length : 0),
}
