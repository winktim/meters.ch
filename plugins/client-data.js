export default ({ store }) => {
  const locale = localStorage.getItem('locale')
  if (locale) {
    // set it immidiatly for the first requests to use it
    store.commit('SET_LOCALE', { locale })
    setImmediate(() => {
      /// unset then reset it so the nuxt head gets re-rendered
      store.commit('SET_LOCALE', { locale: 'en' })
      store.commit('SET_LOCALE', { locale })
    })
  }

  const apiToken = localStorage.getItem('apiToken')
  if (apiToken) {
    store.commit('SET_API_TOKEN', { apiToken })
  }

  const hasConnected = localStorage.getItem('hasConnected')
  if (hasConnected) {
    // delay it to avoid mismatched DOM between server and client (don't really know why it happens though)
    setImmediate(() => {
      store.commit('SET_IS_PROBABLY_CLIENT', { isProbablyClient: hasConnected })
    })
  }
}
