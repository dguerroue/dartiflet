<template>
    <div class="flex size-full flex-col gap-2 py-6 dark:text-white">
        <div class="mb-4 flex flex-col items-center justify-center border-2 py-4 dark:border-white">
            <span>Alex</span>
            <span>{{ gameCricketStore.getScorePointsByPlayerId(0) }} pts</span>
        </div>
        <!-- Start cricket grid -->
        <div v-for="score in scores" :key="score" class="cricket_grid-item" @click="playerScore(0, score)">
            {{ score }} <span class="text-sm text-red-400">{{ gameCricketStore.getScoreStateByPlayerId(0, score) }}</span>
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