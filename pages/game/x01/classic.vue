<template>
    <div class="relative flex h-full flex-col ">
        <div v-if="gameStore.winner" id="backdrop" class="fixed left-0 top-0 z-20 size-full bg-black/60"></div>
        <div v-if="gameStore.winner" class="absolute left-1/2 top-1/2 z-30 flex w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 rounded-lg bg-slate-800 py-16 font-bold">
            <span class="mb-6 text-center text-xl text-white"><span class="text-2xl capitalize">{{ gameStore.winner.name }}</span><br />a gagné la partie !</span>
            <div class="flex flex-col gap-6">
                <div class="absolute left-1/2 top-0 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800 p-5" @click="jsConfetti.addConfetti()">
                    <img src="/assets/icons/logo-white.svg" />
                </div>
                <button class="rounded-lg bg-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-300" @click="goHome()">
                    RETOUR MENU
                </button>
                <button class="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700" @click="replayGame()">
                    REJOUER !
                </button>
            </div>
        </div>

        <!-- SCORE LIST -->
        <div class=" self-start bg-slate-900">
            <div class="flex h-20 items-center justify-center">
                <button class="cursor-pointer rounded-lg border-2 border-slate-300 p-3 text-base text-white hover:bg-slate-700 active:bg-slate-600" @click="goHome()">
                    <IconArrowLeft />
                </button>
            </div>
        </div>
        <div class="mb-4 flex size-full grow gap-4">
            <!-- PLAYERS SCORES -->
            <div class="no-scrollbar flex w-full gap-4 overflow-auto">
                <div v-for="player in gameStore.game?.players" :key="player.id" class="flex size-full flex-col gap-4 text-white">
                    <div class="flex size-full h-20 w-full shrink-0 items-center justify-between rounded-lg bg-slate-800 px-5 text-lg font-bold *:flex-1">
                        <span class="text-nowrap text-xl capitalize">{{ player.name }}</span>
                        
                        <span class="text-3xl">{{ gameX01Store.getScoreByPlayerId(player.id)?.scoreValue }}</span>

                        <div class="cursor-pointer rounded-lg border-2 border-slate-300 p-2 text-center text-base hover:bg-slate-700 active:bg-slate-600" @click="gameX01Store.wallHit(player.id)">
                            WALL
                        </div>
                    </div>

                    <!-- Start score grid -->
                    <div class="relative h-full rounded-lg border-4 border-white">
                        <div class="absolute left-0 top-0 flex size-full flex-col gap-2 overflow-y-scroll">
                            <div v-for="i in [...(Array(20).keys().map(v => ++v)), 25].reverse()"
                                 :key="i"
                                 class="flex shrink-0 cursor-pointer items-center text-center text-3xl font-bold *:flex-1">
                                <div class="py-5 active:bg-white/5" :class="[gameX01Store.getScoreByPlayerId(player.id)!.scoreValue < i ? 'text-slate-500' : 'text-white', gameX01Store.getScoreByPlayerId(player.id)!.scoreValue == i ? 'bg-amber-500': '']" @click="playerScoring(player.id, i)">
                                    {{ i }}
                                </div>
                                <div class="py-5 active:bg-white/5" :class="[gameX01Store.getScoreByPlayerId(player.id)!.scoreValue < i*2 ? 'text-slate-500' : 'text-white', gameX01Store.getScoreByPlayerId(player.id)!.scoreValue == i*2 ? 'bg-amber-500': '']" @click="playerScoring(player.id, i*2)">
                                    D{{ i }}
                                </div>
                                <div v-if="i == 25"></div>
                                <div v-if="i !== 25"
                                     class="py-5 active:bg-white/5"
                                     :class="[gameX01Store.getScoreByPlayerId(player.id)!.scoreValue < i*3 ? 'text-slate-500' : 'text-white', gameX01Store.getScoreByPlayerId(player.id)!.scoreValue == i*3 ? 'bg-amber-500': '']"
                                     @click="playerScoring(player.id, i*3)">
                                    T{{ i }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex w-full">
            <button type="button" class="mb-4 flex h-14 grow cursor-pointer flex-col items-center justify-center rounded-lg bg-slate-800 text-lg font-bold text-white active:bg-slate-600" @click="gameX01Store.undo()">
                ANNULER
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import JSConfetti from 'js-confetti'

definePageMeta({
    layout: 'default',
    middleware: 'has-game'
});

const jsConfetti = new JSConfetti()
const gameStore = useGameStore();
const gameX01Store = useGameX01Store();
const historyStore = useHistoryStore();

if(gameStore.game?.isStarted == false) {
    gameX01Store.resetGame();
    gameX01Store.initGame({variant: gameStore.game?.mode.variant})
}

function playerScoring(playerId:number, value: number) {
    gameX01Store.playerScore(playerId, value)
}

function goHome() {
    navigateTo('/');
}

watch(gameStore, () => {
    if(gameStore.winner && gameStore.game?.isStarted) {
        jsConfetti.addConfetti();

        // push history record
        historyStore.addHistoryRecord({
            date: new Date(),
            game: gameStore.game,
            winnerPlayer: gameStore.winner,
            scores: gameStore.game.players.map((player: Player) => ({
                player: player,
                score: gameX01Store.getScoreByPlayerId(player.id)?.scoreValue ?? 0,
            }))
        })

        gameStore.stopGame();
    }
})

function replayGame() {
    gameX01Store.resetGame();
    gameX01Store.initGame({variant: gameStore.game!.mode.variant})
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
</style>