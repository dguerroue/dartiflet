// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/eslint-module',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt'
    ],
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
    }
})
