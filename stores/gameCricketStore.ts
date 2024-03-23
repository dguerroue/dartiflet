import { defineStore } from 'pinia'
import { useGameStore } from './gameStore';


export const useGameCricketStore = defineStore('gameCricket', () => {
    const gameStore = useGameStore();

    const defaultCricketScores: [number, ...number[]] = [25, 20, 19, 18, 17, 16, 15];

    const cricketScores = ref<[number, ...number[]]>(defaultCricketScores);

    function setCricketScore(scores: [number, ...number[]]) {
        cricketScores.value = scores;
    }

    // TODO: essayer de changer le type de score par ça:
    type Score = {
        value: number,
        state: 1 | 2 | 3
    }
    
    const playersScores = ref<{
        playerId: number,
        scorePoints: number,
        scoresOpen: number[],
        scoresClose: number[],
        playerScoreHistory: number[]
    }[]>([]);

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

    function pushScore(playerId: number, score: number) {
        const playerScore = getScoresByPlayerId(playerId);
        
        if(playerScore === undefined) {
            playersScores.value.push({
                playerId: playerId,
                scorePoints: 0,
                scoresOpen: [],
                scoresClose: [],
                playerScoreHistory: [score]
            })
        } else {
            playerScore.playerScoreHistory.push(score)

            if(checkClosedScore(score) == false) {
        
                // ça score !
                if(getCountByScorePlayer(playerId, score) == 3) {
                    playerScore.scoresOpen.push(score);
                }
                if(getCountByScorePlayer(playerId, score) > 3) {
                    playerScore.scorePoints += score
                }
            }
        }

    }

    return { cricketScores, setCricketScore, playersScores, pushScore, getCountByScorePlayer, checkClosedScore, getScorePointsByPlayerId, getScoresByPlayerId }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});