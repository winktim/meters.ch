<template>
  <div ref="focusRoot" class="relative z-10" @mousedown="show">
    <div class="w-full flex items-center text-gray-900 relative wrapped-transparent-input">
      <label :for="inputName" class="material-icons py-2 pl-2 clickable">search</label>
      <input
        @focus="show"
        @keydown="checkForTab"
        :placeholder="placeholder"
        class="flex-grow px-4 py-2"
        v-model="searchString"
        type="text"
        :name="inputName"
        :id="inputName"
      />
      <i
        class="material-icons py-2 pr-2 clickable text-gray-800"
        v-if="searchString !== ''"
        @click="clear"
      >backspace</i>
      <div class="wrapped-style w-full h-full pointer-events-none absolute"></div>
    </div>
    <ul :class="optionsClasses">
      <!-- TODO: make it radio buttons ! -->
      <li class="flex-grow flex" v-for="option in filteredOptions" :key="option.id">
        <!-- TODO: use shadow-outline, but croped by overflow-y-auto -->
        <button
          :tabindex="showOptions ? 0 : -1"
          class="p-4 w-full hover:bg-gray-100"
          @click="clickedOption(option)"
          @keydown="checkForTab"
          v-text="option.value"
        ></button>
      </li>
      <li
        class="flex-grow p-4"
        v-if="filteredOptions.length === 0"
        v-text="$t('global.no_results')"
      ></li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'SearchSelect',
  props: {
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      searchString: '',
      showOptions: false,
      currentValue: -1,
      supposedSearchString: '',
    }
  },
  watch: {
    value(to) {
      // update from an external change
      // ignore changes that ripple from the emitted input event

      if (to === this.currentValue) {
        return
      }

      const option = this.getOptionById(to)

      this.searchString = option ? option.value : ''
      this.supposedSearchString = this.searchString
      this.showOptions = false
      this.currentValue = to
    },
  },
  mounted() {
    document.onmousedown = () => {
      this.showOptions = false
      // reset the content of the field when left half-typed
      this.searchString = this.supposedSearchString
    }
  },
  beforeDestroy() {
    document.onmousedown = null
  },
  methods: {
    /**
     * @param {number} id
     * @returns {{id: number, value: string}}
     */
    getOptionById(id) {
      for (const option of this.options) {
        if (option.id === id) {
          return option
        }
      }

      return null
    },
    show(event) {
      // trick to hide when the document recieves a mousedown event
      event.stopPropagation()
      this.showOptions = true
    },
    checkForTab(event) {
      if (event.keyCode === 9) {
        // wait for the focus to change and check if it is in the root
        setTimeout(() => {
          if (!this.$refs.focusRoot.contains(document.activeElement)) {
            this.showOptions = false
            // reset the content of the field when left half-typed
            this.searchString = this.supposedSearchString
          }
        }, 0)
      }
    },
    clear() {
      this.searchString = ''
      this.supposedSearchString = this.searchString
      this.currentValue = -1
      this.$emit('input', -1)
    },
    clickedOption(option) {
      this.searchString = option.value
      this.supposedSearchString = this.searchString
      this.showOptions = false
      this.currentValue = option.id

      this.$emit('input', option.id)
    },
  },
  computed: {
    inputName() {
      return 'search-select-' + this.name
    },
    filteredOptions() {
      return this.searchString === ''
        ? this.options.sort((a, b) => a.value.localeCompare(b.value))
        : this.options
            .filter(
              option =>
                option.value.search(new RegExp(this.searchString, 'gi')) !== -1
            )
            .sort((a, b) => a.value.localeCompare(b.value))
    },
    optionsClasses() {
      return [
        'absolute',
        'bg-gray-200',
        'rounded-b-md',
        'shadow-md',
        'w-full',
        'transition-opacity-100',
        'max-h-32',
        'lg:max-h-64',
        'overflow-y-auto',
        'flex',
        'flex-col',
      ].concat(
        this.showOptions
          ? ['opacity-1', 'pointer-events-auto']
          : ['opacity-0', 'pointer-events-none']
      )
    },
  },
}
</script>
