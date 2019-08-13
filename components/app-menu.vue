<template>
  <nav class="bg-naito-blue-200 text-gray-100 rounded-md shadow-lg overflow-hidden">
    <ul class="w-full h-full">
      <li v-for="(element, i) in elements" :key="i">
        <nuxt-link
          class="w-full px-5 py-3 hover:bg-naito-blue-100 flex items-center outline-none"
          :to="element.href"
        >
          <i class="material-icons select-none mr-3" v-text="element.icon"></i>
          <span v-text="$t(element.label)"></span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  data() {
    return {
      elements: [
        { icon: 'person', label: 'menu.infos', href: '/infos' },
        { icon: 'show_chart', label: 'menu.explore', href: '/explore' },
        {
          icon: 'track_changes',
          label: 'menu.objectives',
          href: '/objectives',
        },
        { icon: 'warning', label: 'menu.alerts', href: '/alerts' },
      ],
    }
  },
}
</script>
