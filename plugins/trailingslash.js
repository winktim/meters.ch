import { removeTrailingSlash } from '../assets/utils'

export default ({ app }) => {
  app.router.afterEach((to) => {
    if (to.path === '/') {
      return
    }

    if (to.path.endsWith('/')) {
      const url =
        window.location.protocol +
        '//' +
        window.location.host +
        removeTrailingSlash(window.location.pathname) +
        window.location.search +
        window.location.hash

      window.history.replaceState(null, document.title, url)
    }
  })
}
