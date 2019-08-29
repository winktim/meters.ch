import { DateTime } from 'luxon'

/**
 * Map from the simple language local to the full locale for number formatting
 */
export const numberLocale = {
  en: 'en-ch',
  fr: 'de-ch',
  de: 'de-ch',
}

/**
 * Map from the simple language local to the full locale for date formatting
 */
export const dateLocale = {
  en: 'en-ch',
  fr: 'fr-ch',
  de: 'de-ch',
}

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
  // to improve cache, round the times
  return {
    from: reference.minus({ days: 30 }).endOf('hour'),
    to: reference.endOf('hour'),
  }
}

/**
 * Get a period representing the last 7 days
 * @param {import('luxon').DateTime} reference
 */
export function last7DaysPeriod(reference) {
  // to improve cache, round the times
  return {
    from: reference.minus({ days: 7 }).endOf('hour'),
    to: reference.endOf('hour'),
  }
}

/**
 * Scroll an element to it's top
 * @param {HTMLElement} el
 */
export function scrollToTop(el) {
  el.scrollTop = 0
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

/**
 * Get a from-to period based on a reference time, period name and offset
 * @param {import('luxon').DateTime} reference
 * @param {number} period
 * @param {number} offset
 */
export function getPeriod(reference, period, offset) {
  const periodName = reversePeriods[period]

  // round times to improve cache
  if (offset === 0) {
    return {
      from: reference.startOf(periodName).toUTC(),
      to: reference.endOf('hour').toUTC(),
    }
  }

  const offseted = reference.minus({ [periodName]: offset })

  return {
    from: offseted.startOf(periodName).toUTC(),
    to: offseted.endOf(periodName).toUTC(),
  }
}

/**
 * Transform a reading object from the API into an XY object for Chart.js
 * @param {{read_at: string, value: number}} reading
 */
export function readingToXY(reading) {
  return {
    x: reading['read_at'],
    y: reading['value'],
  }
}

export const datasetColors = [
  '#459090',
  '#194242',
  '#9C5A8A',
  '#5C5323',
  '#DBC75E',
  '#173242',
  '#9C5658',
  '#41728F',
  '#5C5B20',
  '#74DBD5',
  '#86A2A0',
  '#4C8F8B',
  '#B6DBD9',
  '#315C59',
]

export const datasetStyle = datasetColors.map(color => ({
  backgroundColor: 'transparent',
  borderColor: color,
  borderWidth: 3,
  pointRadius: 0,
  pointHoverRadius: 6,
  pointBorderColor: 'transparent',
  pointBackgroundColor: color,
}))

export const decimalDefaultFormat = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}

const agregationFactors = {
  [agregations['hour']]: ['hour', 'day', 'year'],
  [agregations['day']]: ['day', 'year'],
  // see https://momentjs.com/docs/#/get-set/week-year/
  [agregations['week']]: ['weekNumber', 'weekYear'],
  [agregations['month']]: ['month', 'year'],
  // [agregations['quarter']]: [ 'quarter', 'year' ],
  // [agregations['year']]: [ 'year' ],
}

/**
 * Verifies if all values in `a` are the same as their corresponding indices in `b`
 * @param {number[]} a an array of numbers
 * @param {number[]} b an array of numbers of the same length as `a`
 * @returns {boolean} true if all values in `a` are strictly equal to the values in `b`
 */
