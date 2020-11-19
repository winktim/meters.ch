import { DateTime } from 'luxon'

/**
 * Create a new cache
 * @param {import('luxon').Duration} cacheTimeout for how much time a value should be returned from the cache
 * @param {import('luxon').Duration} cleanInterval amount of time between the cache cleanups
 */
export default function factory(cacheTimeout, cleanInterval) {
  /**
   * @type {{[x: string]: {timeout: import('luxon').DateTime, value: string}}}
   */
  let cache = {}

  /**
   * Get a value from the cache
   * @param {string} key
   * @returns {any} the value or null
   */
  const get = (key) => {
    const current = cache[key]

    if (!current) {
      return null
    }

    const now = DateTime.local()

    // if it timed out now or before
    if (current.timeout <= now) {
      delete cache[key]
      return null
    }

    return JSON.parse(current.value)
  }

  /**
   * Set a value in the cache
   * @param {string} key
   * @param {any} value
   * @returns {any} the given value
   */
  const set = (key, value) => {
    cache[key] = {
      timeout: DateTime.local().plus(cacheTimeout),

      value: JSON.stringify(value),
    }

    return value
  }

  const clean = () => {
    const now = DateTime.local()

    const keys = Object.keys(cache)

    keys.forEach((key) => {
      if (cache[key].timeout <= now) {
        delete cache[key]
      }
    })
  }

  /**
   * Manually clear the cache of all values
   * @returns {void} nothing
   */
  const clear = () => {
    cache = {}
  }

  setInterval(clean, cleanInterval.as('milliseconds'))

  return {
    get,
    set,
    clear,
  }
}
