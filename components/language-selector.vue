<template>
  <div class="relative transperent-select">
    <select
      aria-label="Choix de la langue"
      name="language-select"
      id="language-select"
      class="px-2 w-15 h-15 font-heading text-sm"
      @change="SET_LOCALE({ locale: $event.target.value })"
      :value="locale"
    >
      <option v-for="(locale, i) in locales" :key="i" :value="locale" v-text="locale.toUpperCase()"></option>
    </select>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['SET_LOCALE']),
  },
  computed: {
    locales() {
      return this.$store.state.locales
    },
    locale() {
      return this.$store.state.locale
    },
  },
}
</script>

