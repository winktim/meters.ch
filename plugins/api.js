export default ({ app, store, redirect }, inject) => {
  function classic(method, route, params) {
    return new Promise(async (resolve, reject) => {
      try {
        const awaitingEvent = app['$' + method](route, params)
        store.dispatch('addAwaitingEvent', { awaitingEvent })

        const res = await awaitingEvent
        const parsed = await res.json()

        if (!res.ok) {
          if (parsed.errors) {
            // get and show the first error message
            const firstError = Object.values(parsed.errors)[0][0]
            store.dispatch('showMessage', {
              message: firstError,
              isError: true,
            })
          } else {
            store.dispatch('showMessage', {
              message: parsed.message,
              isError: true,
            })
          }

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
      const parsed = await classic('get', '/resourceTypes')
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

  inject('getSensors', async function(force) {
    if (store.state.data.sensors !== null && !force) {
      return
    }

    try {
      const parsed = await classic('get', '/sensors')
      store.commit('SET_SENSORS', { sensors: parsed })
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

  // PUT

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
        time: 1500,
      })
    } catch (e) {}
  })

  inject('putObjective', async function(payload) {
    if (store.state.data.objectives === null) {
      return
    }

    try {
      const parsed = await classic('put', `/objectives/${payload.id}`, payload)

      // new objective infos are returned on success
      store.commit('UPDATE_OBJECTIVE', { objective: parsed })

      store.dispatch('showMessage', {
        message: app.i18n.t('api.objective_updated'),
        isError: false,
        time: 1500,
      })
    } catch (e) {}
  })

  // POST

  inject('postObjective', async function(payload) {
    if (store.state.data.objectives === null) {
      return
    }

    try {
      const parsed = await classic('post', '/objectives', payload)

      // new objective infos are returned on success
      store.commit('ADD_OBJECTIVE', { objective: parsed })

      store.dispatch('showMessage', {
        message: app.i18n.t('api.objective_created'),
        isError: false,
        time: 1500,
      })
    } catch (e) {}
  })
}
