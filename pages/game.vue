<template>
    <div class="grid grid-cols-2 gap-4">
        <div v-for="player in gameStore.game?.players" :key="player.id" class="flex size-full flex-col gap-2 py-6 dark:text-white">
            <div class="mb-4 flex flex-col items-center justify-center border-2 py-4 dark:border-white">
                <span>{{ player.name }}</span>
                <span>{{ gameCricketStore.getScorePointsByPlayerId(player.id) }} pts</span>
            </div>
            <!-- Start cricket grid -->
            <div v-for="score in scores" :key="score" class="cricket_grid-item" @click="playerScore(player.id, score)">
                {{ score }} <span class="text-sm text-red-400">{{ gameCricketStore.getScoreStateByPlayerId(player.id, score) }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { CricketScore } from '~/stores/gameCricketStore';

definePageMeta({
    layout: 'default',
    middleware: 'has-game'
});

const gameStore = useGameStore();

const gameCricketStore = useGameCricketStore();

const scores: CricketScore[] = ['bull', 20, 19, 18, 17, 16, 15];

function playerScore(id:number, score: CricketScore) {
    gameCricketStore.pushScore(id, score)
}
</script>

<style lang="scss" scoped>
.cricket_grid-item {
    @apply flex grow flex-col items-center justify-center border-2 border-dashed py-4 dark:border-white text-lg font-bold uppercase active:scale-95 transition-transform;
}
</style>