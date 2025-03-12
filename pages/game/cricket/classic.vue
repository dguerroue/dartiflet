<template>
    <div class="relative flex h-full flex-col ">
        <div v-if="gameStore.winner" id="backdrop" class="fixed left-0 top-0 z-20 size-full bg-black/60"></div>
        <div v-if="gameStore.winner" class="absolute left-1/2 top-1/2 z-20 flex w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 rounded-lg bg-slate-800 py-16 font-bold">
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
        <div class="flex size-full grow gap-4 py-6">
            <!-- SCORE LIST -->
            <div class="sticky left-0 top-0 z-10 w-1/6 bg-slate-900">
                <div class="flex size-full flex-col gap-2 text-white">
                    <div class="mb-4 flex h-20 items-center justify-center">
                        <button class="mx-4 cursor-pointer rounded-lg border-2 border-slate-300 p-3 text-base hover:bg-slate-700 active:bg-slate-600" @click="goHome()">
                            <IconArrowLeft />
                        </button>
                    </div>
                    <div v-for="score in gameCricketStore.cricketScores"
                         :key="score"
                         class="flex grow items-center justify-center text-4xl font-bold text-white"
                         :class="{'opacity-15': gameCricketStore.checkClosedScore(score)}">
                        {{ score == 25 ? 'B' : score }}
                    </div>
                </div>
            </div>
            <!-- PLAYERS SCORES -->
            <div class="no-scrollbar flex w-full gap-4 overflow-auto">
                <div v-for="player in gameStore.game?.players" :key="player.id" class="flex size-full flex-col gap-2 text-white">
                    <div class="mb-4 flex h-20 w-full rounded-lg bg-slate-800 text-lg font-bold">
                        <div class="flex w-full items-center">
                            <div class="flex grow flex-col items-center justify-center px-3">
                                <span class="text-nowrap capitalize">{{ player.name }}</span>
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
                    <div v-for="score in gameCricketStore.cricketScores"
                         :key="score"
                         class="relative flex grow cursor-pointer flex-col items-center justify-center transition-colors active:bg-white/5"
                         :class="{'pointer-events-none opacity-15': gameCricketStore.checkClosedScore(score)}"
                         @click="playerScoring(player.id, score)">
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
            <button type="button" class="mb-4 flex h-14 grow cursor-pointer flex-col items-center justify-center rounded-lg bg-slate-800 text-lg font-bold text-white active:bg-slate-600" @click="gameCricketStore.undo()">
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
const gameCricketStore = useGameCricketStore();
const historyStore = useHistoryStore();

if(gameStore.game?.isStarted == false) {
    gameCricketStore.resetGame();
    gameCricketStore.initGame(gameStore.game?.mode.variant as CricketVariantModes)
}

function playerScoring(id:number, score: number) {
    gameCricketStore.pushScore(id, score)
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
                score: gameCricketStore.getScorePointsByPlayerId(player.id)
            }))
        })

        gameStore.stopGame();
    }
})

function replayGame() {
    gameCricketStore.resetGame();
    gameCricketStore.initGame(gameStore.game?.mode.variant as CricketVariantModes)
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