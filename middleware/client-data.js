export default function({ store }) {
  console.log('running client data')
  const locale = localStorage.getItem('locale')
  if (locale) {
    // set it immidiatly for the first requests to use it
    store.commit('SET_LOCALE', { locale })
  }

  const apiToken = localStorage.getItem('apiToken')
  if (apiToken) {
    store.commit('SET_API_TOKEN', { apiToken })
  }

  const hasConnected = localStorage.getItem('hasConnected')
  if (hasConnected) {
    store.commit('SET_IS_PROBABLY_CLIENT', {
      isProbablyClient: hasConnected === 'true',
    })
  }
}
