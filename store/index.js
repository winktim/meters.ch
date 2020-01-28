import { DateTime } from 'luxon'
import moment from 'moment'
import {
  indexOnId,
  fixDashboard,
  dateLocale,
  defaultDashboard,
} from '../assets/utils'

export const state = () => ({
  api: `${process.env.API_ROOT}/${process.env.API_VERSION}`,

  isIE: !!document.documentMode,

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
    resourceTypes: null,
    client: null,
    readings: [],
  },
  dataById: {
    alerts: null,
    objectives: null,
    sites: null,
    sensors: null,
    resources: null,
    resourceTypes: null,
  },

  dashboardEdit: {
    undoList: [],
  },
})

export const mutations = {
  // SET
  SET_LOCALE(state, { locale }) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale

      this.app.i18n.locale = locale
      localStorage.setItem('locale', locale)

      // Chart.js uses moment to display dates
      moment.locale(dateLocale[locale])
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

    // convert dashboard if JSON string
    if (typeof state.data.user.dashboard === 'string') {
      try {
        state.data.user.dashboard = JSON.parse(state.data.user.dashboard)
      } catch (e) {
        console.warn('Dashboard parsing error:', e)
        state.data.user.dashboard = defaultDashboard()
      }
    } else if (state.data.user.dashboard === null) {
      state.data.user.dashboard = defaultDashboard()
    }

    // fix the daashboard in any case because it might be invalid
    state.data.user.dashboard = fixDashboard(
      state.data.user.dashboard,
      state.dataById.resources
    )
  },
  SET_CLIENT(state, { client }) {
    state.data.client = client
  },

  SET_RESOURCES(state, { resources }) {
    state.data.resources = resources
    state.dataById.resources = indexOnId(resources)

    // fix dashboard if we have user data
    if (state.data.user !== null) {
      state.data.user.dashboard = fixDashboard(
        state.data.user.dashboard,
        state.dataById.resources
      )
    }
  },
  SET_RESOURCE_TYPES(state, { resourceTypes }) {
    state.data.resourceTypes = resourceTypes
    state.dataById.resourceTypes = indexOnId(resourceTypes)
  },
  SET_SENSORS(state, { sensors }) {
    state.data.sensors = sensors
    state.dataById.sensors = indexOnId(sensors)
  },
  SET_SITES(state, { sites }) {
    state.data.sites = sites
    state.dataById.sites = indexOnId(sites)
  },
  SET_OBJECTIVES(state, { objectives }) {
    state.data.objectives = objectives
    state.dataById.objectives = indexOnId(objectives)
  },
  SET_ALERTS(state, { alerts }) {
    state.data.alerts = alerts
    state.dataById.alerts = indexOnId(alerts)
  },
  SET_IS_APP_LOADING(state, { isAppLoading }) {
    state.isAppLoading = isAppLoading
  },
  SET_READ_CLIENT_DATA(state, { readClientData }) {
    state.readClientData = readClientData
  },

  // UPDATE
  UPDATE_OBJECTIVE(state, { objective }) {
    const current = state.dataById.objectives[objective.id]
    Object.assign(current, objective)
  },
  UPDATE_ALERT(state, { alert }) {
    const current = state.dataById.alerts[alert.id]
    Object.assign(current, alert)
  },
  UPDATE_DASHBOARD(state, { dashboard }) {
    if (!state.data.user) {
      return
    }

    state.data.user.dashboard = dashboard
  },

  // ADD
  ADD_OBJECTIVE(state, { objective }) {
    state.data.objectives.push(objective)
    state.dataById.objectives[objective.id] = objective
  },
  ADD_ALERT(state, { alert }) {
    state.data.alerts.push(alert)
    state.dataById.alerts[alert.id] = alert
  },
  ADD_AWAITING_EVENT(state, { awaitingEvent }) {
    state.awaitingEvents.push(awaitingEvent)
  },
  ADD_DASHBOARD_CHART(state, { element }) {
    if (state.data.user === null) {
      console.warn('No user data to add dashboard element')
      return
    }

    state.data.user.dashboard.charts.push(element)
  },
  ADD_DASHBOARD_EDIT(state, { dashboard }) {
    state.dashboardEdit.undoList.push(dashboard)
  },

  // REMOVE
  REMOVE_OBJECTIVE(state, { objective }) {
    const current = state.dataById.objectives[objective.id]

    if (!current) {
      return
    }

    delete state.dataById.objectives[objective.id]

    const index = state.data.objectives.indexOf(current)

    if (index === -1) {
      return
    }

    state.data.objectives.splice(index, 1)
  },
  REMOVE_ALERT(state, { alert }) {
    const current = state.dataById.alerts[alert.id]

    if (!current) {
      return
    }

    delete state.dataById.alerts[alert.id]

    const index = state.data.alerts.indexOf(current)

    if (index === -1) {
      return
    }

    state.data.alerts.splice(index, 1)
  },
  REMOVE_AWAITING_EVENT(state, { awaitingEvent }) {
    state.awaitingEvents.splice(state.awaitingEvents.indexOf(awaitingEvent), 1)
  },
  REMOVE_DASHBOARD_CHART(state, { element }) {
    if (state.data.user === null) {
      console.warn('No user data to remove dashboard element')
      return
    }

    const index = state.data.user.dashboard.charts.indexOf(element)

    if (index === -1) {
      return
    }

    state.data.user.dashboard.charts.splice(index, 1)
  },
  REMOVE_LAST_DASHBOARD_EDIT(state) {
    state.dashboardEdit.undoList.pop()
  },
  REMOVE_ALL_DASHBOARD_EDITS(state) {
    state.dashboardEdit.undoList = []
  },
}

