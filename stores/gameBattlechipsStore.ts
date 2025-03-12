import { defineStore } from 'pinia'
import { useGameStore } from './gameStore';

type PlayerShips = {
    playerId: number,
    ships: number[],
    shipsDestroyed: number[]
    playerShipsHitHistory: number[]
}

export const useGameBattleshipsStore = defineStore('gameBattleships', () => {
    const gameStore = useGameStore();
    const { dartSound1, dartSound2, dartSound3, wallSound, undoSound } = useSoundEffect();

    const playerIdsHistory = ref<number[]>([]);
    
    const playersLoosers = ref<number[]>([]);
    const playersShips = ref<PlayerShips[]>([]);

    function generateShips(numPlayers: number) {
        // if 2 players, 6 ships
        // if 3 players, 6 ships
        // if 4 players, 5 ships

        const allShips = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const shipsPerPlayer = numPlayers == 4 ? 5 : 6;

        for(let i = 0; i < numPlayers; i++) {
            const playerShips: number[] = [];

            for(let j = 0; j < shipsPerPlayer; j++) {
                const randomIndex = Math.floor(Math.random() * allShips.length);

                playerShips.push(allShips[randomIndex]);
                allShips.splice(randomIndex, 1);
            }

            playersShips.value.push({
                playerId: i,
                ships: playerShips,
                shipsDestroyed: [],
                playerShipsHitHistory: []
            });
        }
    }

    function initGame() {

        // generate ships for each player

        if(!gameStore.game?.players || gameStore.game?.players.length < 1) {
            console.warn("Can't start a game with 1 player or less");
            return;
        }
        
        generateShips(gameStore.game.players.length);

        gameStore.startGame();
    }

    function getOrderedPlayerShipsByPlayerId(playerId: number): number[] | undefined {

        // return all ships number in order
        const playerShips = playersShips.value.find((playerShips) => playerShips.playerId == playerId);

        // order playerShips by desc
        if(!playerShips) {
            console.warn('No ships found for this player ID:', playerId);
            return;
        }
        
        return playerShips.ships.sort((a, b) => b - a);
    }

    function resetGame() {
        gameStore.resetGame();

        playerIdsHistory.value = [];
        playersLoosers.value = [];
        playersShips.value = [];
    }

    // function checkClosedScore(score: number) {
    //     const allScoresOpen: number[] = [];
    //     const numPlayers = gameStore.game?.players.length ?? 0;

    //     if(playersScores.value.length == 0) {
    //         return;
    //     }

    //     playersScores.value.forEach(ps => { allScoresOpen.push(...ps.scoresOpen) });

    //     const numberOfOpenScore = allScoresOpen.reduce((acc, value) => {
    //         return value === score ? acc + 1 : acc;
    //     }, 0);

    //     return numberOfOpenScore >= numPlayers
    // }

    function checkWinner() {
        if(playersLoosers.value.length == gameStore.game!.players.length - 1) {
            const winner = gameStore.game?.players.find(p => !playersLoosers.value.includes(p.id));

            if(winner) {
                gameStore.setWinner(winner.id);
            }
        }
    }

    function hitPlayerShip(playerId: number, shipId: number, noSounds: boolean = false) {
        if(checkShipDestroy(playerId, shipId)) {
            return;
        }

        const playerShips = playersShips.value.find((playerShips) => playerShips.playerId == playerId);

        playerIdsHistory.value.push(playerId);
        playerShips?.playerShipsHitHistory.push(shipId);

        // sounds effects
        if(noSounds == false) {
            switch(getCountShipHit(playerId, shipId)) {
            case 1:
                dartSound1.play();
                break;
            case 2:
                dartSound2.play();
                break;
            case 3:
                dartSound3.play();
            }
        }

        if(getCountShipHit(playerId, shipId) >= 3) {
            playerShips?.shipsDestroyed.push(shipId);
        }

        if(playerShips?.shipsDestroyed.length === playerShips?.ships.length) {
            playersLoosers.value.push(playerId);
        }

        // TODO: check player win
        checkWinner();
    }

    function getCountShipHit(playerId: number, shipId: number) {
        const playerShips = playersShips.value.find((playerShips) => playerShips.playerId == playerId);

        if(playerShips === undefined) {
            return 0;
        }

        return playerShips.playerShipsHitHistory.reduce((acc, value) => {
            return value === shipId ? acc + 1 : acc;
        }, 0);
    }

    function getCountShipLeft(playerId: number) {
        const playerShips = playersShips.value.find((playerShips) => playerShips.playerId == playerId);

        if(playerShips === undefined) {
            return 0;
        }

        return playerShips.ships.length - playerShips.shipsDestroyed.length;
    }

    function checkShipDestroy(playerId: number, shipId: number) {
        const playerShips = playersShips.value.find((playerShips) => playerShips.playerId == playerId);

        if(playerShips === undefined) {
            return false;
        }

        return getCountShipHit(playerId, shipId) >= 3;
    }

    function wallHit(playerId: number) {
        wallSound.play();
    }



    function undo() {
        undoSound.play();

        const lastActionPlayerId = playerIdsHistory.value.pop();

        if(lastActionPlayerId == undefined) {
            return
        }

        const playerShips = playersShips.value.find(ps => ps.playerId == lastActionPlayerId);

        if(playerShips === undefined) {
            return;
        }

        const popedShip = playerShips.playerShipsHitHistory.pop();
    }

    return {
        playerIdsHistory,
        playersShips,
        initGame,
        resetGame,
        getOrderedPlayerShipsByPlayerId,
        hitPlayerShip,
        getCountShipHit,
        getCountShipLeft,
        checkShipDestroy,
        wallHit,
        undo
    }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});