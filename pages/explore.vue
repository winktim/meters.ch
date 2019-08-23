<template>
  <div>
    <app-header
      :title="$t('pages.explore.title')"
      :description="$t('pages.explore.description')"
      :back="true"
    ></app-header>

    <section
      class="bg-gray-100 rounded-md p-4 mb-8 sm:w-120 mx-auto flex flex-col sm:flex-row items-center justify-center"
    >
      <h2 class="text-lg font-bold mb-3 sm:mb-0 sm:mr-2" v-text="$t('pages.explore.period')"></h2>
      <p class="text-center">
        <span class="text-naito-green-200 font-medium" v-text="fromDateTime"></span>
        <span v-text="$t('pages.explore.to')"></span>
        <span class="text-naito-green-200 font-medium" v-text="toDateTime"></span>
      </p>
    </section>

    <section>{{resources}}</section>

    <section class="fixed bottom-0 right-0 mb-60 text-gray-100 rounded-l-md flex flex-col">
      <button
        :title="$t('pages.explore.download.title')"
        @click="showDownloadPopup = true"
        class="rounded-tl-md p-4 bg-naito-blue-200 simple-action"
      >
        <i class="material-icons text-xl">get_app</i>
      </button>
      <button
        :title="$t('pages.explore.bookmark.title')"
        @click="showBookmarkPopup = true"
        class="rounded-bl-md p-4 bg-naito-blue-200 simple-action"
      >
        <i class="material-icons text-xl">bookmark</i>
      </button>
    </section>

    <!-- parameters -->
    <section
      class="fixed bottom-0 inset-x-0 w-full p-4 md:px-1/5 lg:px-1/4 xl:px-1/3 bg-naito-green-200 shadow-lg-top"
    >
      <search-select-multi
        name="resources"
        :placeholder="$t('pages.explore.form.find_resources')"
        :options="formattedResources"
        :top="true"
        v-model="resources"
      ></search-select-multi>
      <div class="flex my-2">
        <div class="w-1/2 mr-1 material-select">
          <label for="agregation-input" v-text="$t('agregations.short')"></label>
          <select name="agregation-input" id="agregation-input" v-model="agregation">
            <option
              v-for="(option, i) in reverseAgregations"
              :key="i"
              :value="i"
              v-text="$t('agregations.' + option)"
            ></option>
          </select>
        </div>
        <div class="w-1/2 ml-1 material-select">
          <label for="period-input" v-text="$t('periods.short')"></label>
          <select name="period-input" id="period-input" v-model="period">
            <option
              v-for="(option, i) in reversePeriods"
              :key="i"
              :value="i"
              v-text="$t('periods.' + option)"
            ></option>
          </select>
        </div>
      </div>
      <!-- offset -->
      <div class="flex justify-end items-center">
        <span class="text-gray-100 font-bold mr-4" v-text="periodOffsetString"></span>
        <!-- previous -->
        <button class="w-10 h-10 bg-gray-100 rounded-l-md simple-action" @click="offset++">
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
    </section>

    <bookmark-popup
      @cancel="showBookmarkPopup = false"
      @confirm="bookmark"
      :show="showBookmarkPopup"
      :periodOffsetString="periodOffsetString"
    ></bookmark-popup>

    <download-popup
      @cancel="showDownloadPopup = false"
      @confirm="download"
      :show="showDownloadPopup"
    ></download-popup>
  </div>
</template>
<script>
import { DateTime } from 'luxon'
import {
  reversePeriods,
  reverseAgregations,
  formatResource,
} from '../assets/utils'

import AppHeader from '../components/app-header.vue'
import SearchSelectMulti from '../components/search-select-multi'

import BookmarkPopup from '../components/bookmark-popup'
import DownloadPopup from '../components/download-popup'

export default {
  middleware: 'needs-auth',
  head() {
    return {
      title: `${this.$t('pages.explore.title')} - Meters`,
      htmlAttrs: {
        lang: this.$store.state.locale,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.explore.description'),
        },
      ],
    }
  },
  components: { AppHeader, SearchSelectMulti, BookmarkPopup, DownloadPopup },
  data() {
    return {
      offset: 0,
      agregation: 0,
      period: 0,
      resources: [],
      showBookmarkPopup: false,
      showDownloadPopup: false,
    }
  },
  async mounted() {
    await Promise.all([
      this.$getResources(),
      this.$getResourceTypes(),
      this.$getSensors(),
      this.$getSites(),
      this.$getUser(),
    ])

    this.getQuery()
    this.setQuery()
  },
  methods: {
    setQuery() {
      const route = {
        name: this.$router.currentRoute.name,
        query: {
          offset: this.offset,
          agregation: reverseAgregations[this.agregation],
          period: reversePeriods[this.period],
          resources: this.resources,
        },
      }

      this.$router.replace(route)
    },
    getQuery() {
      const query = this.$route.query

      const period = reversePeriods.indexOf(query.period)
      if (period !== -1) {
        this.period = period
      }

      const agregation = reverseAgregations.indexOf(query.agregation)
      if (agregation !== -1) {
        this.agregation = agregation
      }

      const offset = parseInt(query.offset)
      if (!isNaN(offset) && offset >= 0) {
        // limit to 365
        this.offset = Math.min(offset, 365)
      }

      const resources = query.resources
      if (Array.isArray(resources) && resources.length > 0) {
        // filter existing resources
        this.resources = resources
          .map(id => parseInt(id))
          .filter(id => {
            return (
              !isNaN(id) &&
              this.$store.state.dataById.resources[id] !== undefined
            )
          })
      }
    },
    download(payload) {
      this.showDownloadPopup = false
      // TODO: implement
    },
    bookmark({ name }) {
      this.showBookmarkPopup = false

      const payload = {
        name,
        offset: this.offset,
        agregation: reverseAgregations[this.agregation],
        period: reversePeriods[this.period],
        resources: this.resources,
      }

      // TODO: implement
    },
  },
  watch: {
    offset() {
      this.setQuery()
    },
    agregation() {
      this.setQuery()
    },
    period() {
      this.setQuery()
    },
    resources() {
      this.setQuery()
    },
  },
  computed: {
    fromDateTime() {
      return DateTime.local()
        .minus({ days: 1 })
        .setLocale(this.$dateLocale())
        .toLocaleString(DateTime.DATETIME_SHORT)
    },
    toDateTime() {
      return DateTime.local()
        .setLocale(this.$dateLocale())
        .toLocaleString(DateTime.DATETIME_SHORT)
    },
    isLastPeriodOffset() {
      return this.offset === 0
    },
    reversePeriods() {
      return reversePeriods
    },
    reverseAgregations() {
      return reverseAgregations
    },
    periodOffsetString() {
      return this.$tc(
        'period_offsets.' + reversePeriods[this.period],
        this.offset,
        { count: this.offset }
      )
    },
    formattedResources() {
      return this.$store.getters.resources.map(resource => {
        const resourceType = this.$store.getters.resourceType(resource)
        let site = null
        if (this.$store.getters.numSites > 1) {
          const sensor = this.$store.getters.sensor(resource)
          site = this.$store.getters.site(sensor)
        }
        return {
          id: resource.id,
          value: formatResource(this.$i18n, resource, resourceType, site),
        }
      })
    },
  },
}
</script>
