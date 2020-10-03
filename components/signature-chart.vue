<template>
  <basic-chart
    ref="chart"
    :datasets="datasets"
    :x-axes="xAxes"
    :y-axes="yAxes"
    :tooltip-title-callback="tooltipTitleCallback"
    :tooltip-label-callback="tooltipLabelCallback"
    :tooltips-filter="tooltipsFilter"
    :legend="true"
    interaction-mode="nearest"
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
  formatResource,
  capitalize,
  reversePeriods,
  chartDefaults,
  toClosestSuffixe,
  getTooltipDateFormat,
  waitForMutations,
  agregations,
  signaturePeriods,
  cleanScatterDatasetStyle,
  noisyScatterDatasetStyle,
  idealDatasetStyle,
  getScatterAverageLine,
  noiseFilter,
  symbolToAxis,
  fixMissingData,
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
    filterNoise: {
      type: Number,
      required: true,
    },
    highlightIssues: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // auto calculated agregation based on period
      agregation: 0,
      hasData: true,
      waiting: true,
      datasets: [],
      consumptionByAverageTemp: null,
      symbol: '',
      xAxes: [
        {
          type: 'linear',
          gridLines: false,
          ticks: {
            precision: 2,
            maxTicksLimit: 24,
            fontColor: chartDefaults.fontColor,
            fontSize: chartDefaults.fontSize,
            padding: 18,

            callback: tick => {
              return `${tick} °C`
            },
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
        if (tooltipItems.length === 0) {
          return
        }

        const format = getTooltipDateFormat(this.agregation, this.period)
        const date =
          data.datasets[tooltipItems[0].datasetIndex].data[
            tooltipItems[0].index
          ].z
        return capitalize(
          DateTime.fromISO(date)
            .setLocale(this.$dateLocale())
            .toFormat(format)
        )
      },

      tooltipLabelCallback: (tooltipItem, data) => {
        const temperature = tooltipItem.xLabel.toLocaleString(
          this.$numberLocale(),
          decimalDefaultFormat
        )

        const result = toClosestSuffixe(tooltipItem.yLabel)
        const heater = result.number.toLocaleString(
          this.$numberLocale(),
          decimalDefaultFormat
        )

        // add spaces before to make room between the color box and the text
        return `  ${heater} ${result.unit + this.symbol}, ${temperature} °C`
      },

      tooltipsFilter: tooltipItem => {
        return tooltipItem.datasetIndex !== 2
      },
    }
  },
  methods: {
    async updateRawData(ignoreCache) {
      const now = DateTime.local()
      const fromTo = getPeriod(now, this.period, this.offset)
      const fromToSumResource = {
        from: fromTo.from,
        // adding a millisecond includes the value for the next round hour
        to: fromTo.to.plus({ millisecond: 1 }),
      }

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
        fromToSumResource,
        ignoreCache
      )

      if (
        meteoReadings.length === 0 ||
        temperatureReadings.length === 0 ||
        heaterReadings.length === 0
      ) {
        this.datasets = []
        this.hasData = false

        this.$emit('currentData', {
          datasets: [],
          hasData: this.hasData,
        })

        return
      }

      // agregate temperatures based on signature period
      // weekly signature: daily averages
      // monthly signature: daily averages
      // yearly signature: weekly averages
      const agregation =
        this.period === signaturePeriods['week'] ||
        this.period === signaturePeriods['month']
          ? agregations['day']
          : agregations['week']

      // store agregation to compute dataset labels
      this.agregation = agregation

      const agregatedMeteoReadings = agregateData(
        meteoReadings.map(readingToXY),
        agregation,
        'avg'
      )

      const agregatedTemperatureReadings = agregateData(
        temperatureReadings.map(readingToXY),
        agregation,
        'avg'
      )

      const agregatedHeaterReadings = agregateData(
        heaterReadings.map(readingToXY),
        agregation,
        'sum'
      )

      const meteoReadingsLength = agregatedMeteoReadings.length
      const temperatureReadingsLength = agregatedTemperatureReadings.length
      const heaterReadingsLength = agregatedHeaterReadings.length

      // we need at least two values of each in agregated form to make the line
      if (
        meteoReadingsLength <= 2 ||
        temperatureReadingsLength <= 2 ||
        heaterReadingsLength <= 2
      ) {
        this.datasets = []
        this.hasData = false

        this.$emit('currentData', {
          datasets: [],
          hasData: this.hasData,
        })

        return
      }

      const allData = [
        agregatedMeteoReadings,
        agregatedTemperatureReadings,
        agregatedHeaterReadings,
      ]

      // if they are not all of equal length
      // fix missing data points
      if (
        meteoReadingsLength !== temperatureReadingsLength ||
        temperatureReadingsLength !== heaterReadingsLength
      ) {
        const biggestData = allData.reduce((biggest, data) =>
          data.length > biggest.length ? data : biggest
        )

        allData.forEach((data, i) => {
          // ignore complete data
          if (data.length === biggestData.length) {
            return
          }

          allData[i] = fixMissingData(biggestData, data)
        })
      }

      // compute difference. round at two decimals
      const temperatureDiff = Array.from(
        new Array(allData[0].length),
        (_, i) => ({
          x: allData[1][i].x,
          y: +(allData[1][i].y - allData[0][i].y).toFixed(2),
        })
      )

      // first dataset: isolated points based on averages of smaller portions than "period"
      // sorted by average temp diff smallest to biggest
      this.consumptionByAverageTemp = Array.from(
        new Array(allData[2].length),
        (_, i) => ({
          x: temperatureDiff[i].y,
          y: allData[2][i].y,
          // keep the timestamp to include it in the tooltip
          z: allData[2][i].x,
        })
      )
        // if we were missing any data along the way, x will be NaN
        // remove it here because it is useless on the chart
        .filter(point => !isNaN(point.x))
        .sort((a, b) => a.x - b.x)

      await this.updateUserFilter()
    },
    async updateUserFilter() {
      if (this.consumptionByAverageTemp === null) {
        return
      }

      const newDatasets = []

      // the user has a control to hide noise and get "closer" to the chart
      const noiseFiltered = noiseFilter(
        this.consumptionByAverageTemp,
        this.filterNoise
      )

      // separete noisy data from clean one to show the user where problems occure
      // the user also has control to how much data is highlighted
      const issuesHighlighted = noiseFilter(
        noiseFiltered.cleanData,
        this.highlightIssues
      )

      // use clean data to draw the line
      const { slope, intercept } = getScatterAverageLine(
        issuesHighlighted.cleanData
      )

      // get currently hidden datasets
      let previousHiddenStatus = [false, false, false]
      if (this.datasets.length === 3 && this.$refs.chart.chart !== null) {
        previousHiddenStatus = previousHiddenStatus.map(
          (_, i) => !this.$refs.chart.chart.isDatasetVisible(i)
        )
      }

      newDatasets.push({
        label: this.$t('pages.signature.chart.avg_clean'),
        type: 'scatter',
        data: issuesHighlighted.cleanData,
        yAxisID: 0,
        hidden: previousHiddenStatus[0],
        ...cleanScatterDatasetStyle,
      })

      newDatasets.push({
        label: this.$t('pages.signature.chart.avg_noisy'),
        type: 'scatter',
        data: issuesHighlighted.noisyData,
        yAxisID: 0,
        hidden: previousHiddenStatus[1],
        ...noisyScatterDatasetStyle,
      })

      // second dataset: average consumption line with 2 points
      const firstX = this.consumptionByAverageTemp[0].x
      const lastX = this.consumptionByAverageTemp[
        this.consumptionByAverageTemp.length - 1
      ].x

      newDatasets.push({
        label: this.$t('pages.signature.chart.ideal_line'),
        data: [
          {
            x: firstX,
            y: slope * firstX + intercept,
          },
          {
            x: lastX,
            y: slope * lastX + intercept,
          },
        ],
        yAxisID: 0,
        hidden: previousHiddenStatus[2],
        ...idealDatasetStyle,
      })

      // updates the underlying chart
      this.datasets = newDatasets
      this.hasData = true

      this.$emit('currentData', {
        datasets: newDatasets,
        hasData: this.hasData,
      })
    },
    reTranslate() {
      if (this.datasets.length !== 3) {
        return
      }

      // updates the underlying chart
      this.$set(
        this.datasets[0],
        'label',
        this.$t('pages.signature.chart.avg_clean')
      )
      this.$set(
        this.datasets[1],
        'label',
        this.$t('pages.signature.chart.avg_noisy')
      )
      this.$set(
        this.datasets[2],
        'label',
        this.$t('pages.signature.chart.ideal_line')
      )
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
    updateAxes() {
      if (!this.$store.getters.hasResourceTypes) {
        return
      }

      const resourceType = this.$store.getters.resourceType(
        this.$store.state.dataById.resources[this.heaterId]
      )

      // keep symbol for tooltip
      this.symbol = resourceType.symbol
      // updates the underlying chart
      this.yAxes = [symbolToAxis(resourceType.symbol, 'left', true, true)]
    },
    waitForData() {
      const mutationsToWaitFor = []

      if (!this.$store.getters.hasMeteoLocations) {
        mutationsToWaitFor.push(SET_METEO_LOCATIONS)
      }

      if (!this.$store.getters.hasSites) {
        mutationsToWaitFor.push(SET_SITES)
      }

      if (!this.$store.getters.hasResourceTypes) {
        mutationsToWaitFor.push(SET_RESOURCE_TYPES)
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
        this.waiting = true
        this.updateAxes()
        return this.updateRawData(true).then(
          () => (this.waiting = false),
          console.error
        )
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
        this.waiting = true
        return this.updateRawData().then(
          () => (this.waiting = false),
          console.error
        )
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
        this.waiting = true
        return this.updateRawData().then(
          () => (this.waiting = false),
          console.error
        )
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
        this.waiting = true
        this.updateAxes()
        return this.updateRawData().then(
          () => (this.waiting = false),
          console.error
        )
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
        this.waiting = true
        return this.updateRawData().then(
          () => (this.waiting = false),
          console.error
        )
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
        this.waiting = true
        return this.updateRawData().then(
          () => (this.waiting = false),
          console.error
        )
      })
    },
    filterNoise(to, from) {
      if (to === from) {
        return
      }

      if (!this.isQueryValid) {
        return
      }

      this.waiting = true
      this.updateUserFilter().then(() => (this.waiting = false))
    },
    highlightIssues(to, from) {
      if (to === from) {
        return
      }

      if (!this.isQueryValid) {
        return
      }

      this.waiting = true
      this.updateUserFilter().then(() => (this.waiting = false))
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
        this.waiting = true
        this.updateAxes()
        return this.updateRawData().then(
          () => (this.waiting = false),
          console.error
        )
      })
    }

    if (this.$store.getters.smallScreen) {
      this.hideYTicks()
    } else {
      this.showYTicks()
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
