<template>
  <div>
    <div
      :class="['fixed', 'top-0', 'left-0', 'w-screen', 'h-screen', isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none']"
      @click="isMenuOpen = false"
    ></div>
    <app-header :title="$t('pages.index.title')" :back="false"></app-header>

    <section class="bg-gray-100 rounded-md p-4 flex items-center">
      <div class="relative">
        <a
          href="#"
          @click="toggleMenu"
          class="round-action material-icons bg-naito-blue-200 text-gray-100 mr-4"
        >menu</a>
        <app-menu v-if="isMenuOpen" class="absolute top-full w-60 mt-1"></app-menu>
      </div>
      <div>
        <p v-html="$t('pages.index.hello', { name:'Mouloude' })"></p>
        <p class="sm:hidden" v-html="$t('pages.index.summary-small', { sensors: 12, sites: 3 })"></p>
        <p class="hidden sm:block" v-html="$t('pages.index.summary', { sensors: 12, sites: 3 })"></p>
      </div>
    </section>
  </div>
</template>
<script>
import AppHeader from '../components/app-header.vue'
import AppMenu from '../components/app-menu.vue'

export default {
  components: { AppHeader, AppMenu },
  beforeMount() {
    if (this.$store.state.apiToken === null) {
      this.$router.replace('/login')
    }
  },
  data() {
    return {
      isMenuOpen: false,
    }
  },
  methods: {
    toggleMenu(event) {
      event.preventDefault()
      this.isMenuOpen = !this.isMenuOpen
    },
  },
}
</script>
