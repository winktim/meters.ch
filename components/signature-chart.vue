<template>
  <basic-chart
    :datasets="datasets"
    :x-axes="xAxes"
    :y-axes="yAxes"
    :tooltip-title-callback="tooltipTitleCallback"
    :tooltip-label-callback="tooltipLabelCallback"
    :legend="true"
    :waiting="waiting"
    :error="!hasData"
    :error-message="$t('global.no_data', { period: periodOffsetString })"
  ></basic-chart>
</template>
<script>
import Chart from '../assets/chart'
import { DateTime } from 'luxon'
import {
  getPeriod,
  readingToXY,
  datasetStyle,
  decimalDefaultFormat,
  agregateData,
  reverseAgregations,
  formatResource,
  capitalize,
  reversePeriods,
  chartDefaults,
  fixMissingData,
  resourceTypesToAxes,
  toClosestSuffixe,
  getTooltipDateFormat,
  waitForMutations,
} from '../assets/utils'

import {
  SET_METEO_LOCATIONS,
  SET_SITES,
  SET_SMALL_SCREEN,
} from '../assets/mutations'
import BasicChart from './basic-chart.vue'

export default {
  name: 'SignatureChart',
  components: { BasicChart },
  props: {
    siteId: {
      type: Number,
      required: true,
    },
    temperatureId: {
      type: Number,
      required: true,
    },
    heaterId: {
      type: Number,
      required: true,
    },
    period: {
      type: Number,
      required: true,
    },
    offset: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      hasData: true,
      waiting: true,
      datasets: [],
      xAxes: [
        {
          type: 'linear',
          gridLines: false,
          ticks: {
            fontColor: chartDefaults.fontColor,
            fontSize: chartDefaults.fontSize,
            padding: 18,
          },
        },
      ],
      yAxes: [
        {
          display: 'auto',
          gridLines: false,
          offset: true,
          ticks: {
            // beginAtZero: true,
            precision: 0,
            maxTicksLimit: 7,
            fontColor: chartDefaults.fontColor,
            fontSize: chartDefaults.fontSize,
            padding: 18,
          },
        },
      ],

      tooltipTitleCallback: (tooltipItems, data) => {
        // TODO: title callback
        /*
        const format = getTooltipDateFormat(this.agregation, this.period)
        return capitalize(
          DateTime.fromISO(tooltipItems[0].label)
            .setLocale(this.$dateLocale())
            .toFormat(format)
        )
        */
      },

      tooltipLabelCallback: (tooltipItem, data) => {
        // TODO: label callback
        /*
        const label =
          data.datasets[tooltipItem.datasetIndex].resource.description
        const symbol =
          data.datasets[tooltipItem.datasetIndex].resourceType.symbol

        const rawValue = parseFloat(tooltipItem.value)

        if (symbol !== '°C') {
          const result = toClosestSuffixe(rawValue)
          // add spaces before to make room between the color box and the text
          return `  ${label}: ${result.number.toLocaleString(
            this.$numberLocale(),
            decimalDefaultFormat
          )} ${result.unit + symbol}`
        }

        const value = rawValue.toLocaleString(
          this.$numberLocale(),
          decimalDefaultFormat
        )

        // add spaces before to make room between the color box and the text
        return `  ${label}: ${value} ${symbol}`
        */
      },
    }
  },
  methods: {
    async updateRawData(ignoreCache) {
      const now = DateTime.local()
      const fromTo = getPeriod(now, this.period, this.offset)
      /*
      const fromToSumResource = {
        from: fromTo.from,
        // adding a millisecond includes the value for the next round hour
        to: fromTo.to.plus({ millisecond: 1 }),
      }
      */

      const newDatasets = []

      // get site meteo readings
      const site = this.$store.getters.site({ site_id: this.siteId })
      const meteoLocation = this.$store.getters.meteoLocation(site)

      const meteoReadings = await this.$getMeteoReadings(
        meteoLocation.id,
        fromTo,
        ignoreCache
      )

      // get temperature readings
      const temperatureReadings = await this.$getReadings(
        this.temperatureId,
        fromTo,
        ignoreCache
      )
      // get heater readings
      const heaterReadings = await this.$getReadings(
        this.heaterId,
        fromTo,
        ignoreCache
      )

      console.log({ meteoReadings, temperatureReadings, heaterReadings })

      // TODO: agregate interior & exterior temps
      // compute difference
      // get min & max for the X values of the second dataset

      // first dataset: isolated points based on averages of smaller portions than "period"
      // weekly signature: daily averages
      // monthly signature: daily averages
      // yearly signature: weekly averages

      const dataPoint = {
        x: 'DiffBetweenInteriorAndExteriorTemp',
        y: 'consumptionAtThatTemp',
      }

      // second dataset: average consumption line with 2 points
      newDatasets.push({
        label: 'Ideal consumption line',
        data: [
          { x: 1, y: 1 },
          { x: 0, y: 0 },
        ],
        // TODO: axes ?
        yAxisID: 0,
        // TODO: fixed dataset style
        ...datasetStyle[1],
      })

      // updates the underlying chart
      this.datasets = newDatasets

      // TODO: check if there is enough data to compute signature before here
      this.hasData =
        this.datasets.length > 0 &&
        this.datasets.some(dataset => dataset.data.length > 0)

      this.$emit('currentData', {
        datasets: newDatasets,
        hasData: this.hasData,
      })
    },
    reTranslate() {
      // updates the underlying chart
      /*
      this.datasets.forEach(dataset => {
        this.$set(
          dataset,
          'label',
          formatResource(
            this.$i18n,
            dataset.resource,
            dataset.resourceType,
            dataset.site
          )
        )
      })
      */
    },
    hideYTicks() {
      this.yAxes.forEach(axes => {
        // updates the underlying chart
        this.$set(axes.ticks, 'display', false)
      })
    },
    showYTicks() {
      this.yAxes.forEach(axes => {
        // updates the underlying chart
        this.$set(axes.ticks, 'display', true)
      })
    },
    waitForData() {
      const mutationsToWaitFor = []

      if (!this.$store.getters.hasMeteoLocations) {
        mutationsToWaitFor.push(SET_METEO_LOCATIONS)
      }

      if (!this.$store.getters.hasSites) {
        mutationsToWaitFor.push(SET_SITES)
      }

      if (mutationsToWaitFor.length === 0) {
        this.waiting = false
        return Promise.resolve()
      }

      this.waiting = true

      return waitForMutations(this.$store, mutationsToWaitFor).then(() => {
        this.waiting = false
      })
    },
    forceUpdate() {
      return this.waitForData().then(() => {
        return this.updateRawData(true).catch(console.error)
      })
    },
  },
  watch: {
    siteId(to, from) {
      if (to === from) {
        return
      }

      if (!this.isQueryValid) {
        return
      }

      this.waitForData().then(() => {
        this.updateRawData().catch(console.error)
      })
    },
    temperatureId(to, from) {
      if (to === from) {
        return
      }

      if (!this.isQueryValid) {
        return
      }

      this.waitForData().then(() => {
        this.updateRawData().catch(console.error)
      })
    },
    heaterId(to, from) {
      if (to === from) {
        return
      }

      if (!this.isQueryValid) {
        return
      }

      this.waitForData().then(() => {
        this.updateRawData().catch(console.error)
      })
    },
    period(to, from) {
      if (to === from) {
        return
      }

      if (!this.isQueryValid) {
        return
      }

      this.waitForData().then(() => {
        this.updateRawData().catch(console.error)
      })
    },
    offset(to, from) {
      if (to === from) {
        return
      }

      if (!this.isQueryValid) {
        return
      }

      this.waitForData().then(() => {
        this.updateRawData().catch(console.error)
      })
    },
    locale(to, from) {
      if (to === from) {
        return
      }
      this.reTranslate()
    },
  },
  mounted() {
    if (this.isQueryValid) {
      this.waitForData().then(() => {
        this.updateRawData().catch(console.error)
      })
    }

    // show Y ticks only when the screen is large enough
    this.$store.subscribe(({ type }) => {
      if (type === SET_SMALL_SCREEN) {
        if (this.$store.getters.smallScreen) {
          this.hideYTicks()
        } else {
          this.showYTicks()
        }
      }
    })
  },
  computed: {
    periodOffsetString() {
      return this.$tc(
        'period_offsets.' + reversePeriods[this.period],
        this.offset,
        { count: this.offset }
      )
    },
    locale() {
      return this.$store.state.locale
    },
    resourceTypes() {
      return this.$store.state.data.resourceTypes
    },
    isQueryValid() {
      return (
        this.siteId !== -1 && this.temperatureId !== -1 && this.heaterId !== -1
      )
    },
  },
}
</script>
