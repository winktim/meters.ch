<template>
  <div class="mt-4 lg:mt-16 section">
    <section class="section">
      <img src="/images/naito-900.svg" :alt="$t('alt.naito_one_logo')" class="w-16 sm:mb-2 md:w-32" />
      <h1 class="font-heading text-2xl text-center" v-text="$t('pages.fresh.title')"></h1>
    </section>

    <form
      class="my-8 section w-full sm:w-100 bg-gray-100 rounded-md px-4 py-8 font-medium"
      action="#"
      @submit="reset"
    >
      <p class="text-center text-gray-800 mb-4" v-text="$t('pages.fresh.form.explain')"></p>
      <label class="w-full" for="password-input" v-text="$t('pages.login.form.password')"></label>
      <input
        :disabled="resetting"
        class="w-full px-4 py-2 mb-8 transparent-input"
        type="password"
        name="password-input"
        id="password-input"
        required
      />
      <label class="w-full" for="confirm-input" v-text="$t('pages.fresh.form.confirm')"></label>
      <input
        :disabled="resetting"
        class="w-full px-4 py-2 mb-8 transparent-input"
        type="password"
        name="confirm-input"
        id="confirm-input"
        required
      />
      <input
        :disabled="resetting"
        class="text-center action w-full bg-naito-green-200 text-gray-100"
        type="submit"
        :value="$t('pages.fresh.form.submit')"
      />
    </form>
  </div>
</template>
<script>
export default {
  middleware: ['has-verify-token', 'not-auth'],
  head() {
    return {
      title: `${this.$t('pages.fresh.title')} - Meters`,
      htmlAttrs: {
        lang: this.$store.state.locale,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.fresh.description'),
        },
      ],
    }
  },
  mounted() {
    this.verifyToken = this.$route.query.verify_token
  },
  data() {
    return {
      verifyToken: null,
      resetting: false,
    }
  },
  methods: {
    async reset(event) {
      event.preventDefault()

      this.resetting = true
      const password = event.target[0].value
      const password_confirmation = event.target[1].value

      // hide a potential message
      this.$store.dispatch('hideMessage')

      try {
        const res = await this.$post('/reset', {
          verify_token: this.verifyToken,
          password,
          password_confirmation,
        })

        const parsed = await res.json()

        if (!res.ok) {
          // focus password
          event.target[0].focus()

          if (parsed.errors) {
            // get and show the first error message
            const firstError = Object.values(parsed.errors)[0][0]
            this.$store.dispatch('showMessage', {
              message: firstError,
              isError: true,
            })
          } else {
            this.$store.dispatch('showMessage', {
              message: parsed.message,
              isError: true,
            })
            this.$router.push('/reset')
          }

          // stop here
          return
        }

        localStorage.setItem('hasConnected', true)
        this.$store.commit('SET_API_TOKEN', { apiToken: parsed.api_token })

        this.$router.push('/')
      } catch (e) {
        console.error('Error getting response', e)

        this.$store.dispatch('showMessage', {
          message: this.$t('error.unknown'),
          isError: true,
        })
      } finally {
        this.resetting = false
      }
    },
  },
}
</script>

