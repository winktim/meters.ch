import { DateTime } from 'luxon'

export const state = () => ({
  api: `${process.env.API_ROOT}/${process.env.API_VERSION}`,

  locales: ['en', 'fr', 'de'],
  locale: 'en',
  apiToken: null,
  rememberMe: false,
  isProbablyClient: false,
  readClientData: false,

  messageBox: {
    show: false,
    isError: false,
    lastMessage: '',
    timeout: null,
  },

  isAppLoading: false,
  awaitingEvents: [],

  data: {
    user: null,
    alerts: null,
    objectives: null,
    sites: null,
    sensors: null,
    resources: null,
    client: null,
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
  SET_CLIENT(state, { client }) {
    state.data.client = client
  },
  SET_OBJECTIVES(state, { objectives }) {
    state.data.objectives = objectives
  },
  SET_IS_APP_LOADING(state, { isAppLoading }) {
    state.isAppLoading = isAppLoading
  },
  ADD_AWAITING_EVENT(state, { awaitingEvent }) {
    state.awaitingEvents.push(awaitingEvent)
  },
  REMOVE_AWAITING_EVENT(state, { awaitingEvent }) {
    state.awaitingEvents.splice(state.awaitingEvents.indexOf(awaitingEvent), 1)
  },
  SET_READ_CLIENT_DATA(state, { readClientData }) {
    state.readClientData = readClientData
  },
}

export const actions = {
  showMessage({ commit, dispatch }, { message, isError }) {
    commit('SET_MESSAGE', { message, isError })

    dispatch('hideMessage')

    // let the CSS update so that the animation for the message box may trigger again
    requestAnimationFrame(() => {
      commit('SET_SHOW_MESSAGE', { show: true })

      const timeout = setTimeout(() => {
        commit('SET_SHOW_MESSAGE', { show: false })
      }, 10000)

      commit('SET_MESSAGE_TIMEOUT', { timeout })
    })
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
  addAwaitingEvent({ commit, state }, { awaitingEvent }) {
    if (!state.isAppLoading) {
      commit('SET_IS_APP_LOADING', { isAppLoading: true })
    }
    commit('ADD_AWAITING_EVENT', { awaitingEvent })

    awaitingEvent.finally(() => {
      commit('REMOVE_AWAITING_EVENT', { awaitingEvent })

      if (state.awaitingEvents.length === 0 && state.isAppLoading) {
        commit('SET_IS_APP_LOADING', { isAppLoading: false })
      }
    })
  },
}

export const getters = {
  name: state => (state.data.user ? state.data.user.name : '...'),
  email: state => (state.data.user ? state.data.user.email : '...'),
  userLocale: state =>
    state.data.user ? state.data.user.locale : state.locale,
  accountCreatedAt: state =>
    state.data.user
      ? DateTime.fromISO(state.data.user.created_at)
      : DateTime.local(),
  clientName: state => (state.data.client ? state.data.client.name : '...'),
  clientNumber: state => (state.data.client ? state.data.client.number : '...'),
  clientEmail: state => (state.data.client ? state.data.client.email : '...'),
  numResources: state =>
    state.data.resources ? state.data.resources.length : 0,
  numSites: state => (state.data.sites ? state.data.sites.length : 0),
}
