<template>
  <div>
    <div
      :class="['z-10', 'fixed', 'top-0', 'left-0', 'w-screen', 'h-screen', isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none']"
      @click="isMenuOpen = false"
    ></div>
    <app-header
      :title="$t('pages.index.title')"
      :description="$t('pages.index.description')"
      :back="false"
    ></app-header>

    <section
      class="bg-gray-100 rounded-md p-4 mb-3 md:mb-6 mx-auto w-full lg:w-2/3 xl:w-3/5 flex items-center"
    >
      <div class="relative z-10">
        <button
          :disabled="editMode"
          @click="toggleMenu"
          class="round-action material-icons bg-naito-blue-300 text-gray-100 mr-4"
        >menu</button>
        <app-menu v-if="isMenuOpen" class="absolute top-full w-60 mt-1"></app-menu>
      </div>
      <div>
        <p v-html="$t('pages.index.hello', { name })"></p>
        <p class="sm:hidden" v-html="$t('pages.index.summary_small', sensorAndSitParams)"></p>
        <p class="hidden sm:block" v-html="$t('pages.index.summary', sensorAndSitParams)"></p>
      </div>
    </section>

    <!-- dashboard elements -->
    <div class="flex flex-col xl:flex-row xl:flex-wrap justify-center mb-16">
      <section v-for="(chart, i) in dashboard" :key="chartKey(chart)" :class="chartParentClasses">
        <h2
          v-if="!editMode"
          class="text-lg font-bold mb-2 text-center"
          v-text="chart.name || generateName(chart)"
        ></h2>
        <div v-else class="w-full flex mb-2">
          <input
            aria-label="Name"
            :value="chart.name || generateName(chart)"
            @change="nameEdit(i, chart.name, $event.target.value)"
            class="min-w-0 flex-grow px-4 py-2 transparent-input mr-8"
            type="text"
            :name="i + '-name-input'"
            :id="i + '-name-input'"
          />
          <!-- edit actions -->
          <button
            :disabled="i === 0"
            @click="toFrontEdit(i)"
            class="w-12 h-12 bg-naito-blue-300 text-gray-100 simple-action rounded-l-md"
          >
            <i class="material-icons text-2xl rotate-quarter xl:rotate-none">arrow_left</i>
          </button>
          <button
            :disabled="i === dashboard.length - 1"
            @click="toBackEdit(i)"
            class="w-12 h-12 bg-naito-blue-300 text-gray-100 simple-action"
          >
            <i class="material-icons text-2xl rotate-quarter xl:rotate-none">arrow_right</i>
          </button>
          <button
            @click="deleteEdit(i)"
            class="w-12 h-12 bg-naito-blue-300 text-gray-100 simple-action rounded-r-md"
          >
            <i class="material-icons text-lg">delete</i>
          </button>
        </div>
        <chart
          :class="chartClasses"
          :period="periodNumber(chart.period)"
          :agregation="agregationNumber(chart.agregation)"
          :offset="chart.offset"
          :resources="chart.resources"
          :legend="false"
        ></chart>
        <button
          class="mt-2 w-full sm:w-120 action bg-naito-green-200 text-gray-100 text-center"
          :disabled="editMode"
          @click="$router.push({name: 'explore', query: chart})"
          v-text="$t('pages.index.open_chart')"
        ></button>
      </section>
    </div>

    <!-- edit mode -->

    <section
      v-if="!editMode"
      class="fixed bottom-0 w-full sm:w-auto right-0 sm:mb-12 text-gray-100 rounded-l-md flex flex-col"
    >
      <button
        :disabled="dashboard.length === 0"
        @click="editMode = true"
        class="sm:rounded-l-md p-4 bg-naito-blue-300 simple-action shadow-lg-top sm:shadow-lg sm:flex-row-reverse"
      >
        <i class="material-icons text-lg mr-4 sm:mr-0 sm:ml-4">build</i>
        <span class="font-medium" v-text="$t('pages.index.edit.title')"></span>
      </button>
    </section>

    <!-- blocker -->
    <div :class="backClasses"></div>
    <!-- actions -->
    <div :class="actionsClasses">
      <button @click="undoEdit" :disabled="!editHasPrevious" :class="cancelClasses">
        <i class="material-icons text-lg mr-4">undo</i>
        <span v-text="$t('pages.index.edit.cancel_last')"></span>
      </button>
      <button @click="confirmEdit" :class="confirmClasses">
        <i class="material-icons text-lg mr-4">done_all</i>
        <span v-text="$t('pages.index.edit.confirm_all')"></span>
      </button>
    </div>
  </div>
</template>
<script>
import AppHeader from '../components/app-header.vue'
import AppMenu from '../components/app-menu.vue'

