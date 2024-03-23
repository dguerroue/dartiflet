import { defineStore } from 'pinia'
import type { Player } from './playerStore';

export type GameMode = 'cricket' | '501';
export type Game = {
    id: number,
    mode: GameMode,
    isStarted: boolean,
    players: Player[]
}

export const useGameStore = defineStore('game', () => {

    const game = ref<Game|null>(null);

    const winner: Ref<Player|undefined> = ref(undefined);

    function newGame(
        players: Player[], params: {mode: GameMode} = {mode: 'cricket'}) {
        game.value = {
            id: 1,
            isStarted: false,
            mode: params.mode,
            players: players
        }
    }

    function setWinner(playerId: number) {
        winner.value = game.value?.players.find(player => player.id == playerId);
    }

    function resetGame() {
        winner.value = undefined
    }

    return { newGame,resetGame, game, setWinner, winner }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});