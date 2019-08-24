import Chart from 'chart.js'
import { chartDefaults } from './utils'

// increase font size in the tooltips globally
// Chart.defaults.global.tooltips.bodyFontSize = 16
// Chart.defaults.global.tooltips.titleFontSize = 17
Chart.defaults.global.defaultFontSize = chartDefaults.fontSize
Chart.defaults.global.defaultFontFamily = chartDefaults.fontFamily

export default Chart