function allEqual(a, b) {
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/**
 *
 * @param {{x: string, y: number}[]} array
 * @param {number} agregation
 */
function chunkForAgregation(array, agregation) {
  const chunks = []
  const length = array.length

  const factors = agregationFactors[agregation]

  const retrievedFactors = array.map(value => {
    const date = DateTime.fromISO(value.x)
    return factors.map(factor => date.get(factor))
  })

  for (let i = 1, lastChunkEnd = 0; i <= length; ++i) {
    // if we reached the end, just chunk what remains
    // when the time period changes, cut from the last cut to the data point before this one
    if (
      i === length ||
      !allEqual(retrievedFactors[i - 1], retrievedFactors[i])
    ) {
      // add a chunk. end is non-inclusive, so the current item is not in the chunk
      chunks.push(array.slice(lastChunkEnd, i))
      lastChunkEnd = i
    }
  }

  return chunks
}

/**
 *
 * @param {{x: string, y: number}[]} data
 * @param {number} agregation
 * @param {'sum' | 'avg'} agregationFunction
 */
export function agregateData(data, agregation, agregationFunction) {
  if (data.length === 0) {
    return []
  }

  // nothing to do with zero or one data point
  if (data.length === 1) {
    return [
      {
        x: DateTime.fromISO(data[0].x)
          .startOf(reverseAgregations[agregation])
          .toISO(),
        y: data[0].y,
      },
    ]
  }

  let out = []
  if (agregationFunction === 'sum') {
    // turn the absolute data to relative data
    for (let i = 1; i < data.length; ++i) {
      out.push({ x: data[i].x, y: data[i].y - data[i - 1].y })
    }
  } else {
    out = data
  }

  const chunks = chunkForAgregation(out, agregation)

  const summedUp = chunks.map(chunk => {
    return {
      x: DateTime.fromISO(chunk[0].x)
        .startOf(reverseAgregations[agregation])
        .toISO(),
      y: +chunk.reduce((carry, chunk) => carry + chunk.y, 0).toFixed(4),
    }
  })

  if (agregationFunction === 'avg') {
    return summedUp.map((value, i) => {
      return {
        x: value.x,
        y: +(value.y !== 0 ? value.y / chunks[i].length : 0).toFixed(4),
      }
    })
  } else {
    return summedUp
  }
}

/**
 * Insert missing datapoints as NaN and return a new array
 * @param {{x: string, y: number}[]} completeData
 * @param {{x: string, y: number}[]} dataToFix
 */
export function fixMissingData(completeData, dataToFix) {
  const out = [...dataToFix]

  for (let i = 0; i < completeData.length; ++i) {
    const expectedX = completeData[i].x
    const data = out[i]

    // if we read the end of the data, it means it is missing data at the end, but we don't care about that
    if (!data) {
      break
    }

    // if there is a date mismatch, we know the data to fix is missing at least one value
    if (data.x === expectedX) {
      continue
    }

    out.splice(i, 0, { x: expectedX, y: NaN })
  }

  return out
}

/**
 *
 * @param {string} string
 */
export function capitalize(string) {
  return string[0].toUpperCase() + string.substr(1)
}

export const chartDefaults = {
  fontColor: '#212121',
  fontSize: 16,
  fontFamily: 'Raleway, sans-serif',
}

/**
 * Pluck only certain keys from the object
 * @param {{[x:string] : any}} object
 * @param  {...string} keys
 */
export function pluck(object, ...keys) {
  const out = {}

  for (const key of keys) {
    out[key] = object[key]
  }

  return out
}

/**
 * Keep only the relevent data for JSON-downloadable chart data
 * @param {{label: string, data: {x: string, y: number}[], resource: {}, resourceType: {}}[]} datasets
 */
export function datasetsToJson(datasets) {
  return datasets.map(dataset => ({
    label: dataset.label,
    // remove inserted NaN values to fix the chart
    data: dataset.data.filter(data => !isNaN(data.y)),
    resource: pluck(
      dataset.resource,
      'id',
      'description',
      'location',
      'meter',
      'lat',
      'lon'
    ),
    resourceType: pluck(dataset.resourceType, 'id', 'name', 'symbol'),
  }))
}

/**
 *
 * @param {{label: string, data: {x: string, y: string}[], resource: {}, resourceType: {symbol: string}}[]} json
 */
export function JsonToCsv(json) {
  const data = [
    ['"Date"'].concat(
      json.map(
        dataset =>
          `"${dataset.label.replace(
            '"',
            '""'
          )} (${dataset.resourceType.symbol.replace('"', '""')})"`
      )
    ),
  ]

  // some datasets might be missing values
  // take the biggest dataset as reference for length and dates
  const biggestDataset = json.reduce((carry, dataset) =>
    dataset.data.length > carry.data.length ? dataset : carry
  )
  const numValues = biggestDataset.data.length

  for (let i = 0; i < numValues; ++i) {
    const date = biggestDataset.data[i].x
    // remove the offset from the date string so it parses correctly once in a CSV software
    const finalDate = `"${date.replace(/\+.*/g, '')}"`

    const values = json.map(dataset => {
      // take the value at the same date as the biggest dataset
      // to account for potential missing values in the middle of the dataset
      const value = dataset.data.find(value => value.x === date)

      // missing value
      if (value === undefined) {
        return '""'
      }

      // replace dots with comas in the numbers so it is recognized as number in a CSV software
      return `"${value.y.toString().replace('.', ',')}"`
    })

    data.push([finalDate].concat(values))
  }

  return data.map(line => line.join(',')).join('\n')
}

/**
 * Get the scaled value and it's suffixe (centi/milli)
 * @param {number} number
 */
export function toClosestSuffixe(number) {
  if (number === 0) {
    // no unit
    return {
      number,
      unit: '',
    }
  }

  if (number < 0.01) {
    // mili
    return {
      number: number * 1000,
      unit: 'm',
    }
  }

  if (number < 0.1) {
    // centi
    return {
      number: number * 100,
      unit: 'c',
    }
  }

  if (number < 1000) {
    // no unit
    return {
      number,
      unit: '',
    }
  }

  if (number < 1000000) {
    // kilo unit
    return {
      number: number / 1000,
      unit: 'k',
    }
  }

  if (number < 1000000000) {
    // mega
    return {
      number: number / 1000000,
      unit: 'M',
    }
  }

  // giga
  return {
    number: number / 1000000000,
    unit: 'G',
  }
}

/**
 * Turn a list of resource types to a list of axes
 * @param {{symbol: string}[]} resourceTypes
 */
export function resourceTypesToAxes(resourceTypes) {
  const uniqueSymbols = resourceTypes
    .map(resourceType => resourceType.symbol)
    .filter((symbol, i, array) => array.indexOf(symbol) === i)
  return uniqueSymbols.map((symbol, i) => ({
    display: 'auto',
    // order (higher = further)
    weight: i,
    position: i === 0 ? 'right' : 'left',
    gridLines: false,
    ticks: {
      // beginAtZero: true,
      min: symbol === '°C' ? undefined : 0,
      precision: 4,
      maxTicksLimit: 7,
      fontColor: chartDefaults.fontColor,
      fontSize: chartDefaults.fontSize,
      padding: 18,

      callback: tick => {
        if (symbol !== '°C') {
          const result = toClosestSuffixe(tick)
          return `${result.number} ${result.unit + symbol}`
        }

        return `${tick} ${symbol}`
      },
    },
    id: symbol,
  }))
}

/**
 * Get an auto generated name for the chart
 * @param {{resources: number[], period: string, offset: number}} chart
 * @param {{[x: number]: {description: string}}} resourcesById
 * @param {import('vue-i18n').default} i18n
 */
export function generateName(chart, resourcesById, i18n) {
  let resources = resourcesById[chart.resources[0]].description

  if (chart.resources.length > 1) {
    resources += ` ${i18n.t('global.and_others')}`
  }

  const period = i18n.tc('period_offsets.' + chart.period, chart.offset, {
    count: chart.offset,
  })

  return `${resources}, ${period}`
}
