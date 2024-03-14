export default defineNuxtRouteMiddleware((_to, _from) => {
    const gameStore = useGameStore();

    if(gameStore.game == null) {
        return navigateTo('/')
    }
})