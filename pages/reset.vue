<template>
  <div class="mt-4 lg:mt-16 section">
    <section class="section">
      <img src="/images/naito-900.svg" :alt="$t('alt.naito-one-logo')" class="w-32" />
      <h1 class="font-heading text-2xl text-center" v-text="$t('pages.reset.title')"></h1>
    </section>

    <form
      class="my-8 section w-full sm:w-100 bg-gray-100 rounded-md px-4 py-8 font-medium"
      action="#"
      @submit="reset"
    >
      <p class="text-center text-gray-800 mb-4" v-text="$t('pages.reset.form.explain')"></p>
      <label class="w-full" for="email-input" v-text="$t('pages.login.form.email')"></label>
      <input
        :disabled="hasReset"
        :value="$route.query.email"
        class="w-full px-4 py-2 mb-8 transparent-input"
        type="email"
        name="email-input"
        id="email-input"
        required
      />
      <input
        :disabled="hasReset"
        class="action w-full bg-naito-green-200 text-gray-100"
        type="submit"
        :value="$t('pages.reset.form.submit')"
      />
    </form>

    <!-- error message -->
    <div
      class="fixed top-0 mt-16 w-5/6 md:w-auto mx-auto bg-red-600 text-gray-100 p-4 rounded-md shadow flex"
      v-if="showErrorMessage"
    >
      <span class="text-center w-full" v-text="$t(errorMessage)"></span>
    </div>
  </div>
</template>
<script>
export default {
  beforeMount() {
    if (this.$store.state.apiToken !== null) {
      this.$router.replace('/')
    }
  },
  data() {
    return {
      hasReset: false,
      showErrorMessage: false,
      errorMessage: 'error.unknown',
    }
  },
  methods: {
    async reset(event) {
      event.preventDefault()

      this.hasReset = true
      const email = event.target[0].value

      // hide a potential error message
      this.showErrorMessage = false

      // TODO: implement server-side
      try {
        /*
        const res = await fetch(this.$store.state.api + '/reset', {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })
        */
      } catch (e) {
        console.error('Error getting response', e)
      }

      this.$router.push('/login')
    },
  },
}
</script>

