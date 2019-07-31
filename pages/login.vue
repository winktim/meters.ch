<template>
  <div class="mt-4 section">
    <section class="section">
      <img src="/images/naito-900.svg" :alt="$t('alt.naito-one-logo')" class="w-32" />
      <h1 class="font-heading text-2xl text-center" v-text="$t('pages.login.title')"></h1>
    </section>

    <form
      class="my-8 section w-full bg-gray-100 rounded-md px-4 py-8 font-medium"
      action="#"
      @submit="login"
    >
      <label class="w-full" for="email-input" v-text="$t('pages.login.form.email')"></label>
      <input
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
          to="/reset"
          class="green-link text-right pl-4"
          v-text="$t('pages.login.form.forgotten-password')"
        ></nuxt-link>
      </div>
      <input
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
          <input type="checkbox" name="remember-me-input" id="remember-me-input" />
          <div class="material-checkbox-fake"></div>
        </label>
      </div>
      <input
        class="action w-full bg-naito-green-200 text-gray-100"
        type="submit"
        :value="$t('pages.login.form.submit')"
      />
    </form>

    <a
      class="my-8 w-full action bg-naito-blue-200 text-gray-100 text-center"
      href="https://naito.one/meters"
      v-text="$t('pages.login.new-client')"
    ></a>
  </div>
</template>
<script>
export default {
  methods: {
    async login(event) {
      event.preventDefault()
      const email = event.target[0].value
      const password = event.target[1].value
      const rememberMe = event.target[2].checked

      /*
      const res = await fetch(this.$store.state.api + '/login', {
        method: 'POST',
        body: {
          email,
          password,
        },
      })
      const parsed = await res.json()
      console.log(parsed)
      */

      console.log(email, password, rememberMe)
      return false
    },
  },
}
</script>

