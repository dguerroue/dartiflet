import { defineStore } from 'pinia'

export type CricketScore = 'bull' | 20 | 19 | 18 | 17 | 16 | 15;

export const useGameCricketStore = defineStore('gameCricket', () => {
    const playersScores = reactive<{
        playerId: number,
        scorePoints: number,
        playerScoreHistory: CricketScore[]
    }[]>([]);

    function getScoresByPlayerId(playerId: number) {
        return playersScores.find(ps => ps.playerId == playerId)
    }

    function getScorePointsByPlayerId(playerId: number) {
        return getScoresByPlayerId(playerId)?.scorePoints ?? 0
    }

    function getScoreStateByPlayerId(playerId: number, score: CricketScore) {
        return getScoresByPlayerId(playerId)?.playerScoreHistory.filter(psh => psh == score).length ?? 0
    }

    function pushScore(playerId: number, score: CricketScore) {
        const playerScore = getScoresByPlayerId(playerId)

        if(playerScore === undefined) {
            playersScores.push({
                playerId: playerId,
                scorePoints: 0,
                playerScoreHistory: [score]
            })
        } else {
            playerScore.playerScoreHistory.push(score)

            // ça score !
            if(getScoreStateByPlayerId(playerId, score) > 3) {
                playerScore.scorePoints += score === 'bull' ? 25 : score
            }
        }

        console.log(playerScore?.playerScoreHistory)

    }

    return { playersScores, pushScore, getScoreStateByPlayerId, getScorePointsByPlayerId, getScoresByPlayerId }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});