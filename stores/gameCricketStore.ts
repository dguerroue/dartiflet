import { defineStore } from 'pinia'
import { useGameStore } from './gameStore';

export type CricketVariantModes = 'classic' | 'random' | 'random-and-events';

export type PlayerScore = {
    playerId: number,
    scorePoints: number,
    scoresOpen: number[],
    playerScoreHistory: number[],
    playerScoreEventHistory: number[]
}

export const useGameCricketStore = defineStore('gameCricket', () => {
    const gameStore = useGameStore();
    const gameEventStore = useGameEventStore();
    const { dartSound1, dartSound2, dartSound3, wallSound, undoSound, newEventSound } = useSoundEffect();

    const defaultCricketScores: [number, ...number[]] = [25, 20, 19, 18, 17, 16, 15];

    const cricketScores = ref<[number, ...number[]]>(defaultCricketScores);

    const winnerPlayerId = ref<number>();

    // TODO: essayer de changer le type de score par ça:
    type Score = {
        value: number,
        state: 1 | 2 | 3
    }

    let playerIdsHistory: number[] = []
    let scoreTypeHistory: Array<"score" | "event"> = []
    
    const playersScores = ref<PlayerScore[]>([]);

    function startGame(variant: CricketVariantModes) {
        
        if(variant == 'classic') {
            cricketScores.value = defaultCricketScores
        }
        if(variant == 'random' || variant == 'random-and-events') {
            function generateRandomArray(length: number, min: number = 1, max: number = 20): number[] {
                const randomArray: number[] = [];
            
                if(length > 20) {
                    length = 20
                }
                
                while (randomArray.length < length) {
                    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            
                    if(randomArray.indexOf(randomNumber) == -1) {
                        randomArray.push(randomNumber);
                    }
                }
            
                return randomArray.sort(function(a, b){return b-a});
            }
    
            cricketScores.value = [25, ...generateRandomArray(6)]
        }

        gameStore.startGame();
    }

    function startEvent() {
        console.log(gameEventStore.generateEventScore());
    }

    function resetGame() {
        gameStore.resetGame();

        playerIdsHistory = [];
        scoreTypeHistory = [];

        // playersScores.value.forEach(ps => {
        //     ps.scorePoints = 0;
        //     ps.scoresOpen = [];
        //     ps.playerScoreHistory = [];
        //     ps.playerScoreEventHistory = [];
        // })
        playersScores.value = [];
    }

    function getScoresByPlayerId(playerId: number) {
        return playersScores.value.find(ps => ps.playerId == playerId)
    }

    function getScorePointsByPlayerId(playerId: number) {
        return getScoresByPlayerId(playerId)?.scorePoints ?? 0
    }

    function getCountByScorePlayer(playerId: number, score: number) {
        return getScoresByPlayerId(playerId)?.playerScoreHistory.filter(psh => psh == score).length ?? 0
    }

    function checkClosedScore(score: number) {
        const allScoresOpen: number[] = [];
        const numPlayers = gameStore.game?.players.length ?? 0;

        if(playersScores.value.length == 0) {
            return;
        }

        playersScores.value.forEach(ps => { allScoresOpen.push(...ps.scoresOpen) });

        const numberOfOpenScore = allScoresOpen.reduce((acc, value) => {
            return value === score ? acc + 1 : acc;
        }, 0);

        return numberOfOpenScore >= numPlayers
    }

    function checkPlayerWin(playerScore: PlayerScore) {
        if(playerScore.scoresOpen.length === cricketScores.value.length) {
            const allPlayerScorePoints = playersScores.value.map(ps => ps.scorePoints)

            if(playerScore.scorePoints == Math.max(...allPlayerScorePoints)) {
                gameStore.setWinner(playerScore.playerId);
            }
        }
    }

    function pushScore(playerId: number, score: number, noSounds: boolean = false) {
        const playerScore = getScoresByPlayerId(playerId);

        playerIdsHistory.push(playerId)
        scoreTypeHistory.push('score');

        if(playerScore === undefined) {
            playersScores.value.push({
                playerId: playerId,
                scorePoints: 0,
                scoresOpen: [],
                playerScoreHistory: [score],
                playerScoreEventHistory: []
            });

            if(noSounds == false) {
                dartSound1.play();
            }
        } else {
            playerScore.playerScoreHistory.push(score);
            
            if(checkClosedScore(score) == false) {

                if(noSounds == false) {
                    // sounds effects
                    getCountByScorePlayer(playerId, score)
                    switch(getCountByScorePlayer(playerId, score)) {
                    case 1:
                        dartSound1.play();
                        break;
                    case 2:
                        dartSound2.play();
                        break;
                    case 3:
                        dartSound3.play();
                    }

                    if(getCountByScorePlayer(playerId, score) > 3) {
                        dartSound3.play();
                    }
                }

                // ça score !
                if(cricketScores.value.includes(score) && getCountByScorePlayer(playerId, score) == 3) {
                    playerScore.scoresOpen.push(score);
                }
                if(getCountByScorePlayer(playerId, score) > 3 || !cricketScores.value.includes(score)) {
                    playerScore.scorePoints += score
                }

                checkPlayerWin(playerScore)
            }
        }
    }

    function pushEventScore(playerId: number, score: number, noSounds: boolean = false) {

        playerIdsHistory.push(playerId);
        scoreTypeHistory.push('event');
        
        
        const playerScore = getScoresByPlayerId(playerId);
        if(playerScore === undefined) {

            playersScores.value.push({
                playerId: playerId,
                scorePoints: score,
                scoresOpen: [],
                playerScoreHistory: [],
                playerScoreEventHistory: [score]
            })
            if(noSounds == false) {
                dartSound3.play();
            }
        } else {
            playerScore.playerScoreEventHistory.push(score);

            // ça score !
            playerScore.scorePoints += score;

            if(noSounds == false) {
                dartSound3.play();
            } 

            checkPlayerWin(playerScore)
        }
    }

    function wallHit(playerId: number) {
        wallSound.play();
        pushScore(playerId, -cricketScores.value[1], true);
    }

    function undo() {
        undoSound.play();

        const lastActionPlayerId = playerIdsHistory.pop()

        if(lastActionPlayerId == undefined) {
            return
        }

        const playerScores = playersScores.value.find((player) => player.playerId == lastActionPlayerId)

        if(!playerScores) {
            return
        }

        const popperEventScore = scoreTypeHistory.pop();

        if(popperEventScore == 'event') {
            const poppedEventScore = playerScores.playerScoreEventHistory.pop();

            if(poppedEventScore) {
                const playerScore = getScoresByPlayerId(lastActionPlayerId);
    
                if(playerScore !== undefined) {
                    playerScore.scorePoints -= poppedEventScore;
                }
            }

        } else if(popperEventScore == 'score') {
            const poppedScore = playerScores.playerScoreHistory.pop()
    
            if(poppedScore) {
                if(getCountByScorePlayer(lastActionPlayerId, poppedScore) < 3 && cricketScores.value.includes(poppedScore)) {
                    playerScores.scoresOpen = playerScores.scoresOpen.filter(item => item != poppedScore)
                } else {
                    const playerScore = getScoresByPlayerId(lastActionPlayerId);
    
                    if(playerScore !== undefined) {
                        playerScore.scorePoints -= poppedScore;
                    }
        
                }
            }
        }
        
        
    }

    return { 
        startGame,
        startEvent,
        resetGame,
        cricketScores,
        playersScores,
        pushScore,
        pushEventScore,
        wallHit,
        undo,
        getCountByScorePlayer,
        checkClosedScore,
        getScorePointsByPlayerId,
        getScoresByPlayerId
    }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});