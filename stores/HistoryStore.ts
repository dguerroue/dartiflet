import { defineStore } from 'pinia'

export type HistoryItem = {
    date: Date,
    gamemode: string,
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

    return {
        historyList,
        getHistory,
        addHistoryRecord
    }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});