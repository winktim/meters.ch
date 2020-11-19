const fs = require('fs')
const nodeModules = __dirname + '/../node_modules'

console.log('[patch node_modules] removing moment')
fs.rmdirSync(nodeModules + '/moment', { recursive: true })

console.log('[patch node_modules] patching @nuxt/vue-app/template/router.js')
fs.copyFileSync(
  __dirname + '/router.js',
  nodeModules + '/@nuxt/vue-app/template/router.js'
)
