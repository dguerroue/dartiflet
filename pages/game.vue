<template>
    <div class="relative flex h-full flex-col">
        <div v-if="gameStore.winner" class="fixed left-0 top-0 z-10 size-full bg-black/60"></div>
        <div v-if="gameStore.winner" class="absolute left-1/2 top-1/2 z-20 flex w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 rounded-lg bg-white py-24 font-bold ">
            {{ gameStore.winner.name }} a gagné la partie !
            <div class="flex gap-4">
                <!-- TODO: gameStore.goHome() -->
                <button class="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-green-700" @click="endGame()">
                    MENU
                </button>
                <button class="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700" @click="replayGame()">
                    REJOUER !
                </button>
            </div>
        </div>
        <div class="flex size-full grow gap-4 py-6">
            <!-- SCORE LIST -->
            <div class="w-1/6">
                <div class="flex size-full flex-col gap-2 dark:text-white">
                    <div class="mb-4 flex h-20 items-center justify-center">
                        <button class="mx-4 cursor-pointer rounded-lg border-2 border-slate-300 p-3 text-base hover:bg-slate-700 active:bg-slate-600" @click="navigateTo('/')">
                            HOME
                        </button>
                    </div>
                    <div v-for="score in gameCricketStore.cricketScores" :key="score" class="flex grow items-center justify-center text-2xl font-bold dark:text-white" :class="{'opacity-15': gameCricketStore.checkClosedScore(score)}">
                        {{ score == 25 ? 'B' : score }}
                    </div>
                </div>
            </div>
            <!-- PLAYERS SCORES -->
            <div class="flex w-full gap-4">
                <div v-for="player in gameStore.game?.players" :key="player.id" class="flex size-full flex-col gap-2 dark:text-white">
                    <div class="mb-4 flex h-20 w-full rounded-lg text-lg font-bold dark:bg-slate-800">
                        <div class="flex w-full items-center">
                            <div class="flex grow flex-col items-center justify-center">
                                <span class="capitalize">{{ player.name }}</span>
                                <Transition name="blink" mode="out-in">
                                    <span :key="gameCricketStore.getScorePointsByPlayerId(player.id)">{{ gameCricketStore.getScorePointsByPlayerId(player.id) }}</span>
                                </Transition>
                            </div>
                            <div class="mx-4 cursor-pointer rounded-lg border-2 border-slate-300 p-3 text-base hover:bg-slate-700 active:bg-slate-600" @click="gameCricketStore.wallHit(player.id)">
                                WALL
                            </div>
                        </div>
                    </div>
                    <!-- Start cricket grid -->
                    <div v-for="score in gameCricketStore.cricketScores" :key="score" class="relative flex grow cursor-pointer flex-col items-center justify-center" :class="{'pointer-events-none opacity-15': gameCricketStore.checkClosedScore(score)}"
                         @click="playerScore(player.id, score)">
                        <span v-if="gameCricketStore.getCountByScorePlayer(player.id, score) == 0" class="cross-step-0"></span>
                        <span v-if="gameCricketStore.getCountByScorePlayer(player.id, score) >= 1" class="cross-step-1"></span>
                        <span v-if="gameCricketStore.getCountByScorePlayer(player.id, score) >= 2" class="cross-step-2"></span>
                        <span v-if="gameCricketStore.getCountByScorePlayer(player.id, score) >= 3" class="cross-step-3"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex w-full">
            <div class="w-1/6"></div>
            <div class="mb-4 flex h-14 grow cursor-pointer flex-col items-center justify-center rounded-lg text-lg font-bold active:bg-slate-600 dark:bg-slate-800 dark:text-white" @click="gameCricketStore.undo()">
                ANNULER
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

if(gameStore.game?.mode.mode == 'cricket') {
    gameCricketStore.startGame(gameStore.game?.mode.variant as CricketVariantModes)
};

function playerScore(id:number, score: number) {
    gameCricketStore.pushScore(id, score)
}

function endGame() {
    if(gameStore.game?.mode.mode == 'cricket') {
        gameCricketStore.resetGame();
    };

    gameStore.endGame();

    navigateTo('/');
}

function replayGame() {
    if(gameStore.game?.mode.mode == 'cricket') {
        gameCricketStore.resetGame();
        gameCricketStore.startGame(gameStore.game?.mode.variant as CricketVariantModes)
    };
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