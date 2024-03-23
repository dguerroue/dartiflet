import { defineStore } from 'pinia'
import { useGameStore } from './gameStore';


export const useGameCricketStore = defineStore('gameCricket', () => {
    const gameStore = useGameStore();

    const defaultCricketScores: [number, ...number[]] = [25, 20, 19, 18, 17, 16, 15];

    const cricketScores = ref<[number, ...number[]]>(defaultCricketScores);

    const winnerPlayerId = ref<number>()

    function setCricketScore(scores: [number, ...number[]]) {
        cricketScores.value = scores;
    }

    // TODO: essayer de changer le type de score par ça:
    type Score = {
        value: number,
        state: 1 | 2 | 3
    }

    type PlayerScore = {
        playerId: number,
        scorePoints: number,
        scoresOpen: number[],
        scoresClose: number[],
        playerScoreHistory: number[]
    }

    const playerIdsHistory: number[] = []
    
    const playersScores = ref<PlayerScore[]>([]);

    function resetGame() {
        gameStore.resetGame();

        playersScores.value.forEach(ps => {
            ps.playerScoreHistory = [];
            ps.scorePoints = 0;
            ps.scoresClose = [];
            ps.scoresOpen = [];
        })
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

    function pushScore(playerId: number, score: number) {
        playerIdsHistory.push(playerId)
        
        if(getScoresByPlayerId(playerId) === undefined) {
            playersScores.value.push({
                playerId: playerId,
                scorePoints: 0,
                scoresOpen: [],
                scoresClose: [],
                playerScoreHistory: []
            })
        }

        const playerScore = getScoresByPlayerId(playerId);
        if(playerScore) {

            playerScore.playerScoreHistory.push(score)
    
            if(checkClosedScore(score) == false) {
        
                // ça score !
                if(cricketScores.value.indexOf(score) && getCountByScorePlayer(playerId, score) == 3) {
                    playerScore.scoresOpen.push(score);
                }
                if(getCountByScorePlayer(playerId, score) > 3 || cricketScores.value.indexOf(score) == -1) {
                    playerScore.scorePoints += score
                }
    
                checkPlayerWin(playerScore)
            }
        }

    }

    function wallHit(playerId: number) {
        pushScore(playerId, -cricketScores.value[1])
    }

    function undo() {
        const lastActionPlayerId = playerIdsHistory.pop()

        if(lastActionPlayerId == undefined) {
            return
        }

        const playerScores = playersScores.value.find((player) => player.playerId == lastActionPlayerId)

        if(!playerScores) {
            return
        }
        
        const poppedScore = playerScores.playerScoreHistory.pop()

        
        if(poppedScore) {
            if(getCountByScorePlayer(lastActionPlayerId, poppedScore) < 3 && cricketScores.value.indexOf(poppedScore) != -1) {
                playerScores.scoresOpen = playerScores.scoresOpen.filter(item => item != poppedScore)
            } else {
                const playerScore = getScoresByPlayerId(lastActionPlayerId);

                if(playerScore !== undefined) {
                    playerScore.scorePoints -= poppedScore;
                }
    
            }
        }
        
    }

    return { resetGame, cricketScores, setCricketScore, playersScores, pushScore, wallHit, undo, getCountByScorePlayer, checkClosedScore, getScorePointsByPlayerId, getScoresByPlayerId }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});