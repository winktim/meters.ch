<template>
  <div class="relative transparent-select">
    <select
      :aria-label="$t(label)"
      :title="$t(label)"
      name="language-select"
      id="language-select"
      class="px-2 w-15 h-15 font-heading text-sm"
      @change="$emit('change', { locale: $event.target.value })"
      :value="locale"
    >
      <option v-for="(locale, i) in locales" :key="i" :value="locale" v-text="locale.toUpperCase()"></option>
    </select>
  </div>
</template>
<script>
export default {
  props: {
    locales: {
      type: Array,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
}
</script>

