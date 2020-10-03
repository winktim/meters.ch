<template>
  <!-- https://github.com/chartjs/Chart.js/issues/4156 -->
  <div class="relative min-w-0 w-full h-full select-none">
    <canvas :class="canvasClasses" ref="canvas"></canvas>
    <div
      :class="
        ['transition-opacity-100', ...coverClasses].concat(
          error
            ? ['opacity-1', 'pointer-events-auto']
            : ['opacity-0', 'pointer-events-none']
        )
      "
    >
      <span class="text-center font-medium" v-text="errorMessage"></span>
    </div>
    <!-- loading.io loader -->
    <div
      :class="
        ['bg-gray-100', 'transition-opacity-400', ...coverClasses].concat(
          waiting
            ? ['opacity-1', 'pointer-events-auto']
            : ['opacity-0', 'pointer-events-none']
        )
      "
    >
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
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
  chartDefaults,
  fixMissingData,
  toClosestSuffixe,
  getTooltipDateFormat,
  waitForMutations,
} from '../assets/utils'

import {
  SET_RESOURCES,
  SET_RESOURCE_TYPES,
  SET_SMALL_SCREEN,
} from '../assets/mutations'

export default {
  name: 'BasicChart',
  props: {
    datasets: {
      type: Array,
      default: () => [],
    },
    xAxes: {
      type: Array,
      default: () => [],
    },
    yAxes: {
      type: Array,
      default: () => [],
    },
    tooltipTitleCallback: {
      type: Function,
      default: undefined,
    },
    tooltipLabelCallback: {
      type: Function,
      default: undefined,
    },
    legend: {
      type: Boolean,
      default: true,
    },
    interactionMode: {
      type: String,
      default: 'index',
    },
    waiting: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
      defaultConfig: {
        type: 'line',
        data: {
          datasets: [],
        },
        options: {
          spanGaps: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0,
            easing: 'linear',
          },
          layout: {
            padding: {
              // comppensate padding of labels on the left
              left: 20,
              // prevent overflow of chart on right
              right: 20,
              top: 0,
              bottom: 0,
            },
          },

          legend: {
            position: 'top',
            display: this.legend,
            labels: {
              padding: 25,
              boxWidth: 35,
              fontSize: chartDefaults.fontSize,
              fontColor: chartDefaults.fontColor,
              generateLabels: chart => {
                if (!Array.isArray(chart.data.datasets)) {
                  return []
                }

                return chart.data.datasets.map((dataset, i) => ({
                  text: dataset.label,
                  fillStyle: dataset.borderColor, // use border color for background to always fill the legend
                  hidden: !chart.isDatasetVisible(i),
                  lineCap: dataset.borderCapStyle,
                  lineDash: dataset.borderDash,
                  lineDashOffset: dataset.borderDashOffset,
                  lineJoin: dataset.borderJoinStyle,
                  lineWidth: dataset.borderWidth,
                  strokeStyle: dataset.borderColor,
                  pointStyle: dataset.pointStyle,
                  rotation: dataset.rotation,

                  // Below is extra data used for toggling the datasets
                  datasetIndex: i,
                }))
              },
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
            xAxes: this.xAxes,
            yAxes: this.yAxes,
          },
          hover: {
            mode: this.interactionMode,
            intersect: false,
            animationDuration: 0,
          },
          tooltips: {
            mode: this.interactionMode,
            intersect: false,

            xPadding: 12,
            yPadding: 16,
            bodySpacing: 12,
            titleMarginBottom: 18,
            caretSize: 8,

            callbacks: {
              title: this.tooltipTitleCallback,
              label: this.tooltipLabelCallback,
            },
          },
        },
      },
    }
  },
  watch: {
    datasets: {
      handler(to, from) {
        const toDatasets = JSON.stringify(to)

        // give it a deep copy because Chartjs likes to modify things
        this.chart.data.datasets = JSON.parse(toDatasets)
        this.chart.update()
      },
      deep: true,
    },
    xAxes: {
      handler(to, from) {
        // can't give a deep copy because it might contain functions
        this.chart.options.scales.xAxes = to

        this.chart.update()
      },
      deep: true,
    },
    yAxes: {
      handler(to, from) {
        // can't give a deep copy because it might contain functions
        this.chart.options.scales.yAxes = to

        this.chart.update()
      },
      deep: true,
    },
    legend(to, from) {
      if (to === from) {
        return
      }

      this.chart.options.legend.display = to
      this.chart.update()
    },
  },
  mounted() {
    this.chart = new Chart(this.$refs.canvas, this.defaultConfig)

    // set data, but it might still be empty
    this.chart.data.datasets = JSON.parse(JSON.stringify(this.datasets))
    this.chart.options.scales.xAxes = JSON.parse(JSON.stringify(this.xAxes))
    this.chart.options.scales.yAxes = JSON.parse(JSON.stringify(this.yAxes))
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  computed: {
    canvasClasses() {
      return ['transition-opacity-100'].concat(
        this.error ? 'opacity-25' : 'opacity-1'
      )
    },
    coverClasses() {
      return [
        'absolute',
        'top-0',
        'flex',
        'items-center',
        'justify-center',
        'w-full',
        'h-full',
      ]
    },
  },
}
</script>
