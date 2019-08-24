<template>
  <div class="background-image font-content w-screen h-screen flex overflow-x-hidden">
    <loading-bar :show="isAppLoading"></loading-bar>
    <div class="absolute right-0 top-0">
      <language-selector
        :locale="locale"
        :locales="locales"
        :label="'global.set_locale'"
        name="page"
        @change="SET_LOCALE($event)"
      ></language-selector>
    </div>
    <main class="flex-grow w-full text-gray-900 px-6">
      <nuxt />
    </main>
    <message-box></message-box>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

import MessageBox from '../components/message-box'
import LanguageSelector from '../components/language-selector.vue'
import LoadingBar from '../components/loading-bar.vue'

export default {
  methods: {
    ...mapMutations(['SET_LOCALE']),
  },
  components: { LanguageSelector, MessageBox, LoadingBar },
  computed: {
    locale() {
      return this.$store.state.locale
    },
    locales() {
      return this.$store.state.locales
    },
    isAppLoading() {
      return this.$store.state.isAppLoading
    },
  },
}
</script>

