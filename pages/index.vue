<template>
  <div>
    <div
      :class="[
        'z-10',
        'fixed',
        'top-0',
        'left-0',
        'w-screen',
        'h-screen',
        isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none',
      ]"
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
        >
          menu
        </button>
        <app-menu
          v-if="isMenuOpen"
          class="absolute top-full w-60 mt-1"
        ></app-menu>
      </div>
      <div>
        <p v-html="$t('pages.index.hello', { name })"></p>
        <p
          class="sm:hidden"
          v-html="$t('pages.index.summary_small', sensorAndSitParams)"
        ></p>
        <p
          class="hidden sm:block"
          v-html="$t('pages.index.summary', sensorAndSitParams)"
        ></p>
      </div>
    </section>

    <!-- temperature instant values -->
    <div class="flex flex-wrap justify-center">
      <section
        v-for="(resource, i) in temperatureResources"
        :key="i"
        :class="temperatureParentClasses"
      >
        <h2
          class="text-lg font-bold mb-2 text-center"
          v-text="resource.title"
        ></h2>

        <!-- checkbox -->
        <label
          v-if="editMode"
          class="material-checkbox text-naito-blue-300"
          :for="i + '-enable-input'"
        >
          <input
            type="checkbox"
            :name="i + '-enable-input'"
            :id="i + '-enable-input'"
            :checked="isTempIncluded(resource.id)"
            @change="tempToggleEdit(resource.id, $event.target.checked)"
          />
          <div
            class="material-checkbox-fake material-checkbox-fake__large"
          ></div>
        </label>

        <div v-else class="flex w-full justify-center items-center">
          <span
            v-if="
              currentTemperatures[resource.id] &&
                currentTemperatures[resource.id].state === changeState.INCREASE
            "
            class="mr-4 text-3xl text-red-600 twitching-arrow select-none"
            >↗</span
          >
          <span
            v-if="
              currentTemperatures[resource.id] &&
                currentTemperatures[resource.id].state === changeState.DECREASE
            "
            class="mr-4 text-3xl text-blue-600 twitching-arrow select-none"
            >↙</span
          >
          <span
            :class="['text-4xl', tempValueColorClass(resource.id)]"
            v-text="
              currentTemperatures[resource.id]
                ? currentTemperatures[resource.id].value
                : resource.value
            "
          ></span>
        </div>
        <button
          class="mt-2 action bg-naito-green-200 text-gray-100 text-center"
          :disabled="editMode"
          @click="
            $router.push({ name: 'explore', query: { resources: resource.id } })
          "
          v-text="$t('pages.index.open_chart')"
        ></button>
      </section>
    </div>

    <!-- dashboard elements -->
    <div :class="dashboardRootClasses">
      <section
        v-for="(chart, i) in dashboard.charts"
        :key="chartKey(chart)"
        :class="chartParentClasses"
      >
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
            <i class="material-icons text-2xl rotate-quarter xl:rotate-none"
              >arrow_left</i
            >
          </button>
          <button
            :disabled="i === dashboard.charts.length - 1"
            @click="toBackEdit(i)"
            class="w-12 h-12 bg-naito-blue-300 text-gray-100 simple-action"
          >
            <i class="material-icons text-2xl rotate-quarter xl:rotate-none"
              >arrow_right</i
            >
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
          @click="$router.push({ name: 'explore', query: chart })"
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
        :disabled="dashboard.charts.length === 0"
        @click="editMode = true"
        class="sm:rounded-l-md p-4 sm:pl-6 bg-naito-blue-300 simple-action shadow-lg-top sm:shadow-lg sm:flex-row-reverse"
      >
        <i class="material-icons text-lg mr-4 sm:mr-0 sm:ml-4">build</i>
        <span class="font-medium" v-text="$t('pages.index.edit.title')"></span>
      </button>
    </section>

    <!-- blocker -->
    <div :class="backClasses"></div>
    <!-- actions -->
    <div :class="actionsClasses">
      <button
        @click="undoEdit"
        :disabled="!editHasPrevious"
        :class="cancelClasses"
      >
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
import {
  periods,
  agregations,
  generateName,
  formatResource,
  decimalTwoFormat,
  changeState,
  alertState,
} from '../assets/utils'
import { Duration } from 'luxon'

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
      this.$getAlerts(),
    ])

    this.updateCurrentTemperatures()
    setInterval(
      () => this.updateCurrentTemperatures(),
      Duration.fromObject({ minutes: 15 })
    )

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
      changeState,
      isMenuOpen: false,
      editMode: false,
      currentTemperatures: {},
    }
  },
  methods: {
    updateCurrentTemperatures() {
      this.temperatureResources.forEach(async ({ id }) => {
        /**
         * @type {{id: number, value: number, read_at: string}[]}
         */
        const readings = await this.$getReadings(id, { last: 3 })
        const last = readings[readings.length - 1]
        if (!this.currentTemperatures.hasOwnProperty(id)) {
          this.$set(this.currentTemperatures, id, { value: 0, state: 0 })
        }
        this.currentTemperatures[id].value = `${last.value.toLocaleString(
          this.$numberLocale(),
          decimalTwoFormat
        )} °C`

        const lastValue = last.value
        const previous1 = readings[readings.length - 2].value
        const previous2 = readings[readings.length - 3].value

        if (lastValue > previous1 && lastValue > previous2) {
          this.currentTemperatures[id].state = changeState.INCREASE
        } else if (lastValue < previous1 && lastValue < previous2) {
          this.currentTemperatures[id].state = changeState.DECREASE
        } else {
          this.currentTemperatures[id].state = changeState.SAME
        }

        // check if there is an alert for the resource and if the value is outside the range
        this.currentTemperatures[id].alert = alertState.NONE
        const alerts = this.$store.getters.alerts
        for (const alert of alerts) {
          if (alert.resource_id !== id) {
            continue
          }

          if (lastValue > alert.max) {
            this.currentTemperatures[id].alert = alertState.ABOVE
          } else if (lastValue < alert.min) {
            this.currentTemperatures[id].alert = alertState.BELOW
          }

          // only consider the first corresponding alert
          break
        }
      })
    },
    tempValueColorClass(id) {
      if (!this.currentTemperatures.hasOwnProperty(id)) {
        return ''
      }

      if (this.currentTemperatures[id].alert === alertState.ABOVE) {
        return 'text-red-600'
      }

      if (this.currentTemperatures[id].alert === alertState.BELOW) {
        return 'text-blue-600'
      }

      return ''
    },
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
      newDashboard.charts[index].name = newName

      this.$store.commit('ADD_DASHBOARD_EDIT', { dashboard: newDashboard })
    },
    toFrontEdit(index) {
      const newDashboard = JSON.parse(JSON.stringify(this.dashboard))

      const element = newDashboard.splice(index, 1)
      newDashboard.charts.splice(index - 1, 0, element[0])

      this.$store.commit('ADD_DASHBOARD_EDIT', { dashboard: newDashboard })
    },
    toBackEdit(index) {
      const newDashboard = JSON.parse(JSON.stringify(this.dashboard))

      const element = newDashboard.splice(index, 1)
      newDashboard.charts.splice(index + 1, 0, element[0])

      this.$store.commit('ADD_DASHBOARD_EDIT', { dashboard: newDashboard })
    },
    deleteEdit(index) {
      const newDashboard = JSON.parse(JSON.stringify(this.dashboard))

      newDashboard.charts.splice(index, 1)

      this.$store.commit('ADD_DASHBOARD_EDIT', { dashboard: newDashboard })
    },
    undoEdit() {
      this.$store.commit('REMOVE_LAST_DASHBOARD_EDIT')
    },
    tempToggleEdit(id, checked) {
      // the resource is currently checked if not in the excluded list
      const oldChecked = this.isTempIncluded(id)

      if (checked === oldChecked) {
        return
      }

      const newDashboard = JSON.parse(JSON.stringify(this.dashboard))

      if (checked) {
        // remove from exclude list
        newDashboard.temps.exclude.splice(
          newDashboard.temps.exclude.indexOf(id),
          1
        )
      } else {
        // add to exclude list
        newDashboard.temps.exclude.push(id)
      }

      this.$store.commit('ADD_DASHBOARD_EDIT', { dashboard: newDashboard })
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
        // update data in case we selecteed a new temperature resource
        this.updateCurrentTemperatures()
      } catch (e) {}
    },

    isTempIncluded(id) {
      return this.dashboard.temps.exclude.indexOf(id) === -1
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
    temperatureResources() {
      return (
        this.$store.getters.resources
          .filter(resource => {
            const resourceType = this.$store.getters.resourceType(resource)
            return resourceType && resourceType.name === 'Temperature'
          })
          .map(resource => {
            let site = null

            if (this.$store.getters.numSites > 1) {
              const sensor = this.$store.getters.sensor(resource)
              site = this.$store.getters.site(sensor)
            }

            return {
              title: formatResource(this.$i18n, resource, null, site),
              value: `... °C`,
              id: resource.id,
            }
          })
          // only show them all in edit mode, otherwise hide the exluded ones
          .filter(resource => this.editMode || this.isTempIncluded(resource.id))
      )
    },

    // edit mode stuff
    backClasses() {
      return [
        'fixed',
        'z-30',
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
        'z-40',
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
      ].concat(this.editMode ? ['z-40'] : [])
    },
    temperatureParentClasses() {
      return [
        'bg-gray-100',
        'rounded-md',
        'p-4',
        'md:p-6',
        'mb-3',
        'mx-3',
        'flex',
        'flex-col',
        'items-center',
        'min-w-2/3',
        'sm:min-w-64',
      ].concat(this.editMode ? ['z-40'] : [])
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
    dashboardRootClasses() {
      return [
        'flex',
        'flex-col',
        'xl:flex-row',
        'xl:flex-wrap',
        'justify-center',
      ].concat(this.editMode ? ['mb-28', 'sm:mb-15'] : ['mb-15'])
    },
    editHasPrevious() {
      return this.$store.getters.dashboardUndoList.length > 0
    },
  },
}
</script>
