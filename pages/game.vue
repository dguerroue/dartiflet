<template>
    <div class="flex size-full grow gap-4 py-6">
        <!-- SCORE LIST -->
        <div class="w-1/6">
            <div class="flex size-full flex-col gap-2 dark:text-white">
                <div class="mb-4 h-20"></div>
                <div v-for="score in gameCricketStore.cricketScores" :key="score" class="flex grow items-center justify-center text-2xl font-bold dark:text-white">
                    {{ score == 25 ? 'B' : score }}
                </div>
            </div>
        </div>
        <!-- PLAYERS SCORES -->
        <div class="grid w-full grid-cols-2 gap-4">
            <div v-for="player in gameStore.game?.players" :key="player.id" class="flex size-full flex-col gap-2 dark:text-white">
                <div class="mb-4 flex h-20 flex-col items-center justify-center rounded-lg text-lg font-bold dark:bg-slate-800">
                    <span class="capitalize">{{ player.name }}</span>
                    <Transition name="blink" mode="out-in">
                        <span :key="gameCricketStore.getScorePointsByPlayerId(player.id)">{{ gameCricketStore.getScorePointsByPlayerId(player.id) }}</span>
                    </Transition>
                </div>
                <!-- Start cricket grid -->
                <div v-for="score in gameCricketStore.cricketScores" :key="score" class="relative flex grow flex-col items-center justify-center" :class="{'pointer-events-none opacity-15': gameCricketStore.checkClosedScore(score)}"
                     @click="playerScore(player.id, score)">
                    <span v-if="gameCricketStore.getCountByScorePlayer(player.id, score) == 0" class="cross-step-0"></span>
                    <span v-if="gameCricketStore.getCountByScorePlayer(player.id, score) >= 1" class="cross-step-1"></span>
                    <span v-if="gameCricketStore.getCountByScorePlayer(player.id, score) >= 2" class="cross-step-2"></span>
                    <span v-if="gameCricketStore.getCountByScorePlayer(player.id, score) >= 3" class="cross-step-3"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'default',
    middleware: 'has-game'
});

const gameStore = useGameStore();
const gameCricketStore = useGameCricketStore();

// function generateRandomArray(length: number, min: number = 1, max: number = 20): number[] {
//     const randomArray: number[] = [];
//     for (let i = 0; i < length; i++) {
//         const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
//         randomArray.push(randomNumber);
//     }
//     return randomArray;
// }

// gameCricketStore.setCricketScore([25, ...generateRandomArray(6)])

function playerScore(id:number, score: number) {
    gameCricketStore.pushScore(id, score)
}
</script>

<style lang="scss" scoped>


.cross-step-0,
.cross-step-1,
.cross-step-2,
.cross-step-3 {
    @apply absolute left-1/2 top-1/2 block rounded-lg bg-red-600 h-[6px] w-[70px] -translate-x-1/2 -translate-y-1/2;

    &.cross-step-0 {
        @apply w-[20px] bg-slate-200;
    }
    &.cross-step-1 {
        @apply rotate-45 ;
    }
    &.cross-step-2 {
        @apply -rotate-45;
    }
    &.cross-step-3 {
        @apply size-[50px] bg-transparent border-red-600 border-[6px] rounded-full;
    }
}

.cross-step-1,
.cross-step-2,
.cross-step-3 {
    animation: fadeIn 0.2s ease-in-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
}

.blink-enter-active {
  transition: all .2s ease;
}

.blink-leave-active {
  transition: all .2s ease;
}

.blink-enter,
.blink-leave-to {
  transform: scale(1.5);
  opacity: 0;
}
</style>