import { defineStore } from 'pinia'

export type Player = {
    id: number,
    name: string
}

export const usePlayerStore = defineStore('players', () => {
    const players = ref<Player[]>([]);

    function addPlayer(playerName: string) {
        players.value.push({
            id: players.value.length,
            name: playerName
        });
    }

    function removePlayer(id: number) {
        players.value = players.value.filter(player => player.id != id);
    }

    return { players, addPlayer, removePlayer }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});