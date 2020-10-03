<template>
  <div class="w-full">
    <app-header
      :title="$t('pages.signature.title')"
      :description="$t('pages.signature.description')"
      :back="true"
    ></app-header>

    <section
      class="relative bg-gray-100 rounded-md p-4 pt-2 md:p-6 md:pt-3 mb-48 mx-auto w-full lg:w-2/3 xl:w-3/5"
    >
      <signature-chart
        :class="[
          'chart-height-explore',
          'transition-opacity-100',
          isQueryValid ? 'opacity-1' : 'opacity-0',
        ]"
        :site-id="siteId"
        :temperature-id="temperatureId"
        :heater-id="heaterId"
        :period="period"
        :offset="offset"
        :filter-noise="filterNoise"
        :highlight-issues="highlightIssues"
        @currentData="setCurrentData"
      ></signature-chart>

      <div
        :class="
          [
            'absolute',
            'top-0',
            'left-0',
            'w-full',
            'h-full',
            'flex',
            'items-center',
            'justify-center',
            'transition-opacity-100',
          ].concat(
            isQueryValid
              ? ['opacity-0', 'pointer-events-none']
              : ['opacity-1', 'pointer-events-auto']
          )
        "
      >
        <span
          class="text-center font-medium p-4"
          v-text="$t('pages.signature.form.invalid_query')"
        ></span>
      </div>
    </section>

    <section
      class="fixed bottom-0 right-0 mb-70 text-gray-100 rounded-l-md flex flex-col"
    >
      <!-- download -->
      <button
        :title="$t('pages.explore.download.title')"
        :disabled="!hasData"
        @click="
          showDownloadPopup = true
          navPopup()
        "
        class="rounded-tl-md p-4 bg-naito-blue-300 simple-action"
      >
        <i class="material-icons text-xl">get_app</i>
      </button>
      <!-- bookmark -->
      <button
        :title="$t('pages.explore.bookmark.title')"
        :disabled="!isQueryValid"
        @click="
          showBookmarkPopup = true
          navPopup()
        "
        class="rounded-bl-md p-4 bg-naito-blue-300 simple-action"
      >
        <i class="material-icons text-xl">bookmark</i>
      </button>
    </section>

    <!-- parameters -->
    <section
      class="fixed bottom-0 inset-x-0 w-full p-4 md:px-1/5 lg:px-1/4 xl:px-1/3 bg-naito-green-200 shadow-lg-top"
      @click="revealIfCollapsed"
    >
      <!-- button to collapse parameters -->
      <button
        :title="$t('pages.explore.collapse_settings')"
        @click="toggleCollapse($event)"
        class="clickable material-icons absolute top-0 left-0 -mt-12 min-w-10 min-h-10 p-5 text-2xl bg-naito-green-200 rounded-t-full text-gray-100"
        v-text="areSettingsCollapsed ? 'expand_less' : 'expand_more'"
      ></button>
      <div :class="areSettingsCollapsed ? 'hidden' : 'block'">
        <!-- site select list -->
        <search-select
          name="site-input"
          class="mb-2"
          :placeholder="$t('pages.signature.form.site')"
          :options="formattedSites"
          :top="true"
          :single="true"
          v-model="siteId"
        ></search-select>

        <!-- interior temp resource select list -->
        <search-select
          name="temperature-input"
          class="mb-2"
          :placeholder="$t('pages.signature.form.temperature')"
          :options="formattedTemperatures"
          :top="true"
          :single="true"
          v-model="temperatureId"
        ></search-select>

        <!-- heater resource select list -->
        <search-select
          name="heater-input"
          class="mb-2"
          :placeholder="$t('pages.signature.form.heater')"
          :options="formattedHeaters"
          :top="true"
          :single="true"
          v-model="heaterId"
        ></search-select>

        <!-- period -->
        <div class="material-select mb-2">
          <label for="period-input" v-text="$t('periods.short')"></label>
          <select name="period-input" id="period-input" v-model="period">
            <option
              v-for="(option, i) in filteredPeriods"
              :key="i"
              :value="signaturePeriods[option]"
              v-text="$t('periods.' + option)"
            ></option>
          </select>
        </div>

        <!-- noise filter range -->
        <div class="w-full flex items-center mb-2">
          <label
            class="text-gray-100 font-bold mr-4 flex-grow"
            for="filter-noise-input"
            v-text="$t('pages.signature.form.noise_filter')"
          ></label>
          <input
            class="range-slider__range w-1/2"
            type="range"
            name="filter-noise-input"
            id="filter-noise-input"
            min="0"
            max="1"
            step="0.05"
            v-model.number="filterNoise"
          />
        </div>

        <!-- highlight issues range -->
        <div class="w-full flex items-center mb-2">
          <label
            class="text-gray-100 font-bold mr-4 flex-grow"
            for="highlight-issues-input"
            v-text="$t('pages.signature.form.highlight_issues')"
          ></label>
          <input
            class="range-slider__range w-1/2"
            type="range"
            name="highlight-issues-input"
            id="highlight-issues-input"
            min="0"
            max="1"
            step="0.05"
            v-model.number="highlightIssues"
          />
        </div>

        <!-- offset -->
        <div class="flex justify-end items-center">
          <span
            class="text-gray-100 font-bold mr-4"
            v-text="periodOffsetString"
          ></span>
          <!-- previous -->
          <button
            class="w-10 h-10 bg-gray-100 rounded-l-md simple-action"
            @click="offset++"
          >
            <i class="material-icons text-2xl text-gray-800">arrow_left</i>
          </button>
          <!-- next -->
          <button
            class="w-10 h-10 bg-gray-100 simple-action"
            @click="offset--"
            :disabled="isLastPeriodOffset"
          >
            <i class="material-icons text-2xl text-gray-800">arrow_right</i>
          </button>
          <!-- last -->
          <button
            class="w-10 h-10 bg-gray-100 rounded-r-md simple-action"
            @click="offset = 0"
            :disabled="isLastPeriodOffset"
          >
            <i class="material-icons text-lg text-gray-800">fast_forward</i>
          </button>
        </div>
      </div>
    </section>

    <bookmark-popup
      @cancel="
        showBookmarkPopup = false
        $router.go(-1)
      "
      @confirm="bookmark"
      :show="showBookmarkPopup"
      :periodOffsetString="periodOffsetString"
      :defaultChartName="defaultChartName"
    ></bookmark-popup>

    <download-popup
      @cancel="
        showDownloadPopup = false
        $router.go(-1)
      "
      @confirm="download"
      :show="showDownloadPopup"
    ></download-popup>
    <a ref="downloader" class="hidden"></a>
  </div>
