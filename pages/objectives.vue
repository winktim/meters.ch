<template>
  <div>
    <app-header
      :title="$t('pages.objectives.title')"
      :description="$t('pages.objectives.description')"
      :back="true"
    ></app-header>

    <p class="font-medium text-center mb-6" v-text="$t('pages.objectives.info')"></p>

    <ul class="flex flex-col items-center">
      <li
        class="w-full lg:w-200 my-1 flex justify-between bg-gray-100 rounded-md hover:shadow-lg"
        v-for="(objective, i) in objectives"
        :key="i"
      >
        <button
          class="font-bold flex-grow py-4 pl-4 clickable focus:shadow-outline flex items-center"
          @click="update(objective.id)"
          :title="$t('pages.objectives.modes.edit')"
        >
          <span class="flex-grow" v-text="objective.value"></span>
          <i class="material-icons text-naito-blue-100 text-lg px-5">edit</i>
        </button>

        <button
          class="flex items-center text-naito-blue-100 text-lg py-4 px-5 clickable focus:shadow-outline"
          @click="del(objective.id)"
          :title="$t('pages.objectives.modes.delete')"
        >
          <i class="material-icons">delete</i>
        </button>
      </li>
    </ul>

    <div class="mt-4 mb-24 md:mt-8 flex justify-center">
      <button
        class="w-full lg:w-200 action bg-naito-blue-200 text-gray-100 text-center relative"
        @click="create"
      >
        <i class="material-icons absolute left-0 ml-4">add</i>
        <span v-text="$t('pages.objectives.modes.create')"></span>
      </button>
    </div>

    <objective-popup
      :show="show"
      :mode="mode"
      :current="id === -1 ? null : $store.state.dataById.objectives[id]"
      @cancel="popupCancel"
      @confirm="popupConfirm"
    ></objective-popup>
  </div>
</template>
<script>
import { formatResource } from '../assets/utils'
import { DateTime } from 'luxon'

import AppHeader from '../components/app-header'
import ObjectivePopup from '../components/objective-popp'

export default {
  middleware: 'needs-auth',
  head() {
    return {
      title: `${this.$t('pages.objectives.title')} - Meters`,
      htmlAttrs: {
        lang: this.$store.state.locale,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.objectives.description'),
        },
      ],
    }
  },
  components: { AppHeader, ObjectivePopup },
  async mounted() {
    await Promise.all([
      this.$getResources(),
      this.$getObjectives(),
      this.$getResourceTypes(),
      this.$getSensors(),
      this.$getSites(),
    ])
  },
  data() {
    return {
      mode: 'create',
      id: -1,
      show: false,
    }
  },
  methods: {
    create() {
      // make sure to hide any messages
      this.$store.dispatch('hideMessage')

      this.mode = 'create'
      this.show = true
      return
    },
    update(id) {
      // make sure to hide any messages
      this.$store.dispatch('hideMessage')

      this.mode = 'edit'
      this.id = id
      this.show = true
    },
    del(id) {
      // make sure to hide any messages
      this.$store.dispatch('hideMessage')

      this.$delObjective({ id })
    },
    popupCancel() {
      this.show = false
    },
    popupConfirm(payload) {
      this.show = false

      if (payload.id !== undefined) {
        // update existing
        this.$putObjective(payload)
      } else {
        // create new
        this.$postObjective(payload)
      }
    },
  },
  computed: {
    objectives() {
      return this.$store.getters.objectives.map(objective => {
        const out = {
          id: objective.id,
          value: '',
        }

        const resource = this.$store.getters.resource(objective)

        if (resource === null) {
          return out
        }

        const resourceType = this.$store.getters.resourceType(resource)

        if (resourceType === null) {
          return out
        }

        const formattedResource = formatResource(
          this.$i18n,
          resource,
          resourceType
        )
        const type = this.$t('features.objective_types.' + objective.type)

        out.value = `${formattedResource}, ${objective.value} ${resourceType.symbol}/${type}`

        return out
      })
    },
  },
}
</script>
