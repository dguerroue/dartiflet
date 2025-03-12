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

    let playerIdsHistory: number[] = []
    
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

    function getPlayerShipsByPlayerId(playerId: number): number[] | undefined {

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

        playerIdsHistory = [];
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

    function checkPlayerWin(playerScore: PlayerScore) {
        if(false) {
            gameStore.setWinner(playerScore.playerId);
        }
    }

    function pushScore(playerId: number, score: number, noSounds: boolean = false) {

        playerIdsHistory.push(playerId);







        // TODO: implement this, when player hits a ship
        console.log(`player ${playerId}, ship ${score} hit`);






        // if(playerScore === undefined) {
        //     playersScores.value.push({
        //         playerId: playerId,
        //         scorePoints: score < 0 ? score : 0, // if start with wall
        //         scoresOpen: [],
        //         playerScoreHistory: [score],
        //         playerScoreEventHistory: []
        //     });

        //     if(noSounds == false) {
        //         dartSound1.play();
        //     }
        // } else {
        //     playerScore.playerScoreHistory.push(score);
            
        //     if(checkClosedScore(score) == false) {

        //         if(noSounds == false) {
        //             // sounds effects
        //             getCountByScorePlayer(playerId, score)
        //             switch(getCountByScorePlayer(playerId, score)) {
        //             case 1:
        //                 dartSound1.play();
        //                 break;
        //             case 2:
        //                 dartSound2.play();
        //                 break;
        //             case 3:
        //                 dartSound3.play();
        //             }

        //             if(getCountByScorePlayer(playerId, score) > 3) {
        //                 dartSound3.play();
        //             }
        //         }

        //         checkPlayerWin(playerScore)
        // }
        // }
    }

    function wallHit(playerId: number) {
        wallSound.play();
    }

    function undo() {
        undoSound.play();

        const lastActionPlayerId = playerIdsHistory.pop()

        if(lastActionPlayerId == undefined) {
            return
        }

        // const playerScores = playersScores.value.find((player) => player.playerId == lastActionPlayerId)

        // if(!playerScores) {
        //     return
        // }

        // const popperEventScore = scoreTypeHistory.pop();

        // if(popperEventScore == 'event') {
        //     const poppedEventScore = playerScores.playerScoreEventHistory.pop();

        //     if(poppedEventScore) {
        //         const playerScore = getScoresByPlayerId(lastActionPlayerId);
    
        //         if(playerScore !== undefined) {
        //             playerScore.scorePoints -= poppedEventScore;
        //         }
        //     }

        // } else if(popperEventScore == 'score') {
        //     const poppedScore = playerScores.playerScoreHistory.pop()
    
        //     if(poppedScore) {
        //         if(getCountByScorePlayer(lastActionPlayerId, poppedScore) < 3 && cricketScores.value.includes(poppedScore)) {
        //             playerScores.scoresOpen = playerScores.scoresOpen.filter(item => item != poppedScore)
        //         } else {
        //             const playerScore = getScoresByPlayerId(lastActionPlayerId);
    
        //             if(playerScore !== undefined) {
        //                 playerScore.scorePoints -= poppedScore;
        //             }
        
        //         }
        //     }
        // }
        
        
    }

    return { 
        initGame,
        resetGame,
        getPlayerShipsByPlayerId,
        playersShips,
        pushScore,
        wallHit,
        undo
    }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});