export default ({ store }) => {
  const locale = localStorage.getItem('locale')
  if (locale) {
    store.commit('SET_LOCALE', { locale })
  }

  const apiToken = localStorage.getItem('apiToken')
  if (apiToken) {
    store.commit('SET_API_TOKEN', { apiToken })
  }

  const hasConnected = localStorage.getItem('hasConnected')
  if (hasConnected) {
    store.commit('SET_IS_PROBABLY_CLIENT', { isProbablyClient: hasConnected })
  }
}
