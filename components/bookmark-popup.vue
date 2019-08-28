<template>
  <div :class="backClasses" ref="back" @click="cancelOnBack">
    <div :class="parentClasses">
      <section :class="sectionClasses">
        <div ref="scrollZone" class="overflow-y-auto max-h-full px-4 sm:px-6">
          <h2
            class="text-center font-heading text-2xl my-3"
            v-text="$t('pages.explore.bookmark.title')"
          ></h2>
          <p class="mb-2" v-text="$t('pages.explore.bookmark.explain')"></p>
          <!-- name -->
          <div class="flex flex-col mb-8">
            <h3 class="font-bold text-lg mb-2" v-text="$t('pages.explore.bookmark.name')"></h3>
            <input
              class="flex-grow mx-2 py-2 transparent-input"
              type="text"
              :placeholder="defaultChartName"
              name="name-input"
              id="name-input"
              v-model="name"
            />
          </div>

          <!-- period -->
          <div class="flex flex-col mb-12 text-center">
            <span v-text="$t('pages.explore.bookmark.relative_period')"></span>
            <span class="mt-2 font-bold" v-text="periodOffsetString"></span>
          </div>
        </div>

        <!-- actions -->
        <div class="flex mb-3">
          <button
            class="flex-grow mr-3 action bg-gray-600 text-gray-100 text-center"
            @click="cancel"
            v-text="$t('global.cancel')"
          ></button>
          <button
            class="flex-grow ml-3 action bg-naito-green-200 text-gray-100 text-center"
            @click="confirm"
            v-text="$t('pages.explore.bookmark.confirm')"
          ></button>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import { scrollToTop } from '../assets/utils'
export default {
  name: 'BookmarkPopup',
  props: {
    show: Boolean,
    periodOffsetString: String,
    defaultChartName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      name: '',
    }
  },
  watch: {
    show(show) {
      if (!show) {
        return
      }

      scrollToTop(this.$refs.scrollZone)

      this.name = ''
    },
  },
  methods: {
    cancelOnBack(event) {
      if (event.target === this.$refs.back) {
        this.$emit('cancel')
      }
    },
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      const payload = {
        name: this.name,
      }

      this.$emit('confirm', payload)
    },
  },
  computed: {
    backClasses() {
      return [
        'fixed',
        'top-0',
        'left-0',
        'right-0',
        'w-screen',
        'h-screen',
        'bg-gray-darken',
        'transition-opacity-100',
      ].concat(
        this.show
          ? ['pointer-events-auto', 'opacity-1']
          : ['pointer-events-none', 'opacity-0']
      )
    },
    parentClasses() {
      return [
        'fixed',
        'top-0',
        'left-0',
        'right-0',
        'flex',
        'justify-center',
        'p-4',
        'md:pt-16',
        'h-auto',
        'max-h-screen',
        'pointer-events-none',
      ]
    },
    sectionClasses() {
      return [
        'w-full',
        'sm:w-120',
        'bg-gray-100',
        'rounded-md',
        'p-4',
        'shadow-lg',
        'flex',
        'flex-col',
        'justify-between',
      ].concat(this.show ? ['pointer-events-auto'] : [])
    },
  },
}
</script>
