export default ({ app, store, redirect }, inject) => {
  function classic(method, route, params) {
    return new Promise(async (resolve, reject) => {
      try {
        const awaitingEvent = app['$' + method](route, params)
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

          reject(res.status)
        }

        resolve(parsed)
      } catch (e) {
        store.dispatch('showMessage', {
          message: app.i18n.t('error.unknown'),
          isError: true,
        })

        console.error(e)
        reject(e)
      }
    })
  }

  inject('getUser', async function(force) {
    if (store.state.data.user !== null && !force) {
      return
    }

    try {
      const parsed = await classic('get', '/users')
      store.commit('SET_USER', { user: parsed[0] })
    } catch (e) {}
  })

  inject('getResources', async function(force) {
    if (store.state.data.resources !== null && !force) {
      return
    }

    try {
      const parsed = await classic('get', '/resources')
      store.commit('SET_RESOURCES', { resources: parsed })
    } catch (e) {}
  })

  inject('getResourceTypes', async function(force) {
    if (store.state.data.resourceTypes !== null && !force) {
      return
    }

    try {
      const parsed = await classi('get', '/resourceTypes')
      store.commit('SET_RESOURCE_TYPES', { resourceTypes: parsed })
    } catch (e) {}
  })

  inject('getSites', async function(force) {
    if (store.state.data.sites !== null && !force) {
      return
    }

    try {
      const parsed = await classic('get', '/sites')
      store.commit('SET_SITES', { sites: parsed })
    } catch (e) {}
  })

  inject('getObjectives', async function(force) {
    if (store.state.data.objectives !== null && !force) {
      return
    }

    try {
      const parsed = await classic('get', '/objectives')
      store.commit('SET_OBJECTIVES', { objectives: parsed })
    } catch (e) {}
  })

  inject('getClient', async function(force) {
    if (store.state.data.client !== null && !force) {
      return
    }

    try {
      const parsed = await classic('get', '/clients')
      store.commit('SET_CLIENT', { client: parsed[0] })
    } catch (e) {}
  })

  inject('putUser', async function(payload) {
    if (store.state.data.user === null) {
      return
    }

    try {
      const parsed = await classic(
        'put',
        `/users/${store.state.data.user.id}`,
        payload
      )

      // new user infos are returned on success
      store.commit('SET_USER', { user: parsed })

      store.dispatch('showMessage', {
        message: app.i18n.t('api.user_updated'),
        isError: false,
      })
    } catch (e) {}
  })
}
