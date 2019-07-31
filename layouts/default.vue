<template>
  <div class="background-image font-content w-screen h-screen flex overflow-x-hidden">
    <div class="absolute right-0 top-0">
      <language-selector />
    </div>
    <main class="flex-grow text-gray-900 px-6">
      <nuxt />
    </main>
  </div>
</template>
<script>
import LanguageSelector from '../components/language-selector.vue'
export default {
  components: { LanguageSelector },
}
</script>

