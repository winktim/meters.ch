<template>
  <div>
    <app-header
      :title="$t('pages.settings.title')"
      :description="$t('pages.settings.description')"
      :back="true"
    ></app-header>

    <section class="mb-8 flex flex-col items-center">
      <a
        class="mb-4 w-5/6 sm:w-100 action bg-naito-blue-300 text-gray-100 text-center relative"
        href="mailto:support@naito.one"
      >
        <i class="material-icons absolute left-0 m-4 top-0">contact_support</i>
        <span v-text="$t('pages.settings.support')"></span>
      </a>

      <a
        class="w-full sm:w-120 action bg-naito-green-200 text-gray-100 text-center relative"
        @click="logout"
        :href="loginUrl"
      >
        <i class="material-icons absolute left-0 m-4 top-0">launch</i>
        <span v-text="$t('pages.settings.logout')"></span>
      </a>
    </section>

    <section
      class="bg-gray-100 rounded-md p-4 mb-8 md:mx-20 lg:w-200 lg:mx-auto"
    >
      <h2
        class="text-lg font-bold mb-3"
        v-text="$t('pages.settings.client')"
      ></h2>
      <ul>
        <li
          class="flex items-center my-1"
          v-for="(data, i) in clientData"
          :key="i"
        >
          <p class="font-medium w-1/2 pr-2" v-text="$t(data.name)"></p>
          <p v-text="data.value"></p>
        </li>
      </ul>
    </section>

    <section
      class="bg-gray-100 rounded-md p-4 mb-8 md:mx-20 lg:w-200 lg:mx-auto"
    >
      <h2
        class="text-lg font-bold mb-3"
        v-text="$t('pages.settings.user')"
      ></h2>
      <ul>
        <li
          class="flex items-center my-1"
          v-for="(data, i) in userData"
          :key="i"
        >
          <p class="font-medium w-1/2 pr-2" v-text="$t(data.name)"></p>
          <p v-text="data.value"></p>
        </li>
        <li class="flex items-center mt-1">
          <p
            class="font-medium w-1/2 pr-2"
            v-text="$t('pages.settings.data.locale')"
          ></p>
          <language-selector
            :locale="userLocale"
            :locales="locales"
            :label="'global.set_locale'"
            name="backend"
            @change="saveUserLocale"
          ></language-selector>
        </li>
        <li>
          <p
            class="text-gray-800 mb-1"
            v-text="$t('pages.settings.locale_explain')"
          ></p>
        </li>
      </ul>
    </section>

    <section
      class="bg-gray-100 rounded-md mb-1 p-4 md:mx-20 lg:w-200 lg:mx-auto text-center"
    >
      <p
        class="font-medium text-center"
        v-text="$t('pages.settings.sensor_subscriptions')"
      ></p>
      <p
        class="text-center"
        v-text="$t('pages.settings.sensor_subscriptions_details')"
      ></p>
    </section>

    <!-- sensor subscriptions -->
    <ul class="flex flex-col items-center mb-8 md:mx-20 lg:w-200 lg:mx-auto">
      <li
        class="w-full my-1 flex justify-between items-center bg-gray-100 rounded-md hover:shadow-lg"
        v-for="(sensor, i) in sensors"
        :key="i"
      >
        <label
          :for="i + '-subscribe-input'"
          class="font-bold flex-grow p-4 clickable focus:shadow-outline flex items-center"
        >
          <span class="font-mono uppercase" v-text="`${sensor.name}`"></span>
          <span
            class="pl-4"
            v-text="getFormattedSensorResources(sensor.id)"
          ></span>
        </label>

        <!-- checkbox -->
        <label
          class="material-checkbox text-naito-blue-300"
          :for="i + '-subscribe-input'"
        >
          <input
            type="checkbox"
            :name="i + '-subscribe-input'"
            :id="i + '-subscribe-input'"
            :checked="isSubscribed(sensor.id)"
            @change="toggleSubscribe(sensor.id)"
          />
          <div
            class="material-checkbox-fake material-checkbox-fake__large"
          ></div>
        </label>
      </li>
    </ul>

    <section
      class="bg-gray-100 rounded-md mb-24 p-4 md:mx-20 lg:w-200 lg:mx-auto text-center"
    >
      <span v-text="$t('copyright.meteo')"></span>
      <a
        class="green-link"
        rel="noreferrer"
        target="_blank"
        href="https://www.prevision-meteo.ch"
        >www.prevision-meteo.ch</a
      >
    </section>
  </div>
