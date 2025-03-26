import { defineStore } from 'pinia'
import { useGameStore } from './gameStore';

type PlayerShips = {
    playerId: number,
    ships: number[],
    shipsDestroyed: number[]
    playerShipsHitHistory: number[]
}

type PlayerShield = {
    playerId: number,
    shieldActive: boolean,
    shieldHitHistory: number[]
    shieldValue: number
}

export const useGameBattleshipsStore = defineStore('gameBattleships', () => {
    const gameStore = useGameStore();
    const soundEffect = useSoundEffect();

    const playerIdsHistory = ref<number[]>([]);
    
    const playersLoosers = ref<number[]>([]);
    const playersShips = ref<PlayerShips[]>([]);

    // const playersShieldsMap = ref<Map<number, PlayerShield>>(new Map());
    const playersShields = ref<PlayerShield[]>([]);

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

        // initialize players shields
        gameStore.game.players.forEach(player => {
            playersShields.value.push({
                playerId: player.id,
                shieldActive: true,
                shieldHitHistory: [],
                shieldValue: 101
            });
        });

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

    function getShieldByPlayerId(playerId: number): PlayerShield | undefined {
        // return playersShieldsMap.value.get(playerId);
        return playersShields.value.find(ps => ps.playerId == playerId);
    }

    function resetGame() {
        gameStore.resetGame();

        playerIdsHistory.value = [];
        playersLoosers.value = [];
        playersShips.value = [];
        playersShields.value = [];
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

    function hitPlayerShield(playerId: number, value: number) {
        const playerShield = getShieldByPlayerId(playerId);

        if(playerShield === undefined) {
            return;
        }

        if(value > playerShield.shieldValue) {
            console.warn('Shield value can\'t be negative');
            soundEffect.dartSound3.play();
            // TODO: disable higher values
            return;
        }

        soundEffect.dartSound1.play();
        playerShield.shieldValue -= value;
        playerShield.shieldHitHistory.push(value);

        if(playerShield.shieldValue <= 0) {
            soundEffect.shipOut.play();
            playerShield.shieldActive = false;
            playerShield.shieldValue = 0;
        }
    }

    function addPlayerShield(playerId: number) {
        const playerShield = getShieldByPlayerId(playerId);

        if(playerShield === undefined) {
            return;
        }

        soundEffect.dartSound1.play();
        soundEffect.newEventSound.play();
        playerShield.shieldActive = true;
        playerShield.shieldValue = 101;
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
                soundEffect.dartSound1.play();
                break;
            case 2:
                soundEffect.dartSound2.play();
                break;
            case 3:
                soundEffect.dartSound3.play();
                soundEffect.shipOut.play();
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
        return computed(() => {
            const playerShips = playersShips.value.find((playerShips) => playerShips.playerId == playerId);
    
            if(playerShips === undefined) {
                return 0;
            }
    
            return playerShips.ships.length - playerShips.shipsDestroyed.length;
        })
    }

    function checkShipDestroy(playerId: number, shipId: number) {
        const playerShips = playersShips.value.find((playerShips) => playerShips.playerId == playerId);

        if(playerShips === undefined) {
            return false;
        }

        return getCountShipHit(playerId, shipId) >= 3;
    }

    function wallHit(playerId: number) {
        soundEffect.wallSound.play();
    }



    function undo() {
        soundEffect.undoSound.play();

        const lastActionPlayerId = playerIdsHistory.value.pop();

        if(lastActionPlayerId == undefined) {
            return
        }

        const playerShips = playersShips.value.find(ps => ps.playerId == lastActionPlayerId);

        if(playerShips === undefined) {
            return;
        }

        const popedShip = playerShips.playerShipsHitHistory.pop();

        // if ship was destroyed, remove it from destroyed ships
        if(popedShip && getCountShipHit(lastActionPlayerId, popedShip) < 3) {
            playerShips.shipsDestroyed = playerShips.shipsDestroyed.filter(ship => ship !== popedShip);
        }
    }

    return {
        playerIdsHistory,
        playersShips,
        playersShields,
        initGame,
        resetGame,
        getOrderedPlayerShipsByPlayerId,
        getShieldByPlayerId,
        addPlayerShield,
        hitPlayerShield,
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