export const actions = {
  showMessage({ commit, dispatch }, { message, isError, time }) {
    commit('SET_MESSAGE', { message, isError })

    dispatch('hideMessage')

    // let the CSS update so that the animation for the message box may trigger again
    requestAnimationFrame(() => {
      commit('SET_SHOW_MESSAGE', { show: true })

      const timeout = setTimeout(() => {
        commit('SET_SHOW_MESSAGE', { show: false })
      }, time || 10000)

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
  validateDashboardChanges({ commit, state }) {
    // no changes
    const numUndos = state.dashboardEdit.undoList.length
    if (numUndos === 0) {
      return
    }

    commit('UPDATE_DASHBOARD', {
      dashboard: state.dashboardEdit.undoList[numUndos - 1],
    })
    commit('REMOVE_ALL_DASHBOARD_EDITS')
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
  dashboard: state =>
    state.data.user ? state.data.user.dashboard : defaultDashboard(),
  clientName: state => (state.data.client ? state.data.client.name : '...'),
  clientNumber: state => (state.data.client ? state.data.client.number : '...'),
  clientEmail: state => (state.data.client ? state.data.client.email : '...'),
  resources: state => (state.data.resources ? state.data.resources : []),
  numResources: state =>
    state.data.resources ? state.data.resources.length : 0,
  numSites: state => (state.data.sites ? state.data.sites.length : 0),
  objectives: state => (state.data.objectives ? state.data.objectives : []),
  alerts: state => (state.data.alerts ? state.data.alerts : []),

  // dashboard edit mode
  dashboardUndoList: state => state.dashboardEdit.undoList,
  dashboardEditCurrent: state => {
    if (state.data.user === null) {
      return defaultDashboard()
    }

    const numUndos = state.dashboardEdit.undoList.length

    if (numUndos === 0) {
      return state.data.user.dashboard
    }

    return state.dashboardEdit.undoList[numUndos - 1]
  },

  // Database relations getters

  resource: state => hasResource => {
    if (!hasResource) {
      return null
    }

    if (state.dataById.resources === null) {
      return null
    }

    return state.dataById.resources[hasResource.resource_id]
  },
  resourceType: state => hasResourceType => {
    if (!hasResourceType) {
      return null
    }

    if (state.dataById.resourceTypes === null) {
      return null
    }

    return state.dataById.resourceTypes[hasResourceType.resource_type_id]
  },
  sensor: state => hasSensor => {
    if (!hasSensor) {
      return null
    }

    if (state.dataById.sensors === null) {
      return null
    }

    return state.dataById.sensors[hasSensor.sensor_id]
  },
  site: state => hasSite => {
    if (!hasSite) {
      return null
    }

    if (state.dataById.sites === null) {
      return null
    }

    return state.dataById.sites[hasSite.site_id]
  },
}
