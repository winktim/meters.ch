<template>
  <div :class="backClasses" ref="back" @click="cancelOnBack">
    <div :class="parentClasses">
      <section
        class="w-full sm:w-120 bg-gray-100 rounded-md p-4 shadow-lg flex flex-col justify-between"
      >
        <div class="overflow-y-auto max-h-full">
          <h2
            class="text-center font-heading text-2xl my-3"
            v-text="$t('pages.objectives.modes.' + mode)"
          ></h2>
          <!-- resource -->
          <div>
            <h3 class="font-bold text-lg" v-text="$t('pages.objectives.form.resource')"></h3>
            <!-- TODO: implement abstract custom select with search -->
          </div>
          <div class="flex flex-col mb-12">
            <h3 class="font-bold text-lg" v-text="$t('pages.objectives.form.objective')"></h3>
            <!-- type -->
            <div>
              <input
                type="radio"
                id="type-weekly-input"
                value="weekly"
                name="type-input"
                v-model="type"
              />
              <label for="type-weekly-input" v-text="$t('pages.objectives.form.weekly')"></label>
            </div>

            <div>
              <input
                type="radio"
                id="type-monthly-input"
                value="monthly"
                name="type-input"
                v-model="type"
              />
              <label for="type-monthly-input" v-text="$t('pages.objectives.form.monthly')"></label>
            </div>

            <!-- value -->
            <div class="flex text-gray-700">
              <label class="w-1/2" v-text="compareString"></label>
              <span class="text-right flex-grow mx-2" v-text="compareValue"></span>
              <span v-text="symbol"></span>
            </div>
            <div class="flex">
              <label class="w-1/2" for="value-input" v-text="$t('pages.objectives.form.value')"></label>
              <input
                class="text-right flex-grow mx-2"
                type="number"
                min="0"
                name="value-input"
                id="value-input"
                v-model="value"
              />
              <span v-text="symbol"></span>
            </div>
          </div>
        </div>
        <!-- actions -->
        <div class="flex mb-3">
          <a
            class="flex-grow mr-3 action bg-gray-600 text-gray-100 text-center"
            href="#"
            @click="cancel"
            v-text="$t('global.cancel')"
          ></a>
          <a
            class="flex-grow ml-3 action bg-naito-green-200 text-gray-100 text-center"
            href="#"
            @click="confirm"
            v-text="$t('global.confirm')"
          ></a>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MessageBox',
  props: {
    show: Boolean,
    mode: String,
    current: Object,
  },
  watch: {
    show(show) {
      if (!show) {
        return
      }

      if (this.editMode) {
        // reset to the given current values
        this.type = this.current.type
        this.value = this.current.value
        this.resource_id = this.current.resource_id
      } else {
        // reset to the default values
        this.type = 'weekly'
        this.value = 0
        this.resource_id = -1
      }
    },
  },
  data() {
    return {
      type: 'weekly',
      value: 0,
      resource_id: -1,
    }
  },
  methods: {
    cancelOnBack(event) {
      if (event.target === this.$refs.back) {
        this.$emit('cancel')
      }
    },
    cancel(event) {
      event.preventDefault()
      this.$emit('cancel')
    },
    confirm(event) {
      event.preventDefault()

      const payload = {
        type: this.type,
        value: this.value,
        resource_id: this.resource_id,
      }

      if (this.editMode) {
        payload.id = this.current.id
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
      ]
    },
    resource() {
      return this.$store.getters.resource({ resource_id: this.resource_id })
    },
    symbol() {
      const resourceType = this.$store.getters.resourceType(this.resource)
      return resourceType ? resourceType.symbol : ''
    },
    editMode() {
      return this.mode === 'edit'
    },
    compareString() {
      return this.$t(`pages.objectives.form.${this.type}_compare`)
    },
    compareValue() {
      // TODO implement
      return 0
    },
  },
}
</script>
