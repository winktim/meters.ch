/**
 *
 * @param {import('vue-i18n').default} i18n
 * @param {{description: string}} resource
 * @param {{name: string}} resourceType optional
 * @param {{name: string}} site optional
 */
export function formatResource(i18n, resource, resourceType, site) {
  const values = []

  if (resourceType) {
    values.push(i18n.t('features.resource_types.' + resourceType.name))
  }

  values.push(resource.description)

  if (site) {
    values.push(site.name)
  }

  return values.join(', ')
}

/**
 * Index an array of elements with ids on their ids in an object
 * @param {{id:number}[]} arrayWithIds
 */
export function indexOnId(arrayWithIds) {
  const output = {}

  const n = arrayWithIds.length

  for (let i = 0; i < n; ++i) {
    const el = arrayWithIds[i]
    output[el.id] = el
  }

  return output
}

export const agregations = {
  hour: 0,
  day: 1,
  week: 2,
  month: 3,
}

export const reverseAgregations = Object.keys(agregations)

export const periods = {
  day: 0,
  week: 1,
  month: 2,
  year: 3,
}

export const reversePeriods = Object.keys(periods)

/**
 * Get a period representing the last 30 days
 * @param {import('luxon').DateTime} reference
 */
export function last30DaysPeriod(reference) {
  return {
    from: reference.minus({ days: 30 }),
    to: reference,
  }
}

/**
 * Get a period representing the last 7 days
 * @param {import('luxon').DateTime} reference
 */
export function last7DaysPeriod(reference) {
  return {
    from: reference.minus({ days: 7 }),
    to: reference,
  }
}

/**
 * Scroll an element to it's bottom
 * @param {HTMLElement} el
 */
export function scrollToBottom(el) {
  el.scrollTop = el.scrollHeight
}

/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Convert the given potential dashboard into a valid dashboard object
 * @param {any} dashboard The current dashboard as a parsed JSON string
 * @param {{[x:number]:{}}} ownedResources
 * @returns {{name: string, offset: number, period: string, agregation: string, resources: number[]}[]}
 */
export function fixDashboard(dashboard, ownedResources) {
  const out = []

  if (Array.isArray(dashboard)) {
    dashboard.forEach(element => {
      // check all elements are objects
      if (typeof element !== 'object' || element === null) {
        return
      }

      // check resources is an array
      if (!Array.isArray(element['resources'])) {
        return
      }

      // convert to numbers and filter resources that are not number or not owned resources
      const resources = element['resources']
        .map(id => parseInt(id))
        .filter(id => {
          return !isNaN(id) && ownedResources[id] !== undefined
        })

      // check we have at least one resource left
      if (resources.length === 0) {
        return
      }

      // take the period or the default if invalid
      const period =
        reversePeriods.indexOf(element['period']) === -1
          ? reversePeriods[0]
          : element['period']

      // take the agregation or the default if invalid
      const agregation =
        reverseAgregations.indexOf(element['agregation']) === -1
          ? reverseAgregations[0]
          : element['agregation']

      // clamp the offset or reset it to 0
      const offset = clamp(parseInt(element['offset']), 0, 12) || 0

      // get the name or use an empty string
      const name = element.hasOwnProperty('name') ? String(element['name']) : ''

      out.push({
        name,
        offset,
        period,
        agregation,
        resources,
      })
    })
  }

  return out
}
