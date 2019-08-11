<template>
  <div>
    <div
      :class="['fixed', 'top-0', 'left-0', 'w-screen', 'h-screen', isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none']"
      @click="isMenuOpen = false"
    ></div>
    <app-header :title="$t('pages.index.title')" :back="false"></app-header>

    <section class="bg-gray-100 rounded-md p-4 flex items-center">
      <div class="relative">
        <a
          href="#"
          @click="toggleMenu"
          class="round-action material-icons bg-naito-blue-200 text-gray-100 mr-4"
        >menu</a>
        <app-menu v-if="isMenuOpen" class="absolute top-full w-60 mt-1"></app-menu>
      </div>
      <div>
        <p v-html="$t('pages.index.hello', { name })"></p>
        <p class="sm:hidden" v-html="$t('pages.index.summary-small', sensorAndSitParams)"></p>
        <p class="hidden sm:block" v-html="$t('pages.index.summary', sensorAndSitParams)"></p>
      </div>
    </section>
  </div>
</template>
<script>
import AppHeader from '../components/app-header.vue'
import AppMenu from '../components/app-menu.vue'

export default {
  middleware: 'needs-auth',
  head() {
    return {
      title: `${this.$t('pages.index.title')} - Meters`,
      htmlAttrs: {
        lang: this.$store.state.locale,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.index.description'),
        },
      ],
    }
  },
  components: { AppHeader, AppMenu },
  async mounted() {
    await Promise.all([
      this.$fetchUser(),
      this.$fetchResources(),
      this.$fetchSites(),
    ])
  },
  data() {
    return {
      isMenuOpen: false,
    }
  },
  methods: {
    toggleMenu(event) {
      event.preventDefault()
      this.isMenuOpen = !this.isMenuOpen
    },
  },
  computed: {
    /**
     * @returns {string}
     */
    name() {
      return this.$store.getters.name
    },
    /**
     * @returns {number}
     */
    numResources() {
      return this.$store.getters.numResources
    },
    /**
     * @returns {number}
     */
    numSites() {
      return this.$store.getters.numSites
    },
    sensorAndSitParams() {
      return {
        sensor: `${this.numResources} ${this.$tc(
          'pages.index.sensor',
          this.numResources
        )}`,
        site: `${this.numSites} ${this.$tc('pages.index.site', this.numSites)}`,
      }
    },
  },
}
</script>
