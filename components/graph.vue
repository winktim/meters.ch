<template>
  <!-- https://github.com/chartjs/Chart.js/issues/4156 -->
  <div class="relative min-w-0 w-full h-full select-none">
    <canvas :class="hasData ? 'opacity-1' : 'opacity-25'" ref="canvas"></canvas>
    <div :class="noDataClasses">
      <span
        class="text-center text-gray-600 font-medium"
        v-text="$t('global.no_data', { period: periodOffsetString })"
      ></span>
    </div>
  </div>
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
} from '../assets/utils'

export default {
  name: 'Graph',
  props: {
    period: Number,
    agregation: Number,
    offset: Number,
    resources: Array,
  },
  data() {
    return {
      chart: null,
      rawData: null,
      hasData: false,
      defaultConfig: {
        type: 'line',
        data: {
          datasets: [],
        },
        options: {
          maintainAspectRatio: false,
          animation: {
            duration: 0,
            easing: 'linear',
          },
          legend: {
            position: 'top',
            labels: {
              padding: 25,
              boxWidth: 35,
              fontSize: 16,
              fontColor: 'black',
            },
          },
          elements: {
            line: {
              // make line straight
              tension: 0,
            },
            point: {
              // hide point
              radius: 0,
            },
          },
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: reverseAgregations[this.agregation],
                  round: reverseAgregations[this.agregation],

                  displayFormats: {
                    // custom formats to compat default non-swiss & try to make them compatible with luxon
                    hour: 'HH:mm',
                    week: 'D MMM YYYY',
                    day: 'D MMM',
                    month: 'MMM YYYY',
                  },
                },
                // TODO: vertical & horizontal single lines
                gridLines: false,
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 18,
                },
              },
            ],
            // TODO: each unit has it's axis
            yAxes: [
              {
                display: 'auto',
                // order (higher = further)
                weight: 0,
                gridLines: false,
                ticks: {
                  beginAtZero: true,
                  precision: 0,
                  maxTicksLimit: 7,
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 18,
                },
              },
            ],
          },
          hover: {
            mode: 'index',
            intersect: false,
          },
          tooltips: {
            mode: 'index',
            intersect: false,

            xPadding: 12,
            yPadding: 16,
            bodySpacing: 12,
            titleMarginBottom: 18,
            caretSize: 8,

            callbacks: {
              title: (tooltipItems, data) => {
                const format = this.chart.options.scales.xAxes[0].time.displayFormats[
                  reverseAgregations[this.agregation]
                ]
                  // replace YYYY & D to be compatible with luxon
                  .replace('YYYY', 'yyyy')
                  .replace('D', 'd')
                  // use full month name
                  .replace('MMM', 'MMMM')
                return capitalize(
                  DateTime.fromISO(tooltipItems[0].label)
                    .setLocale(this.$dateLocale())
                    .toFormat(format)
                )
              },

              label: (tooltipItem, data) => {
                const label = data.datasets[tooltipItem.datasetIndex].label
                const symbol =
                  data.datasets[tooltipItem.datasetIndex].resourceType.symbol
                const value = parseFloat(tooltipItem.value).toLocaleString(
                  this.$numberLocale(),
                  decimalDefaultFormat
                )
                // add spaces before to make room between the color box and the text
                return `  ${label}: ${value} ${symbol}`
              },
            },
          },
        },
      },
    }
  },
  methods: {
    async updateRawData() {
      const fromTo = getPeriod(DateTime.local(), this.period, this.offset)

      // set to null to prevent an agregation update while we download new data
      this.rawData = null
      const newRawData = []

      for (const i in this.resources) {
        const data = await this.$getReadings(this.resources[i], fromTo)

        const resource = this.$store.getters.resource({
          resource_id: this.resources[i],
        })

        const resourceType = this.$store.getters.resourceType(resource)

        let site = null

        if (this.$store.getters.numSites > 1) {
          const sensor = this.$store.getters.sensor(resource)
          site = this.$store.getters.site(sensor)
        }

        newRawData.push({
          label: formatResource(this.$i18n, resource, resourceType, site),
          data: data.map(readingToXY),
          // TODO: use id based on resource type
          yAxisID: 0,
          resource,
          resourceType,
          site,
          ...datasetStyle[i % datasetStyle.length],
        })
      }
      this.rawData = newRawData
      this.updateAgregation()
    },
    updateAgregation() {
      if (this.rawData === null) {
        return
      }

      const newDatasets = this.rawData.map(dataset => {
        return {
          ...dataset,
          data: agregateData(
            dataset.data,
            this.agregation,
            dataset.resourceType.aggregation_function
          ),
        }
      })

      this.chart.options.scales.xAxes[0].time.unit =
        reverseAgregations[this.agregation]
      this.chart.options.scales.xAxes[0].time.round =
        reverseAgregations[this.agregation]

      this.chart.data.datasets = newDatasets
      this.chart.update()

      this.hasData =
        this.chart.data.datasets.length > 0 &&
        this.chart.data.datasets.every(dataset => dataset.data.length > 0)
    },
    reTranslate() {
      this.chart.data.datasets.forEach(dataset => {
        dataset.label = formatResource(
          this.$i18n,
          dataset.resource,
          dataset.resourceType,
          dataset.site
        )
      })
      this.chart.update()
    },
  },
  watch: {
    period() {
      this.updateRawData().catch(console.error)
    },
    offset() {
      this.updateRawData().catch(console.error)
    },
    resources() {
      this.updateRawData().catch(console.error)
    },
    agregation() {
      this.updateAgregation()
    },
    locale() {
      this.reTranslate()
    },
  },
  mounted() {
    this.chart = new Chart(this.$refs.canvas, this.defaultConfig)
    this.updateRawData().catch(console.error)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  computed: {
    locale() {
      return this.$store.state.locale
    },
    noDataClasses() {
      return [
        'absolute',
        'top-0',
        'flex',
        'items-center',
        'justify-center',
        'w-full',
        'h-full',
      ].concat(this.hasData ? ['hidden'] : ['block'])
    },
    periodOffsetString() {
      return this.$tc(
        'period_offsets.' + reversePeriods[this.period],
        this.offset,
        { count: this.offset }
      )
    },
  },
}
</script>
