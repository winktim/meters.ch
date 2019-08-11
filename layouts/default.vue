<template>
  <div class="background-image font-content w-screen h-screen flex overflow-x-hidden">
    <div class="absolute right-0 top-0">
      <language-selector />
    </div>
    <main class="flex-grow text-gray-900 px-6">
      <nuxt />
    </main>
    <message-box></message-box>
  </div>
</template>
<script>
import MessageBox from '../components/message-box'
import LanguageSelector from '../components/language-selector.vue'
export default {
  components: { LanguageSelector, MessageBox },
}
</script>

