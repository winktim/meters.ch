<template>
  <div>
    <!-- static to avoid purgecss issues -->
    <link rel="stylesheet" href="leaflet.css" />
    <app-header
      :title="$t('pages.map.title')"
      :description="$t('pages.map.description')"
      :back="true"
    ></app-header>
    <div ref="map" class="w-full h-screen-36"></div>
    <map-popup ref="mapPopup" :resource="activeResource"></map-popup>

    <section
      class="absolute bottom-0 inset-x-0 w-full p-4 md:px-1/5 lg:px-1/4 xl:px-1/3 bg-naito-green-200 shadow-lg-top z-above-map"
    >
      <search-select
        name="resource"
        :placeholder="$t('pages.objectives.form.find_resource')"
        :options="formattedResources"
        :top="true"
        :single="true"
        v-model="currentSearch"
      ></search-select>
    </section>
  </div>
</template>
<script>
import AppHeader from '../components/app-header.vue'
import MapPopup from '../components/map-popup.vue'
import SearchSelect from '../components/search-select.vue'

import * as L from 'leaflet'
// https://vue2-leaflet.netlify.app/quickstart/#marker-icons-are-missing
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

import Vue from 'vue'
import {
  handleNavigationError,
  removeTrailingSlash,
  clamp,
  formatResource,
} from '../assets/utils'

export default {
  middleware: 'needs-auth',
  head() {
    return {
      title: `${this.$t('pages.map.title')} - Meters`,
      htmlAttrs: {
        lang: this.$store.state.locale,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.map.description'),
        },
      ],
    }
  },
  components: { AppHeader, MapPopup, SearchSelect },
  data() {
    return {
      map: null,
      markers: [],
      activeResource: null,
      currentX: 46.8246,
      currentY: 8.2245,
      currentZ: 9,
      minZ: 9,
      maxZ: 19,
      minX: 45.8126,
      maxX: 47.8092,
      minY: 5.9445,
      maxY: 10.5079,
      currentSearch: -1,
      hadQuery: false,
    }
  },
  async mounted() {
    this.getQuery()
    // update parsed query
    this.setQuery()

    this.map = L.map(this.$refs.map, {
      zoomControl: false,
      center: [this.currentX, this.currentY],
      zoom: this.currentZ,
      maxBounds: [
        [this.minX, this.minY],
        [this.maxX, this.maxY],
      ],
      maxBoundsViscosity: 1,
      minZoom: this.minZ,
      maxZoom: this.maxZ,
    })

    L.tileLayer('	https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Base map and data from OpenStreetMap and OpenStreetMap Foundation <a ref="noreferer" target="_blank" href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap contributors</a>',
      maxZoom: this.maxZ,
      tileSize: 256,
    }).addTo(this.map)

    this.map.on('zoomend', () => {
      this.currentZ = this.map.getZoom()
      this.setQuery()
    })
    this.map.on('moveend', () => {
      const center = this.map.getCenter()
      this.currentX = +center.lat.toFixed(4)
      this.currentY = +center.lng.toFixed(4)
      this.setQuery()
    })

    await Promise.all([
      this.$getResources(),
      this.$getResourceTypes(),
      this.$getSensors(),
      this.$getSites(),
      this.$getUsers(),
    ])

    // generate a marker for each resource
    for (const resource of this.resources) {
      const position = [resource.lat, resource.lon]

      this.markers.push(
        L.marker(position)
          .on('click', (event) => {
            this.activeResource = resource
            this.$nextTick(() => {
              const content = this.$refs.mapPopup.$el.firstElementChild.cloneNode(
                true
              )
              content.querySelector('.open-chart').onclick = () => {
                this.$router
                  .push({
                    name: 'explore',
                    query: { resources: resource.id },
                  })
                  .catch(handleNavigationError)
              }

              L.popup({ offset: [0, -35] })
                .setLatLng(position)
                .setContent(content)
                .openOn(this.map)
            })
          })
          .addTo(this.map)
      )
    }

    if (this.markers.length > 0 && !this.hadQuery) {
      // fit view to all markers
      const group = L.featureGroup(this.markers)
      this.map.fitBounds(group.getBounds().pad(0.1))
    }
  },
  methods: {
    setQuery() {
      const route = {
        path: removeTrailingSlash(this.$route.path),
        query: {
          x: this.currentX,
          y: this.currentY,
          z: this.currentZ,
        },
      }

      // small optimization to avoid replacing a route with itself
      if (JSON.stringify(route.query) === JSON.stringify(this.$route.query)) {
        return
      }

      this.$router.replace(route).catch(handleNavigationError)
    },
    getQuery() {
      const query = this.$route.query

      const x = parseFloat(query.x)
      if (!isNaN(x)) {
        this.currentX = +clamp(x, this.minX, this.maxX).toFixed(4)
        this.hadQuery = true
      }
      const y = parseFloat(query.y)
      if (!isNaN(y)) {
        this.currentY = +clamp(y, this.minY, this.maxY).toFixed(4)
        this.hadQuery = true
      }
      const z = parseInt(query.z)
      if (!isNaN(z)) {
        this.currentZ = clamp(z, this.minZ, this.maxZ)
        this.hadQuery = true
      }
    },
  },
  watch: {
    currentSearch(to) {
      if (to === -1) {
        return
      }

      const resource = this.$store.getters.resource({ resource_id: to })
      this.map.setView([resource.lat, resource.lon], this.maxZ)

      this.$nextTick(() => {
        this.currentSearch = -1
      })
    },
  },
  computed: {
    resources() {
      return this.$store.getters.resources.filter(
        (resource) => resource.lat && resource.lon
      )
    },
    formattedResources() {
      return this.resources.map((resource) => {
        const resourceType = this.$store.getters.resourceType(resource)
        const sensor = this.$store.getters.sensor(resource)
        const site = this.$store.getters.site(sensor)
        return {
          id: resource.id,
          value: formatResource(this.$i18n, resource, resourceType, site),
        }
      })
    },
  },
}
</script>
