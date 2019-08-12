export default ({ app, store, redirect }, inject) => {
  inject('getUser', async function(force) {
    if (store.state.data.user !== null && !force) {
      return
    }

    try {
      const awaitingEvent = app.$get('/users')
      store.dispatch('addAwaitingEvent', { awaitingEvent })

      const res = await awaitingEvent
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

  inject('getResources', async function(force) {
    if (store.state.data.resources !== null && !force) {
      return
    }

    try {
      const awaitingEvent = app.$get('/resources')
      store.dispatch('addAwaitingEvent', { awaitingEvent })

      const res = await awaitingEvent
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

  inject('getSites', async function(force) {
    if (store.state.data.sites !== null && !force) {
      return
    }

    try {
      const awaitingEvent = app.$get('/sites')
      store.dispatch('addAwaitingEvent', { awaitingEvent })

      const res = await awaitingEvent
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

  inject('getObjectives', async function(force) {
    if (store.state.data.objectives !== null && !force) {
      return
    }

    try {
      const awaitingEvent = app.$get('/objectives')
      store.dispatch('addAwaitingEvent', { awaitingEvent })

      const res = await awaitingEvent
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

      store.commit('SET_OBJECTIVES', { objectives: parsed })
    } catch (e) {
      store.dispatch('showMessage', {
        message: app.i18n.t('error.unknown'),
        isError: true,
      })

      console.error(e)
    }
  })

  inject('getClient', async function(force) {
    if (store.state.data.client !== null && !force) {
      return
    }

    try {
      const awaitingEvent = app.$get('/clients')
      store.dispatch('addAwaitingEvent', { awaitingEvent })

      const res = await awaitingEvent
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

      store.commit('SET_CLIENT', { client: parsed[0] })
    } catch (e) {
      store.dispatch('showMessage', {
        message: app.i18n.t('error.unknown'),
        isError: true,
      })

      console.error(e)
    }
  })

  inject('putUser', async function(payload) {
    if (store.state.data.user === null) {
      return
    }

    try {
      const awaitingEvent = app.$put(
        `/users/${store.state.data.user.id}`,
        payload
      )
      store.dispatch('addAwaitingEvent', { awaitingEvent })

      const res = await app.$put(`/users/${store.state.data.user.id}`, payload)
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

      // new user infos are returned on success
      store.commit('SET_USER', { user: parsed })

      store.dispatch('showMessage', {
        message: app.i18n.t('api.user_updated'),
        isError: false,
      })
    } catch (e) {
      store.dispatch('showMessage', {
        message: app.i18n.t('error.unknown'),
        isError: true,
      })

      console.error(e)
    }
  })
}
