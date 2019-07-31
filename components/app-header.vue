<template>
  <header class="w-full flex items-center justify-center h-18">
    <a
      v-if="back"
      href="#"
      class="clickable material-icons focus:shadow-outline hover:lighten-10 active:darken-10 absolute left-0 top-0 min-w-10 min-h-10 px-5 py-4 text-2xl"
    >arrow_back</a>
    <img
      v-else
      class="absolute left-0 top-0 w-10 mx-5 my-4"
      src="/images/naito-900.svg"
      :alt="$t('alt.naito-one-logo')"
    />

    <h1 class="font-heading text-2xl" v-text="title"></h1>
  </header>
</template>
<script>
export default {
  props: {
    title: String,
    back: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
