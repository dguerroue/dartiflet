// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },
    ssr: false,
    modules: [
        ['@vite-pwa/nuxt', {
            manifest: {
                name: "Dartiflet",
                short_name: "Dartiflet",
                description: "Dart counter app",
                theme_color: "#4f46e5",
                icons: [
                    {
                        src: "icons/pwa-64x64.png",
                        sizes: "64x64",
                        type: "image/png",
                    },
                    {
                        src: "icons/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "icons/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            devOptions: {
                enabled: true,
                type: "module",
            },
        }],
        '@nuxtjs/tailwindcss',
        '@nuxtjs/eslint-module',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt'
    ],
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
    }
})


// export default defineNuxtConfig({
//     modules: ["@vite-pwa/nuxt"],
//     pwa: {

//         workbox: {
//             navigateFallback: "/",
//         },
//         devOptions: {
//             enabled: true,
//             type: "module",
//         },
//     },
// });