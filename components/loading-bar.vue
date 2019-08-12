<template>
  <div :class="classes"></div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    classes() {
      return [
        'fixed',
        'top-0',
        'left-0',
        'w-screen',
        'h-2',
        'bg-naito-blue-100',
        'pointer-events-none',
        'transition-opacity-300',
      ].concat(
        this.show ? ['opacity-1', 'loading-bar-animation'] : ['opacity-0']
      )
    },
  },
}
</script>

