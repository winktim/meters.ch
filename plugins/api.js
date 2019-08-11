export default ({ app, store, redirect }, inject) => {
  inject('fetchUser', async function(force) {
    if (store.state.data.user !== null && !force) {
      return
    }

    try {
      const res = await app.$get('/users')

      const parsed = await res.json()

      if (!res.ok) {
        store.dispatch('showMessage', {
          message: parsed.message,
          isError: true,
        })

        if (res.status === 401 || res.status === 403) {
          store.dispatch('logout')
          redirect('/login')
        }

        return
      }

      store.commit('SET_USER', { user: parsed[0] })
    } catch (e) {
      store.dispatch('showMessage', {
        message: app.i18n.t('error.unknown'),
        isError: true,
      })

      console.error(e)
    }
  })

  inject('fetchResources', async function(force) {
    if (store.state.data.resources !== null && !force) {
      return
    }

    try {
      const res = await app.$get('/resources')

      const parsed = await res.json()

      if (!res.ok) {
        store.dispatch('showMessage', {
          message: parsed.message,
          isError: true,
        })

        if (res.status === 401 || res.status === 403) {
          store.dispatch('logout')
          redirect('/login')
        }

        return
      }

      store.commit('SET_RESOURCES', { resources: parsed })
    } catch (e) {
      store.dispatch('showMessage', {
        message: app.i18n.t('error.unknown'),
        isError: true,
      })

      console.error(e)
    }
  })

  inject('fetchSites', async function(force) {
    if (store.state.data.sites !== null && !force) {
      return
    }

    try {
      const res = await app.$get('/sites')

      const parsed = await res.json()

      if (!res.ok) {
        store.dispatch('showMessage', {
          message: parsed.message,
          isError: true,
        })

        if (res.status === 401 || res.status === 403) {
          store.dispatch('logout')
          redirect('/login')
        }

        return
      }

      store.commit('SET_SITES', { sites: parsed })
    } catch (e) {
      store.dispatch('showMessage', {
        message: app.i18n.t('error.unknown'),
        isError: true,
      })

      console.error(e)
    }
  })
}
