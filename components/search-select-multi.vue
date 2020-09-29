<template>
  <div ref="focusRoot" class="relative z-10" @mousedown="keepShown">
    <div
      :class="
        `w-full flex items-center text-gray-900 relative wrapped${
          single ? '-single' : ''
        }-transparent-input`
      "
    >
      <label :for="inputName" class="material-icons py-2 pl-2 clickable"
        >search</label
      >
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
        >backspace</i
      >
      <div
        class="wrapped-style top-0 left-0 w-full h-full pointer-events-none absolute"
      ></div>
    </div>
    <div :class="optionsClasses">
      <!-- scroll div https://stackoverflow.com/questions/34249501/flexbox-column-reverse-in-firefox-edge-and-ie -->
      <div ref="scrollDiv" class="max-h-32 lg:max-h-64 overflow-y-auto">
        <ul :class="optionsUlClasses">
          <li
            class="flex-grow flex"
            v-for="option in filteredOptions"
            :key="option.id"
          >
            <!-- TODO: use shadow-outline, but croped by overflow-y-auto -->
            <button
              :tabindex="showOptions ? 0 : -1"
              class="p-4 w-full hover:bg-gray-100 flex items-center"
              @click="clickedOption(option)"
              @keydown="checkForTab"
            >
              <i
                class="material-icons select-none text-xl mr-2 text-naito-green-200"
                v-text="
                  checked.includes(option.id)
                    ? 'check_box'
                    : 'check_box_outline_blank'
                "
              ></i>
              <span v-text="option.value"></span>
            </button>
          </li>
          <li
            class="flex-grow p-4"
            v-if="!hasFilteredOptions"
            v-text="$t('global.no_results')"
          ></li>
        </ul>
      </div>
      <!-- actions -->
      <div :class="actionsClasses">
        <button
          :tabindex="showOptions ? 0 : -1"
          v-if="hasFilteredOptions"
          @click="toggleSelection"
          :class="toggleClasses"
        >
          <i
            class="material-icons text-xl mr-4"
            v-text="
              anySelected ? 'remove_circle_outline' : 'check_circle_outline'
            "
          ></i>
          <span class="mr-2" v-text="selectAllNoneString"></span>
        </button>
        <button
          :tabindex="showOptions ? 0 : -1"
          @keydown="checkForTab"
          @click="showOptions = false"
          :title="$t('global.selector_close')"
          class="clickable material-icons focus:shadow-outline hover:lighten-10 active:darken-10 p-4 text-xl ml-auto"
        >
          close
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { scrollToBottom } from '../assets/utils'
export default {
  name: 'SearchSelectMulti',
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
      type: Array,
      default: () => [],
    },
    top: {
      type: Boolean,
      default: false,
    },
    single: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchString: '',
      showOptions: false,
      checked: [],
      mousedownListener: null,
    }
  },
  watch: {
    options(to, from) {
      // don't reset if we get options from the first time
      // it would reset the default value which is set before we recieve the options
      if (from.length === 0) {
        return
      }

      const allOptions = to.map(option => option.id)

      // filter out any currently checked option that doesn't exist in the new options
      this.checked = this.checked.filter(option => {
        return allOptions.includes(option)
      })

      this.$emit('input', this.checked)
    },
    value(to) {
      // update from an external change
      // ignore changes that ripple from the emitted input event

      if (JSON.stringify(to) === JSON.stringify(this.checked)) {
        return
      }

      this.showOptions = false
      this.checked = to
    },
  },
  mounted() {
    this.mousedownListener = () => {
      this.showOptions = false
    }
    document.addEventListener('mousedown', this.mousedownListener, {
      passive: true,
    })
  },
  beforeDestroy() {
    if (this.mousedownListener) {
      document.removeEventListener('mousedown', this.mousedownListener)
    }
  },
  methods: {
    keepShown(event) {
      if (this.showOptions) {
        // simply prevent document from recieving the mouse event and closing the options list
        event.stopPropagation()
      }
    },
    show(event) {
      if (!this.showOptions) {
        this.showOptions = true
        if (this.top) {
          scrollToBottom(this.$refs.scrollDiv)
        }
      }
    },
    checkForTab(event) {
      if (event.keyCode === 9) {
        // wait for the focus to change and check if it is in the root
        // TODO: Vue.nextTick https://vuejs.org/v2/api/#Vue-nextTick
        setTimeout(() => {
          if (!this.$refs.focusRoot.contains(document.activeElement)) {
            this.showOptions = false
          }
        }, 0)
      }
    },
    clear() {
      this.searchString = ''
      // refocus input
      this.$refs.focusRoot.getElementsByTagName('input')[0].focus()
    },
    clickedOption(option) {
      const alreadyIn = this.checked.indexOf(option.id)
      if (alreadyIn !== -1) {
        this.checked.splice(alreadyIn, 1)
      } else {
        this.checked.push(option.id)
      }

      this.$emit('input', this.checked)
    },
    toggleSelection() {
      if (this.anySelected) {
        this.selectNone()
      } else {
        this.selectAll()
      }
    },
    selectAll() {
      for (const option of this.filteredOptions) {
        const alreadyIn = this.checked.indexOf(option.id)
        if (alreadyIn === -1) {
          this.checked.push(option.id)
        }
      }
      this.$emit('input', this.checked)
    },
    selectNone() {
      for (const option of this.filteredOptions) {
        const alreadyIn = this.checked.indexOf(option.id)
        if (alreadyIn !== -1) {
          this.checked.splice(alreadyIn, 1)
        }
      }
      this.$emit('input', this.checked)
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
    anySelected() {
      for (const option of this.filteredOptions) {
        if (this.checked.includes(option.id)) {
          return true
        }
      }

      return false
    },
    optionsClasses() {
      return [
        'absolute',
        'bg-gray-200',
        'shadow-md',
        'w-full',
        'transition-opacity-100',
        'flex',
      ]
        .concat(
          this.showOptions
            ? ['opacity-1', 'pointer-events-auto']
            : ['opacity-0', 'pointer-events-none']
        )
        .concat(
          this.top
            ? ['flex-col-reverse', 'bottom-full', 'rounded-t-md']
            : ['flex-col', 'rounded-b-md']
        )
    },
    optionsUlClasses() {
      return ['flex'].concat(this.top ? ['flex-col-reverse'] : ['flex-col'])
    },
    actionsClasses() {
      return ['flex-grow', 'border-gray-300', 'flex'].concat(
        this.top ? ['border-b-2'] : ['border-t-2']
      )
    },
    toggleClasses() {
      return ['outline-action'].concat(
        this.anySelected ? ['text-gray-600'] : ['text-naito-green-200']
      )
    },
    hasFilteredOptions() {
      return this.filteredOptions.length > 0
    },
    selectAllNoneString() {
      return this.$t(
        `global.select_${this.anySelected ? 'none' : 'all'}${
          this.searchString !== '' ? '_results' : ''
        }`
      )
    },
  },
}
</script>
