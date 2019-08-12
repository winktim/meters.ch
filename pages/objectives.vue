<template>
  <div>
    <app-header
      :title="$t('pages.objectives.title')"
      :description="$t('pages.objectives.description')"
      :back="true"
    ></app-header>

    <p class="font-medium text-center mb-6" v-text="$t('pages.objectives.info')"></p>

    <ul>
      <li class="bg-gray-100 rounded-md p-4 my-1"></li>
    </ul>

    <a
      class="mt-4 w-full sm:w-120 action bg-naito-blue-200 text-gray-100 text-center relative"
      @click="newObjective"
      href="#"
    >
      <i class="material-icons absolute left-0 ml-4">add</i>
      <span v-text="$t('pages.objectives.new')"></span>
    </a>
  </div>
</template>
<script>
import { DateTime } from 'luxon'

import AppHeader from '../components/app-header.vue'

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
  components: { AppHeader },
  async mounted() {
    await Promise.all([this.$getResources(), this.$getObjectives()])
  },
  methods: {
    newObjective(event) {
      event.preventDefault()
      return
    },
  },
  computed: {},
}
</script>
