<template>
  <div :class="backClasses" ref="back" @click="cancelOnBack">
    <div :class="parentClasses">
      <section :class="sectionClasses">
        <div ref="scrollZone" class="overflow-y-auto max-h-full px-4 sm:px-6">
          <h2
            class="text-center font-heading text-2xl my-3"
            v-text="$t('pages.explore.download.title')"
          ></h2>
          <div class="flex flex-col mb-12">
            <h3 class="font-bold text-lg mb-2" v-text="$t('pages.explore.download.format')"></h3>

            <!-- CSV -->
            <div class="flex items-center">
              <label class="material-radio text-naito-green-200" for="format-csv-input">
                <input
                  type="radio"
                  id="format-csv-input"
                  value="csv"
                  name="format-input"
                  v-model="format"
                />
                <div class="material-radio-fake"></div>
              </label>
              <label class="flex-grow select-none" for="format-csv-input">CSV</label>
            </div>

            <!-- JSON -->
            <div class="flex items-center">
              <label class="material-radio text-naito-green-200" for="format-json-input">
                <input
                  type="radio"
                  id="format-json-input"
                  value="json"
                  name="format-input"
                  v-model="format"
                />
                <div class="material-radio-fake"></div>
              </label>
              <label class="flex-grow select-none" for="format-json-input">JSON</label>
            </div>
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
            v-text="$t('pages.explore.download.confirm')"
          ></button>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import { scrollToTop } from '../assets/utils'
export default {
  name: 'DownloadPopup',
  props: {
    show: Boolean,
  },
  data() {
    return {
      format: 'csv',
    }
  },
  watch: {
    show(show) {
      if (!show) {
        return
      }

      scrollToTop(this.$refs.scrollZone)

      this.format = 'csv'
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
        format: this.format,
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