</template>
<script>
import { DateTime } from 'luxon'
import { mapActions } from 'vuex'

import AppHeader from '../components/app-header.vue'
import LanguageSelector from '../components/language-selector.vue'
import { formatResource } from '../assets/utils'

export default {
  middleware: 'needs-auth',
  head() {
    return {
      title: `${this.$t('pages.settings.title')} - Meters`,
      htmlAttrs: {
        lang: this.$store.state.locale,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.settings.description'),
        },
      ],
    }
  },
  components: { AppHeader, LanguageSelector },
  data() {
    return {
      loginUrl: '/login',
    }
  },
  async mounted() {
    if (this.$store.getters.rememberMe) {
      this.loginUrl = '/login?remember-me'
    }

    await Promise.all([
      this.$getUsers(),
      this.$getSensors(),
      this.$getResources(),
      this.$getResourceTypes(),
      this.$getSites(),
      this.$getClients(),
    ])
  },
  methods: {
    saveUserLocale(payload) {
      this.$putUser(payload)
    },
    isSubscribed(sensorId) {
      return this.sensorSubscriptions.includes(sensorId)
    },
    async toggleSubscribe(sensorId) {
      const index = this.sensorSubscriptions.indexOf(sensorId)

      const newSensorSubscriptions = [...this.sensorSubscriptions]

      if (index !== -1) {
        newSensorSubscriptions.splice(index, 1)
      } else {
        newSensorSubscriptions.push(sensorId)
      }

      try {
        await this.$putUser(
          { sensor_subscriptions: JSON.stringify(newSensorSubscriptions) },
          this.$t('api.sensor_subscriptions_updated'),
          6000
        )

        // save to local store
        this.$store.dispatch('updateSensorSubscriptions', {
          sensor_subscriptions: newSensorSubscriptions,
        })
      } catch (e) {
        // failed to put user. error are handled by the put method
      }
    },
    getFormattedSensorResources(sensorId) {
      const resources = this.$store.getters.resources.filter(
        (resource) => resource.sensor_id === sensorId
      )

      if (resources.length === 0) {
        return this.$t('pages.settings.no_associated_resources')
      }

      return resources
        .map((resource) =>
          formatResource(
            this.$i18n,
            resource,
            this.$store.getters.resourceType(resource)
          )
        )
        .join(', ')
    },
    async logout(event) {
      event.preventDefault()

      // logout on the backend to delete the session
      try {
        const res = await this.$post('/logout', {
          api_token: this.$store.state.apiToken,
        })
      } catch (e) {
        console.error(e)
      }

      this.$store.dispatch('logout')
      this.$router.push(this.loginUrl)
    },
  },
  computed: {
    /**
     * @returns {string}
     */
    name() {
      return this.$store.getters.name
    },
    clientData() {
      const locale = this.$numberLocale()
      return [
        {
          name: 'pages.settings.data.client_name',
          value: this.$store.getters.clientName,
        },
        {
          name: 'pages.settings.data.client_number',
          value: this.$store.getters.clientNumber,
        },
        { name: 'global.email', value: this.$store.getters.clientEmail },
        {
          name: 'pages.settings.data.num_sensors',
          value: this.$store.getters.numResources.toLocaleString(locale),
        },
        {
          name: 'pages.settings.data.num_sites',
          value: this.$store.getters.numSites.toLocaleString(locale),
        },
      ]
    },
    userData() {
      return [
        {
          name: 'pages.settings.data.user_name',
          value: this.$store.getters.name,
        },
        { name: 'global.email', value: this.$store.getters.email },
        {
          name: 'pages.settings.data.created_at',
          value: this.$store.getters.accountCreatedAt
            .setLocale(this.$dateLocale())
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
    /**
     * @returns {number[]} a list of the ids of the sensors to which the user subscribed to
     */
    sensorSubscriptions() {
      return this.$store.getters.sensorSubscriptions
    },
    sensors() {
      return this.$store.getters.sensors
    },
  },
}
</script>