</template>
<script>
import { DateTime } from 'luxon'
import {
  formatResource,
  datasetsToJson,
  JsonToCsv,
  generateName,
  HEATING_RESOURCE_TYPES,
  reverseSignaturePeriods,
  signaturePeriods,
} from '../assets/utils'

import AppHeader from '../components/app-header.vue'
import SearchSelect from '../components/search-select'
import SignatureChart from '../components/signature-chart'

import BookmarkPopup from '../components/bookmark-popup'
import DownloadPopup from '../components/download-popup'

export default {
  middleware: 'needs-auth',
  head() {
    return {
      title: `${this.$t('pages.signature.title')} - Meters`,
      htmlAttrs: {
        lang: this.$store.state.locale,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.signature.description'),
        },
      ],
    }
  },
  components: {
    AppHeader,
    SearchSelect,
    BookmarkPopup,
    DownloadPopup,
    SignatureChart,
  },
  data() {
    return {
      siteId: -1,
      temperatureId: -1,
      heaterId: -1,
      // start at one because there is no day period for signature
      // default: monthly
      period: 2,
      // default to showing previous period
      offset: 1,
      filterNoise: 0,
      highlightIssues: 0.2,

      showBookmarkPopup: false,
      showDownloadPopup: false,
      currentData: null,
      hasData: false,
      areSettingsCollapsed: false,
    }
  },
  async mounted() {
    // only need resources and sites to validate the query parameters
    // get sensors to filter resources by site
    // get resource types because it is needed to download the correct
    // readings in chart.vue (triggered on getting the query)
    await Promise.all([
      this.$getSites(),
      this.$getResources(),
      this.$getResourceTypes(),
      this.$getSensors(),
    ])

    this.getQuery()

    // if there is a single site and none selected, select it automatically
    if (this.$store.getters.numSites === 1 && this.siteId === -1) {
      this.siteId = this.formattedSites[0].id
    }

    this.setQuery()

    await Promise.all([this.$getUsers(), this.$getMeteoLocations()])
  },
  methods: {
    navPopup() {
      this.$router.push(
        { query: { ...this.$route.query, popup: null } },
        () => {},
        e => {
          if (e === undefined || e.name === 'NavigationDuplicated') {
            return
          }
          console.error(e)
        }
      )
    },
    setQuery() {
      const route = {
        query: {
          site: this.siteId === -1 ? undefined : String(this.siteId),
          temp:
            this.temperatureId === -1 ? undefined : String(this.temperatureId),
          heat: this.heaterId === -1 ? undefined : String(this.heaterId),
          period: reverseSignaturePeriods[this.period],
          offset: String(this.offset),
          filter: String(this.filterNoise),
          highlight: String(this.highlightIssues),
        },
      }

      // small optimization to avoid replacing a route with itself
      if (JSON.stringify(route.query) === JSON.stringify(this.$route.query)) {
        return
      }

      this.$router.replace(
        route,
        () => {},
        e => {
          // ignore this error. we cannot easily check if the query is the same as the current
          // which would avoid calling replace when not needed
          if (e === undefined || e.name === 'NavigationDuplicated') {
            return
          }
          console.error(e)
        }
      )
    },
    getQuery() {
      const query = this.$route.query

      const siteId = parseInt(query.site)
      // check site has a meteo location id
      if (
        !isNaN(siteId) &&
        this.$store.state.dataById.sites[siteId] !== undefined &&
        this.$store.state.dataById.sites[siteId].meteo_location_id !== null
      ) {
        this.siteId = siteId
      }

      const temperatureId = parseInt(query.temp)
      if (
        !isNaN(temperatureId) &&
        this.$store.state.dataById.resources[temperatureId] !== undefined
      ) {
        // check is temperature resource
        const resourceType = this.$store.getters.resourceType(
          this.$store.state.dataById.resources[temperatureId]
        )

        if (resourceType && resourceType.name === 'Temperature') {
          this.temperatureId = temperatureId
        }
      }

      const heaterId = parseInt(query.heat)
      if (
        !isNaN(heaterId) &&
        this.$store.state.dataById.resources[heaterId] !== undefined
      ) {
        // check is heater resource
        const resourceType = this.$store.getters.resourceType(
          this.$store.state.dataById.resources[heaterId]
        )

        if (
          resourceType &&
          HEATING_RESOURCE_TYPES.includes(resourceType.name)
        ) {
          this.heaterId = heaterId
        }
      }

      const period = reverseSignaturePeriods.indexOf(query.period)
      if (period !== -1) {
        this.period = period
      }

      const offset = parseInt(query.offset)
      if (!isNaN(offset) && offset >= 0) {
        // back 1 year in weeks
        this.offset = Math.min(offset, 53)
      }

      const filterNoise = parseFloat(query.filter)
      if (!isNaN(filterNoise) && filterNoise >= 0 && filterNoise <= 1) {
        this.filterNoise = filterNoise
      }

      const highlightIssues = parseFloat(query.highlight)
      if (
        !isNaN(highlightIssues) &&
        highlightIssues >= 0 &&
        highlightIssues <= 1
      ) {
        this.highlightIssues = highlightIssues
      }
    },
    setCurrentData({ datasets, hasData }) {
      this.currentData = datasets
      this.hasData = hasData
    },
    download(payload) {
      this.showDownloadPopup = false
      this.$router.go(-1)

      const jsonData = datasetsToJson(this.currentData)

      let dataStr = ''

      // TODO: handle download
      /*
      let name = `chart-period_${reversePeriods[this.period]}-offset_${
        this.offset
      }-agregation_${
        reverseAgregations[this.agregation]
      }-resources_${this.resources.join(',')}`

      if (payload.format === 'json') {
        dataStr =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(JSON.stringify(jsonData, null, 2))
        name += '.json'
      } else {
        dataStr =
          'data:text/csv;charset=utf-8,' +
          encodeURIComponent(JsonToCsv(jsonData))
        name += '.csv'
      }

      this.$refs.downloader.setAttribute('href', dataStr)
      this.$refs.downloader.setAttribute('download', name)
      this.$refs.downloader.click()
      */
    },
    bookmark({ name }) {
      this.showBookmarkPopup = false
      this.$router.go(-1)

      // TODO: handle bookmark
      /*
      const payload = {
        name,
        offset: this.offset,
        agregation: reverseAgregations[this.agregation],
        period: reversePeriods[this.period],
        resources: this.resources,
      }

      this.$store.commit('ADD_DASHBOARD_CHART', { element: payload })

      this.$putUser(
        { dashboard: JSON.stringify(this.$store.getters.dashboard) },
        this.$t('api.dashboard_updated'),
        3000
      )
      */
    },
    toggleCollapse(event) {
      this.areSettingsCollapsed = !this.areSettingsCollapsed
      event.stopPropagation()
    },
    revealIfCollapsed() {
      if (this.areSettingsCollapsed) {
        this.areSettingsCollapsed = false
      }
    },
  },
  watch: {
    siteId() {
      this.setQuery()
    },
    temperatureId() {
      this.setQuery()
    },
    heaterId() {
      this.setQuery()
    },
    period() {
      this.setQuery()
    },
    offset() {
      this.setQuery()
    },
    filterNoise() {
      this.setQuery()
    },
    highlightIssues() {
      this.setQuery()
    },
    $route(to) {
      if (!to.query.hasOwnProperty('popup')) {
        if (this.showBookmarkPopup) {
          this.showBookmarkPopup = false
        }
        if (this.showDownloadPopup) {
          this.showDownloadPopup = false
        }
      }
    },
  },
  computed: {
    reverseSignaturePeriods() {
      return reverseSignaturePeriods
    },
    signaturePeriods() {
      return signaturePeriods
    },
    filteredPeriods() {
      return reverseSignaturePeriods.filter(Boolean)
    },
    isLastPeriodOffset() {
      return this.offset === 0
    },
    periodOffsetString() {
      return this.$tc(
        'period_offsets.' + reverseSignaturePeriods[this.period],
        this.offset,
        { count: this.offset }
      )
    },
    formattedSites() {
      // meteo_location_id is nullable. don't include sites that don't have it
      return this.$store.getters.sites
        .filter(site => site.meteo_location_id !== null)
        .map(site => {
          return {
            id: site.id,
            value: `${site.name}, ${site.zip} ${site.city}`,
          }
        })
    },
    allTemperatures() {
      return this.$store.getters.resources.filter(resource => {
        const resourceType = this.$store.getters.resourceType(resource)
        return resourceType && resourceType.name === 'Temperature'
      })
    },
    formattedTemperatures() {
      return this.allTemperatures
        .filter(resource => {
          const sensor = this.$store.getters.sensor(resource)
          return sensor && sensor.site_id === this.siteId
        })
        .map(resource => {
          return {
            id: resource.id,
            value: resource.description,
          }
        })
    },
    allHeaters() {
      return this.$store.getters.resources.filter(resource => {
        const resourceType = this.$store.getters.resourceType(resource)
        return (
          resourceType && HEATING_RESOURCE_TYPES.includes(resourceType.name)
        )
      })
    },
    formattedHeaters() {
      return this.allHeaters
        .filter(resource => {
          const sensor = this.$store.getters.sensor(resource)
          return sensor && sensor.site_id === this.siteId
        })
        .map(resource => {
          const resourceType = this.$store.getters.resourceType(resource)
          return {
            id: resource.id,
            value: formatResource(this.$i18n, resource, resourceType, null),
          }
        })
    },
    defaultChartName() {
      // TODO: chart name
      return ''
      /*
      if (this.resources.length === 0) {
        return ''
      }

      if (!this.$store.state.dataById.resources) {
        return ''
      }

      return generateName(
        {
          offset: this.offset,
          period: reversePeriods[this.period],
          resources: this.resources,
        },
        this.$store.state.dataById.resources,
        this.$i18n
      )
      */
    },
    isQueryValid() {
      return (
        this.siteId !== -1 && this.temperatureId !== -1 && this.heaterId !== -1
      )
    },
  },
}
</script>
