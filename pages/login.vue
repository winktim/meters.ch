<template>
  <div class="mt-4 lg:mt-16 section">
    <section class="section">
      <img src="/images/naito-900.svg" :alt="$t('alt.naito-one-logo')" class="w-32" />
      <h1 class="font-heading text-2xl text-center" v-text="$t('pages.login.title')"></h1>
    </section>

    <form
      class="my-8 section w-full sm:w-100 bg-gray-100 rounded-md px-4 py-8 font-medium"
      action="#"
      @submit="login"
    >
      <label class="w-full" for="email-input" v-text="$t('pages.login.form.email')"></label>
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
        <label class="flex-grow" for="password-input" v-text="$t('pages.login.form.password')"></label>
        <nuxt-link
          tabindex="1"
          :to="{ path: 'reset', query: { email: email }}"
          class="green-link text-right ml-4"
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
      loggingIn: false,
      showErrorMessage: false,
      errorMessage: 'error.unknown',
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

      // hide a potential error message
      this.showErrorMessage = false

      // TODO: remove fake delay
      // await new Promise(resolve => setTimeout(resolve, 3000))

      try {
        const res = await fetch(this.$store.state.api + '/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        const parsed = await res.json()
        console.log(parsed)

        // TODO: handle API errors
        if (!res.ok) {
          // focus email
          event.target[0].focus()
          // empty password
          event.target[1].value = ''

          if (parsed.errors) {
            // get and show the first error message
            const firstError = Object.values(parsed.errors)[0][0]
            if (firstError === 'These credentials do not match our records.') {
              this.errorMessage = 'error.credentials'
            }
          }

          this.showErrorMessage = true

          setTimeout(() => {
            this.showErrorMessage = false
            this.errorMessage = 'error.unknown'
          }, 7000)

          // stop here
          return
        }

        if (rememberMe) {
          this.$store.commit('SET_REMEMBER_ME', { rememberMe })
        }

        localStorage.setItem('hasConnected', true)
        this.$store.commit('SET_API_TOKEN', { apiToken: parsed.apiToken })

        this.$router.push('/')
      } catch (e) {
        console.error('Error getting response', e)

        this.showErrorMessage = true

        setTimeout(() => {
          this.showErrorMessage = false
          this.errorMessage = 'error.unknown'
        }, 10000)
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

