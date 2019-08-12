function getNavigatorLanguage() {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0]
  } else {
    return (
      navigator.userLanguage ||
      navigator.language ||
      navigator.browserLanguage ||
      'en'
    )
  }
}

export default function({ store }) {
  if (store.state.readClientData) {
    return
  }

  const locale = localStorage.getItem('locale')
  store.commit('SET_LOCALE', { locale: locale || getNavigatorLanguage() })

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

  store.commit('SET_READ_CLIENT_DATA', { readClientData: true })
}
