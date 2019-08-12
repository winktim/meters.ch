<template>
  <div>
    <app-header
      :title="$t('pages.explore.title')"
      :description="$t('pages.explore.description')"
      :back="true"
    ></app-header>

    <section
      class="bg-gray-100 rounded-md p-4 mb-8 sm:w-120 mx-auto flex flex-col md:flex-row items-center justify-center"
    >
      <h2 class="text-lg font-bold mb-3 md:mb-0 md:mr-2" v-text="$t('pages.explore.period')"></h2>
      <p>
        <span class="text-naito-green-200 font-medium" v-text="fromDateTime"></span>
        <span v-text="$t('pages.explore.to')"></span>
        <span class="text-naito-green-200 font-medium" v-text="toDateTime"></span>
      </p>
    </section>
  </div>
</template>
<script>
import { DateTime } from 'luxon'

import AppHeader from '../components/app-header.vue'

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
  components: { AppHeader },
  async mounted() {
    await Promise.all([this.$getResources(), this.$getSites()])
  },
  computed: {
    fromDateTime() {
      return DateTime.local()
        .minus({ days: 1 })
        .setLocale(this.$fullLocale())
        .toLocaleString(DateTime.DATETIME_SHORT)
    },
    toDateTime() {
      return DateTime.local()
        .setLocale(this.$fullLocale())
        .toLocaleString(DateTime.DATETIME_SHORT)
    },
  },
}
</script>
