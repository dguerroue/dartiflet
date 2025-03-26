import { defineStore } from 'pinia';
import { isToday } from 'date-fns';

export type HistoryItem = {
    date: Date,
    gamemode: string,
    variant: string,
    players: Player[],
    winnerPlayer: Player,
    scores: {
      player: Player,
      score: number
    }[]
}

export const useHistoryStore = defineStore('history', () => {
    const historyList = ref<HistoryItem[]>([]);

    function addHistoryRecord(params: { date: Date, game: Game, winnerPlayer: Player, scores: {player: Player, score: number}[] }) {
        historyList.value.push({
            date: params.date,
            gamemode: params.game.mode.mode,
            variant: params.game.mode.variant,
            players: params.game.players,
            winnerPlayer: params.winnerPlayer,
            scores: params.scores
        });
    }

    /** Return sort by date desc */
    function getHistory() {
        return historyList.value.sort((a, b) => {

            return new Date(b.date).getTime() - new Date(a.date).getTime()
        });
    }

    /** Getters */

    const historyToday = computed(() => {
        const history = getHistory();
        return history.filter((historyLine) => isToday(historyLine.date));
    });

    const historyPast = computed(() => {
        const history = getHistory();
        return history.filter((historyLine) => !isToday(historyLine.date));
    });

    function removeHistoryRecord(date: Date) {
        const index = historyList.value.findIndex((historyLine) => historyLine.date === date);
        if (index !== -1) {
            useSoundEffect().undoSound.play();

            historyList.value.splice(index, 1);
        }
    }

    return {
        historyList,
        getHistory,
        historyToday,
        historyPast,
        addHistoryRecord,
        removeHistoryRecord
    }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});