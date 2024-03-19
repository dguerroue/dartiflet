<template>
    <div class="flex h-full flex-col justify-between py-5">
        <div>
            <div class="mb-4 dark:text-white">
                <h1 class="text-2xl font-bold">
                    Dartiflet
                </h1>
            </div>
            <PlayerListView />
            <PlayerAddForm />
        </div>

        <div class="flex flex-col gap-4">
            <div v-if="gameStore.game?.isStarted" class="rounded border-2 border-dashed px-6 py-3 text-sm dark:border-white dark:text-white">
                <span class="flex items-center justify-between">Reprendre la partie en cours <i>></i></span>
            </div>

            <button :disabled="noPlayers" class="inline-block w-full rounded border border-green-600 bg-green-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500 disabled:pointer-events-none disabled:border-gray-500 disabled:bg-gray-500" @click="onStartGame()">
                Demarrer une nouvelle partie
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'default'
});

const playerStore = usePlayerStore();
const gameStore = useGameStore();

const noPlayers = computed(() => playerStore.players.length === 0);

function onStartGame() {
   
    if(playerStore.players.length) {
        gameStore.newGame(playerStore.players);
        navigateTo('game')
    }
}
</script>

<style lang="scss" scoped></style>