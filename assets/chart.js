import Chart from 'chart.js'
import 'chartjs-adapter-luxon'
import { chartDefaults } from './utils'

// increase font size in the tooltips globally
// Chart.defaults.global.tooltips.bodyFontSize = 16
// Chart.defaults.global.tooltips.titleFontSize = 17
Chart.defaults.global.defaultFontSize = chartDefaults.fontSize
Chart.defaults.global.defaultFontFamily = chartDefaults.fontFamily

// increase padding between legend and chart
Chart.Legend.prototype.afterFit = function () {
  this.height = this.height + 16
}

// https://github.com/chartjs/Chart.js/blob/cbace1cfe2c1b70ac26d1ee798eb5841fcd978c5/src/core/core.controller.js#L19
Chart.defaults.global.events.push('touchend')

Chart.Tooltip.prototype.handleEvent = function (e) {
  const me = this
  const options = me._options
  let changed = false

  me._lastActive = me._lastActive || []

  // Find Active Elements for tooltips
  // Added touchend to the factor that hide the chart
  if (e.type === 'mouseout' || e.type === 'touchend') {
    me._active = []
  } else {
    me._active = me._chart.getElementsAtEventForMode(e, options.mode, options)
  }

  // Remember Last Actives
  changed = !Chart.helpers.arrayEquals(me._active, me._lastActive)

  // Only handle target event on tooltip change
  if (changed) {
    me._lastActive = me._active

    if (options.enabled || options.custom) {
      me._eventPosition = {
        x: e.x,
        y: e.y,
      }

      me.update(true)
      me.pivot()
    }
  }

  return changed
}

export default Chart
