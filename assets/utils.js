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
