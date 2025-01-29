import { defineStore } from 'pinia'
import type { Player } from './playerStore';

export type GameMode = {
    mode: string,
    variants: string[],
};

export type Game = {
    id: number,
    mode: {
        mode: string,
        variant: string,
    },
    isStarted: boolean,
    players: Player[]
}

export const useGameStore = defineStore('game', () => {

    const game = ref<Game|null>(null);
    const winner: Ref<Player|undefined> = ref(undefined);

    const gameModes: GameMode[] = [
        {
            mode: 'cricket',
            variants: ['classic', 'random', 'random-and-events'],
        }
    ];

    function newGame<Mode extends string, Variant extends string>(players: Player[], params: {mode: Mode, variant: Variant}) {
        game.value = {
            id: 1,
            isStarted: false,
            mode: {
                mode: params.mode,
                variant: params.variant
            },
            players: players
        }
    }

    function startGame() {
        if(game.value) {
            game.value.isStarted = true
        }
    }
    function stopGame() {
        if(game.value) {
            game.value.isStarted = false
        }
    }

    function endGame() {
        game.value = null;
        stopGame();
        resetGame();
    }

    function setWinner(playerId: number) {
        winner.value = game.value?.players.find(player => player.id == playerId);
    }

    function resetGame() {
        winner.value = undefined
    }

    return { newGame, startGame, stopGame, endGame, resetGame, game, gameModes, setWinner, winner }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});