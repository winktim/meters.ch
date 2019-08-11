<template>
  <div class="fixed top-0 mt-16 flex justify-center w-full">
    <div :class="classes" v-if="show">
      <span class="text-center w-full" v-text="lastMessage"></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MessageBox',
  computed: {
    classes() {
      return [
        'w-5/6',
        'md:w-auto',
        this.isError ? 'bg-red-600' : 'bg-green-600',
        'text-gray-100',
        'p-4',
        'rounded-md',
        'shadow',
        'flex',
      ]
    },
    /**
     * @returns {boolean}
     */
    show() {
      return this.$store.state.messageBox.show
    },
    /**
     * @returns {string}
     */
    lastMessage() {
      return this.$store.state.messageBox.lastMessage
    },
    /**
     * @returns {boolean}
     */
    isError() {
      return this.$store.state.messageBox.isError
    },
  },
}
</script>
