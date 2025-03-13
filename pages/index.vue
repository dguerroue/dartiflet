<template>
    <div class="flex h-full flex-col justify-between py-5">
        <div>
            <div class="mb-4 flex items-center justify-between text-white">
                <h1 class="text-2xl font-bold">
                    Dartiflet
                </h1>

                <div>
                    <NuxtLink to="/history">
                        <ButtonIcon size="32">
                            <template #icon>
                                <div class="text-white">
                                    <IconHistory />
                                </div>
                            </template>
                        </ButtonIcon>
                    </NuxtLink>
                </div>
            </div>
            <PlayerListView />
            <PlayerAddForm />
        </div>

        <div class="flex flex-col gap-4">
            <button v-if="gameStore.game?.isStarted" class="mb-6 rounded-lg border-2 border-white bg-white p-3 text-sm hover:bg-transparent hover:text-white active:bg-transparent active:text-white" @click="gameStore.resumeGame()">
                <span class="flex items-center justify-between">
                    Reprendre la partie en cours <IconChevronRight size="20" />
                </span>
            </button>

            <!-- GAME SELECTOR -->
            <div>
                <label for="game-mode" class="block text-sm font-medium text-white"> Mode de Jeu </label>

                <select id="game-mode"
                        v-model="selectedGameModeRef"
                        class="mt-1.5 w-full rounded-lg border-gray-300 p-3 text-slate-700 sm:text-sm">
                    <option value="" disabled>
                        Please select a game mode
                    </option>

                    <optgroup v-for="gameMode in gameStore.gameModes" :key="gameMode.mode" :label="gameMode.mode">
                        <option v-for="gameModeVariant in gameMode.variants" 
                                :key="gameModeVariant"
                                :label="`${gameMode.mode} - ${gameModeVariant}`"
                                :value="`${gameMode.mode}_${gameModeVariant}`">
                        </option>
                    </optgroup>
                </select>
            </div>

            <button :disabled="noPlayers || noGameModeSelected"
                    class="inline-block w-full rounded-lg border border-green-600 bg-green-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring active:text-green-500 disabled:pointer-events-none disabled:border-gray-500 disabled:bg-gray-500"
                    @click="onStartNewGame()">
                Demarrer une nouvelle partie
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { CricketVariantModes } from '~/stores/gameCricketStore';

definePageMeta({
    layout: 'default'
});

const playerStore = usePlayerStore();
const gameStore = useGameStore();

const selectedGameModeRef = ref('');
const selectedGameMode = computed(() => {
    return {
        mode: selectedGameModeRef.value.split('_')[0],
        variant: selectedGameModeRef.value.split('_')[1]
    }
});
const noPlayers = computed(() => playerStore.players.length === 0);
const noGameModeSelected = computed(() => selectedGameModeRef.value === "");

function onStartNewGame() {
   
    if(playerStore.players.length) {
        gameStore.newGame(playerStore.players, {mode: selectedGameMode.value.mode, variant: selectedGameMode.value.variant});
    }
}
</script>

<style lang="scss" scoped></style>