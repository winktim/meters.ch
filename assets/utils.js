/**
 *
 * @param {import('vue-i18n').default} i18n
 * @param {*} resource
 * @param {*} resourceType
 * @param {*} site
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
