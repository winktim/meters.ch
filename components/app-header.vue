<template>
  <header class="w-full flex items-center justify-center h-18">
    <button
      v-if="back"
      :title="$t('global.back')"
      @click="goBack"
      class="z-20 clickable material-icons focus:shadow-outline hover:lighten-10 active:darken-10 absolute left-0 top-0 min-w-10 min-h-10 px-5 py-4 text-2xl"
    >
      arrow_back
    </button>
    <img
      v-else
      class="z-20 absolute left-0 top-0 w-10 mx-5 my-4 select-none"
      src="/images/naito-900.svg"
      :alt="$t('alt.naito_one_logo')"
    />

    <h1 class="font-heading text-2xl" :title="description" v-text="title"></h1>
  </header>
</template>
<script>
import { handleNavigationError } from '../assets/utils'
export default {
  props: {
    title: String,
    description: String,
    back: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      default: '/',
    },
  },
  methods: {
    goBack(event) {
      event.preventDefault()

      this.$router.push(this.url).catch(handleNavigationError)
    },
  },
}
</script>
