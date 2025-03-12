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
                    <div v-if="isEventMode" class="flex grow items-center justify-center text-4xl font-bold " :class="gameEventStore.isEventStarted ? 'text-yellow-400' : 'text-white'">
                        E
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
                    <!-- Start Event row -->
                    <div v-if="isEventMode && !gameEventStore.isEventStarted" class="relative flex grow select-none flex-col items-center justify-center">
                        <span class="cross-step-0"></span>
                    </div>
                    <div v-if="isEventMode && gameEventStore.isEventStarted && gameEventStore.eventScoreTarget"
                         class="relative flex grow cursor-pointer select-none flex-col items-center justify-center text-yellow-400 transition-colors active:bg-white/5"
                         @click="playerEventScoring(player.id, gameEventStore.eventScoreTarget)">
                        <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-bold">{{ gameEventStore.eventScoreTarget }}</span>
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
        <div class="flex w-full space-x-2">
            <div class="w-1/6"></div>
            <button type="button" class="mb-4 flex h-14 grow cursor-pointer flex-col items-center justify-center rounded-lg bg-slate-800 text-lg font-bold text-white active:bg-slate-600" @click="gameCricketStore.undo()">
                ANNULER
            </button>
            <button type="button"
                    :class="[gameEventStore.isEventStarted ? 'border-yellow-400 text-yellow-400' : 'border-slate-800 text-white', {'event-hurry-up': gameEventStore.isEventHurryUp}]"
                    class="relative mb-4 flex h-14 grow cursor-pointer flex-col items-center justify-center rounded-lg border-4 bg-slate-800 text-lg font-bold  active:bg-slate-600">
                <div class="min-w-[55px] text-center">
                    <span v-if="gameEventStore.isEventStarted">00:{{ gameEventStore.eventTime?.toString().padStart(2, "0") }}</span>
                    <span v-else class="cross-step-0"></span>
                </div>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import JSConfetti from 'js-confetti'
import PreDebug from '~/components/PreDebug.vue';

definePageMeta({
    layout: 'default',
    middleware: 'has-game'
});

const jsConfetti = new JSConfetti()
const gameStore = useGameStore();
const gameCricketStore = useGameCricketStore();
const historyStore = useHistoryStore();

const gameEventStore = useGameEventStore();
const gameEventStoreRefs = storeToRefs(gameEventStore);

const isEventMode = gameStore.game?.mode.variant.includes('event');

if(gameStore.game?.isStarted == false) {
    gameCricketStore.resetGame();
    gameCricketStore.initGame(gameStore.game?.mode.variant as CricketVariantModes)
}

function initRandomEventLoop() {
    const cricketScores = gameCricketStore.cricketScores;

    // les 6 premiers meilleurs scores sauf ceux choisis pour le cricket
    const possibleEventScore = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].filter(item => !cricketScores.includes(item)).splice(0, 6);

    // gameEventStore.stopEvent();
    gameEventStoreRefs.possibleEventScore.value = possibleEventScore;
    gameEventStore.startClock();
}

function playerScoring(id:number, score: number) {
    gameCricketStore.pushScore(id, score)
}

function playerEventScoring(id:number, score: number) {
    gameCricketStore.pushEventScore(id, score);
}

function goHome() {
    gameEventStore.stopClock();

    navigateTo('/');
}

watch(gameStore, () => {
    if(gameStore.winner && gameStore.game?.isStarted) {
        jsConfetti.addConfetti();

        gameEventStore.stopClock();
      
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

    if(gameStore.game?.isStarted === true) {
        gameEventStore.stopClock();

        initRandomEventLoop();
    }
}

onMounted(() => {
    initRandomEventLoop();
})
onBeforeUnmount(() => {
    gameEventStore.stopClock();
})

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

.event-hurry-up {
  @keyframes hurryUp {
      0% {
          @apply border-yellow-400 text-yellow-400;
      }
      50% {
          @apply border-red-600 text-red-600;
      }
      100% {
          @apply border-yellow-400 text-yellow-400;
      }
  }

  animation: hurryUp 0.5s infinite;
}
</style>