import Chart from 'chart.js'
import { chartDefaults } from './utils'

// increase font size in the tooltips globally
// Chart.defaults.global.tooltips.bodyFontSize = 16
// Chart.defaults.global.tooltips.titleFontSize = 17
Chart.defaults.global.defaultFontSize = chartDefaults.fontSize
Chart.defaults.global.defaultFontFamily = chartDefaults.fontFamily

// increase padding between legend and chart
Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 16
}

export default Chart
