// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Github Profile Builder'
    }
  },
  components: {
    global: true,
    dirs: ['~/components']
  },
  css: [
    '~/assets/scss/app.scss'
  ],
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
