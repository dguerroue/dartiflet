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

    function newGame(
        players: Player[], params: {mode: GameMode} = {mode: 'cricket'}) {
        game.value = {
            id: 1,
            isStarted: false,
            mode: params.mode,
            players: players
        }
    }

    return { newGame, game }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});