import Chart from '../components/chart'
import { periods, agregations, generateName } from '../assets/utils'

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
  components: { AppHeader, AppMenu, Chart },
  async mounted() {
    await Promise.all([
      this.$getUser(),
      this.$getResources(),
      this.$getResourceTypes(),
      this.$getSensors(),
      this.$getSites(),
    ])

    /*
    // code to hide tooltip only on touch & drag
    // not used because choosen to hide tooltip when not pressing
    const scrollElement = document.querySelector('#__layout > div')
    let offset = 0
    document.ontouchstart = e => {
      offset = scrollElement.scrollTop
    }

    document.ontouchend = e => {
      const hasScrolled = offset !== scrollElement.scrollTop
      if (hasScrolled) {
        EventBus.$emit('touchAndDrag')
      }
    }
    */
  },
  data() {
    return {
      isMenuOpen: false,
      editMode: false,
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    periodNumber(periodName) {
      return periods[periodName]
    },
    agregationNumber(agregationName) {
      return agregations[agregationName]
    },
    chartKey(chart) {
      return `${chart.period}-${chart.agregation}-${
        chart.offset
      }-${chart.resources.join('_')}`
    },
    generateName(chart) {
      if (!this.$store.state.dataById.resources) {
        return '...'
      }

      return generateName(
        chart,
        this.$store.state.dataById.resources,
        this.$i18n
      )
    },
    nameEdit(index, oldName, newName) {
      if (oldName === newName) {
        return
      }

      const newDashboard = JSON.parse(JSON.stringify(this.dashboard))
      newDashboard[index].name = newName

      this.$store.commit('ADD_DASHBOARD_EDIT', { dashboard: newDashboard })
    },
    toFrontEdit(index) {
      const newDashboard = JSON.parse(JSON.stringify(this.dashboard))

      const element = newDashboard.splice(index, 1)
      newDashboard.splice(index - 1, 0, element[0])

      this.$store.commit('ADD_DASHBOARD_EDIT', { dashboard: newDashboard })
    },
    toBackEdit(index) {
      const newDashboard = JSON.parse(JSON.stringify(this.dashboard))

      const element = newDashboard.splice(index, 1)
      newDashboard.splice(index + 1, 0, element[0])

      this.$store.commit('ADD_DASHBOARD_EDIT', { dashboard: newDashboard })
    },
    deleteEdit(index) {
      const newDashboard = JSON.parse(JSON.stringify(this.dashboard))

      newDashboard.splice(index, 1)

      this.$store.commit('ADD_DASHBOARD_EDIT', { dashboard: newDashboard })
    },
    undoEdit() {
      this.$store.commit('REMOVE_LAST_DASHBOARD_EDIT')
    },
    async confirmEdit() {
      // check if any changes have been made or not
      if (
        JSON.stringify(this.dashboard) ===
        JSON.stringify(this.$store.state.data.user.dashboard)
      ) {
        this.$store.dispatch('validateDashboardChanges')
        this.editMode = false
        return
      }

      try {
        await this.$putUser(
          { dashboard: JSON.stringify(this.dashboard) },
          this.$t('api.dashboard_updated'),
          3000
        )
        // don't quit edit mode if there was an error (to not loose the changes)
        this.$store.dispatch('validateDashboardChanges')
        this.editMode = false
      } catch (e) {}
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
      const locale = this.$numberLocale()
      return {
        sensor: `${this.numResources.toLocaleString(locale)} ${this.$tc(
          'pages.index.sensor',
          this.numResources
        )}`,
        site: `${this.numSites.toLocaleString(locale)} ${this.$tc(
          'pages.index.site',
          this.numSites
        )}`,
      }
    },
    dashboard() {
      return this.editMode
        ? this.$store.getters.dashboardEditCurrent
        : this.$store.getters.dashboard
    },

    // edit mode stuff
    backClasses() {
      return [
        'fixed',
        'z-20',
        'top-0',
        'left-0',
        'right-0',
        'w-screen',
        'h-screen',
        'bg-gray-darken',
        'transition-opacity-100',
        'pointer-events-none',
      ].concat(this.editMode ? ['opacity-1'] : ['opacity-0'])
    },
    actionsClasses() {
      return [
        'fixed',
        'bottom-0',
        'left-0',
        'right-0',
        'z-30',
        'text-gray-100',
        'flex',
        'flex-col',
        'sm:flex-row',
        'w-full',
        'transition-opacity-100',
        'pointer-events-none',
      ].concat(this.editMode ? ['opacity-1'] : ['opacity-0'])
    },
    chartParentClasses() {
      return [
        'bg-gray-100',
        'rounded-md',
        'p-4',
        'md:p-6',
        'mb-3',
        'mx-auto',
        'w-full',
        'lg:w-2/3',
        'xl:m-3',
        'xl:w-fake1/2',
        'flex',
        'flex-col',
        'items-center',
      ].concat(this.editMode ? ['z-30'] : [])
    },
    chartClasses() {
      return ['chart-height'].concat(
        this.editMode
          ? ['pointer-events-none', 'opacity-50']
          : ['pointer-events-auto', 'opacity-1']
      )
    },
    cancelClasses() {
      return [
        'bg-gray-600',
        'simple-action',
        'p-4',
        'sm:ml-auto',
        'sm:px-8',
        'sm:rounded-tl-md',
        'shadow-lg-top',
      ].concat(
        this.editMode ? ['pointer-events-auto'] : ['pointer-events-none']
      )
    },
    confirmClasses() {
      return [
        'bg-naito-green-200',
        'simple-action',
        'p-4',
        'sm:mr-auto',
        'sm:px-8',
        'sm:rounded-tr-md',
        'shadow-lg-top',
      ].concat(
        this.editMode ? ['pointer-events-auto'] : ['pointer-events-none']
      )
    },
    editHasPrevious() {
      return this.$store.getters.dashboardUndoList.length > 0
    },
  },
}
</script>
