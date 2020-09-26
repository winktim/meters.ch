function withBody(method, path, params) {
  return fetch(path, {
    method,
    mode: 'cors',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })
}

function withQuery(method, path, params) {
  const url = new URL(path)
  url.search = new URLSearchParams(params)

  return fetch(url, {
    method,
    mode: 'cors',
    headers: {
      Accept: 'application/json',
    },
  })
}

/**
 * Append the API root to the path
 * @param {string} path the relative path on the API
 * @param {{}} state the app state
 * @returns {string} the absolute path
 */
function prepPath(path, state) {
  return state.api + path
}

/**
 * Add the locale and the api token if it exists to the parameters
 * @param {{}} params the current parameters
 * @param {{}} state the app state
 * @returns {{}} the modified parameters
 */
function prepParams(params, state) {
  const output = { ...params }

  // add locale if not already included
  if (!output.hasOwnProperty('locale')) {
    output['locale'] = state.locale
  }
  // add token if exists
  if (state.apiToken) {
    output['api_token'] = state.apiToken
  }

  return output
}

export default ({ store }, inject) => {
  /**
   * Read a resource as JSON using query parameters
   * @param {string} path
   * @param {any} params
   * @returns {Promise<Response>}
   */
  function $get(path, params) {
    return withQuery(
      'GET',
      prepPath(path, store.state),
      prepParams(params || {}, store.state)
    )
  }

  /**
   * Create a resource as JSON using body JSON parameters
   * @param {string} path
   * @param {any} params
   * @returns {Promise<Response>}
   */
  function $post(path, params) {
    return withBody(
      'POST',
      prepPath(path, store.state),
      prepParams(params || {}, store.state)
    )
  }

  /**
   * Update a resource as JSON using body JSON parameters
   * @param {string} path
   * @param {any} params
   * @returns {Promise<Response>}
   */
  function $put(path, params) {
    return withBody(
      'PUT',
      prepPath(path, store.state),
      prepParams(params || {}, store.state)
    )
  }

  /**
   * Delete a resource as JSON using body JSON parameters
   * @param {string} path
   * @param {any} params
   * @returns {Promise<Response>}
   */
  function $delete(path, params) {
    return withBody(
      'DELETE',
      prepPath(path, store.state),
      prepParams(params || {}, store.state)
    )
  }

  inject('get', $get)
  inject('post', $post)
  inject('put', $put)
  inject('delete', $delete)
}
