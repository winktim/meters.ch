<template>
  <div class="mt-4 lg:mt-16 section">
    <section class="section">
      <img src="/images/naito-900.svg" :alt="$t('alt.naito-one-logo')" class="w-16 sm:mb-2 md:w-32" />
      <h1 class="font-heading text-2xl text-center" v-text="$t('pages.login.title')"></h1>
    </section>

    <form
      class="my-8 section w-full sm:w-100 bg-gray-100 rounded-md px-4 py-8 font-medium"
      action="#"
      @submit="login"
    >
      <label class="w-full" for="email-input" v-text="$t('global.email')"></label>
      <input
        :disabled="loggingIn"
        v-model="email"
        class="w-full px-4 py-2 transparent-input"
        type="email"
        name="email-input"
        id="email-input"
        required
      />

      <div class="w-full pt-4 flex justify-between">
        <label
          class="flex-grow flex items-center"
          for="password-input"
          v-text="$t('pages.login.form.password')"
        ></label>
        <nuxt-link
          tabindex="1"
          :to="{ path: 'reset', query: { email: email }}"
          class="green-link text-right ml-4 p-4 md:p-0"
          v-text="$t('pages.login.form.forgotten-password')"
        ></nuxt-link>
      </div>
      <input
        :disabled="loggingIn"
        class="w-full px-4 py-2 transparent-input"
        type="password"
        name="password-input"
        id="password-input"
        required
      />

      <div class="w-full py-2 flex justify-end items-center">
        <label
          class="select-none"
          for="remember-me-input"
          v-text="$t('pages.login.form.remember-me')"
        ></label>
        <label class="material-checkbox text-naito-green-200" for="remember-me-input">
          <input
            :disabled="loggingIn"
            type="checkbox"
            name="remember-me-input"
            id="remember-me-input"
          />
          <div class="material-checkbox-fake"></div>
        </label>
      </div>
      <input
        :disabled="loggingIn"
        :class="['action', loggingIn ? 'action__processing' : '', 'w-full', 'bg-naito-green-200', 'text-gray-100']"
        type="submit"
        :value="$t('pages.login.form.submit')"
      />
    </form>

    <a
      v-if="!isProbablyClient"
      class="my-8 w-full sm:w-120 action bg-naito-blue-200 text-gray-100 text-center"
      href="https://naito.one/meters"
      v-text="$t('pages.login.new-client')"
    ></a>
  </div>
</template>
<script>
export default {
  middleware: 'not-auth',
  head() {
    return {
      title: `${this.$t('pages.login.title')} - Meters`,
      htmlAttrs: {
        lang: this.$store.state.locale,
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.login.description'),
        },
      ],
    }
  },
  data() {
    return {
      loggingIn: false,
      email: '',
    }
  },
  methods: {
    async login(event) {
      event.preventDefault()

      this.loggingIn = true
      const email = event.target[0].value
      const password = event.target[1].value
      const rememberMe = event.target[2].checked

      // hide a potential message
      this.$store.dispatch('hideMessage')

      try {
        const res = await this.$post('/login', {
          email,
          password,
        })

        const parsed = await res.json()

        // TODO: handle API errors
        if (!res.ok) {
          // focus email
          event.target[0].focus()
          // empty password
          event.target[1].value = ''

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
          }

          // stop here
          return
        }

        if (rememberMe) {
          this.$store.commit('SET_REMEMBER_ME', { rememberMe })
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
        this.loggingIn = false
      }
    },
  },
  computed: {
    /**
     * @returns {boolean}
     */
    isProbablyClient() {
      return this.$store.state.isProbablyClient
    },
  },
}
</script>

