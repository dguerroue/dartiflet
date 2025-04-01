import { defineStore } from 'pinia'
import type { Player } from './playerStore';

export type GameMode = {
    mode: 'cricket' | 'battlechips' | 'X01',
    variants: ('random-and-events' | 'classic' | 'random' | '301')[],
};

export type Game = {
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
            variants: ['random-and-events', 'classic', 'random'],
        },
        {
            mode: 'battlechips',
            variants: ['classic'],
        },
        {
            mode: 'X01',
            variants: ['301'],
        }
    ];

    function newGame(players: Player[], params: {mode: string, variant: string}) {
        game.value = {
            isStarted: false,
            mode: {
                mode: params.mode,
                variant: params.variant
            },
            players: players
        }

        console.log(params)

        if(params.mode == 'cricket') {

            if(params.variant == 'random-and-events') {
                navigateTo({
                    path: '/game/cricket/random-and-events',
                })
            }
            if(params.variant == 'random') {
                navigateTo({
                    path: '/game/cricket/classic',
                })
            }
            if(params.variant == 'classic') {
                navigateTo({
                    path: '/game/cricket/classic',
                })
            }
        }

        if(params.mode == 'battlechips') {
            if(params.variant == 'classic') {
                navigateTo({
                    path: '/game/battlechips/classic',
                })
            }
        }

        if(params.mode == 'X01') {
            if(params.variant == '301') {
                navigateTo({
                    path: '/game/x01/classic',
                })
            }
        }
    }

    function resumeGame() {
        if(!game.value?.isStarted) {
            return
        } else {
            if(game.value?.mode.mode === 'cricket') {
                if(game.value.mode.variant === 'random-and-events') {
                    navigateTo({
                        path: '/game/cricket/random-and-events',
                    })
                }
                if(game.value.mode.variant === 'random') {
                    navigateTo({
                        path: '/game/cricket/classic',
                    })
                }
                if(game.value.mode.variant === 'classic') {
                    navigateTo({
                        path: '/game/cricket/classic',
                    })
                }
            }

            if(game.value?.mode.mode == 'battlechips') {
                if(game.value.mode.variant == 'classic') {
                    navigateTo({
                        path: '/game/battlechips/classic',
                    })
                }
            }

            if(game.value?.mode.mode == 'X01') {
                if(game.value.mode.variant == '301') {
                    navigateTo({
                        path: '/game/x01/classic',
                    })
                }
            }
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

    function setWinner(playerId: number) {
        useSoundEffect().winSound.play();
        winner.value = game.value?.players.find(player => player.id == playerId);
    }

    function resetGame() {
        winner.value = undefined
    }

    return { newGame, startGame, resumeGame, stopGame, resetGame, game, gameModes, setWinner, winner }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});