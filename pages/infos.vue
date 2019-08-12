<template>
  <div>
    <app-header
      :title="$t('pages.infos.title')"
      :description="$t('pages.infos.description')"
      :back="true"
    ></app-header>

    <section class="bg-gray-100 rounded-md p-4 mb-8 md:mx-20 lg:w-200 lg:mx-auto">
      <h2 class="text-lg font-bold mb-3" v-text="$t('pages.infos.client')"></h2>
      <ul>
        <li class="flex items-center my-1" v-for="(data, i) in clientData" :key="i">
          <p class="font-medium w-1/2 pr-2" v-text="$t(data.name)"></p>
          <p v-text="data.value"></p>
        </li>
      </ul>
    </section>

    <section class="bg-gray-100 rounded-md p-4 md:mx-20 lg:w-200 lg:mx-auto">
      <h2 class="text-lg font-bold mb-3" v-text="$t('pages.infos.user')"></h2>
      <ul>
        <li class="flex items-center my-1" v-for="(data, i) in userData" :key="i">
          <p class="font-medium w-1/2 pr-2" v-text="$t(data.name)"></p>
          <p v-text="data.value"></p>
        </li>
        <li class="flex items-center mt-1">
          <p class="font-medium w-1/2 pr-2" v-text="$t('pages.infos.data.locale')"></p>
          <language-selector
            :locale="userLocale"
            :locales="locales"
            :label="'global.set_locale'"
            @change="saveUserLocale"
          ></language-selector>
        </li>
        <li>
          <p class="text-gray-800 mb-1" v-text="$t('pages.infos.locale_explain')"></p>
        </li>
      </ul>
    </section>

    <section class="mt-16 mb-24 md:mt-24 flex flex-col items-center">
      <a
        class="mb-8 md:mb-12 w-full sm:w-120 action bg-naito-blue-200 text-gray-100 text-center relative"
        href="mailto:support@naito.one"
      >
        <i class="material-icons absolute left-0 ml-4">contact_support</i>
        <span v-text="$t('pages.infos.support')"></span>
      </a>

      <a
        class="w-5/6 sm:w-100 action bg-naito-green-200 text-gray-100 text-center relative"
        @click="logout"
        href="/login"
      >
        <i class="material-icons absolute left-0 ml-4">launch</i>
        <span v-text="$t('pages.infos.logout')"></span>
      </a>
    </section>
  </div>
</template>
<script>
import { DateTime } from 'luxon'
import { mapActions } from 'vuex'

import AppHeader from '../components/app-header.vue'
import LanguageSelector from '../components/language-selector.vue'

export default {
  middleware: 'needs-auth',
  head() {
    return {
      title: `${this.$t('pages.infos.title')} - Meters`,
      htmlAttrs: {
        lang: this.$store.state.locale,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.infos.description'),
        },
      ],
    }
  },
  components: { AppHeader, LanguageSelector },
  async mounted() {
    await Promise.all([
      this.$getUser(),
      this.$getResources(),
      this.$getSites(),
      this.$getClient(),
    ])
  },
  methods: {
    saveUserLocale(payload) {
      this.$putUser(payload)
    },
    ...mapActions(['logout']),
  },
  computed: {
    /**
     * @returns {string}
     */
    name() {
      return this.$store.getters.name
    },
    clientData() {
      return [
        {
          name: 'pages.infos.data.client_name',
          value: this.$store.getters.clientName,
        },
        {
          name: 'pages.infos.data.client_number',
          value: this.$store.getters.clientNumber,
        },
        { name: 'global.email', value: this.$store.getters.clientEmail },
        {
          name: 'pages.infos.data.num_sensors',
          value: this.$store.getters.numResources,
        },
        {
          name: 'pages.infos.data.num_sites',
          value: this.$store.getters.numSites,
        },
      ]
    },
    userData() {
      return [
        {
          name: 'pages.infos.data.user_name',
          value: this.$store.getters.name,
        },
        { name: 'global.email', value: this.$store.getters.email },
        {
          name: 'pages.infos.data.created_at',
          value: this.$store.getters.accountCreatedAt
            .setLocale(this.$fullLocale())
            .toLocaleString(DateTime.DATE_FULL),
        },
      ]
    },
    userLocale() {
      return this.$store.getters.userLocale
    },
    locales() {
      return this.$store.state.locales
    },
  },
}
</script>
