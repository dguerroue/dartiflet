import { defineStore } from 'pinia'
import { useGameStore } from './gameStore';

type PlayerScore = {
    playerId: number,
    scoreHitHistory: number[]
    scoreValue: number
}

export const useGameX01Store = defineStore('gameX01', () => {
    const gameStore = useGameStore();
    const soundEffect = useSoundEffect();

    const playerIdsHistory = ref<number[]>([]);

    const playersScores = ref<PlayerScore[]>([]);

    function initGame(params: {variant: string}) {

        // generate ships for each player

        if(!gameStore.game) {
            return;
        }

        let initialScoreValue = 301;
        switch (params.variant) {
        case '101':
            initialScoreValue = 101;
            break;
        case '201':
            initialScoreValue = 201;
            break;
        case '301':
            initialScoreValue = 301;
            break;
        case '501':
            initialScoreValue = 501;
            break;
        default:
            break;
        }

        // initialize players shields
        gameStore.game.players.forEach(player => {
            playersScores.value.push({
                playerId: player.id,
                scoreHitHistory: [],
                scoreValue: initialScoreValue
            });
        });

        gameStore.startGame();
    }

    function getScoreByPlayerId(playerId: number): PlayerScore | undefined {
        // return playersShieldsMap.value.get(playerId);
        return playersScores.value.find(ps => ps.playerId == playerId);
    }

    function resetGame() {
        gameStore.resetGame();

        playerIdsHistory.value = [];
        playersScores.value = [];
    }

    function checkWinner() {
        const winner = playersScores.value.find(player => player.scoreValue == 0);

        if(winner) {
            gameStore.setWinner(winner.playerId);
        }
    }

    function playerScore(playerId: number, value: number) {
        const playerScore = getScoreByPlayerId(playerId);

        if(playerScore === undefined) {
            return;
        }

        if(value > playerScore.scoreValue) {
            console.warn('Shield value can\'t be negative');
            soundEffect.dartSound3.play();
            // TODO: disable higher values
            return;
        }

        soundEffect.dartSound1.play();
        playerScore.scoreValue -= value;

        playerIdsHistory.value.push(playerId);
        playerScore.scoreHitHistory.push(value);

        checkWinner();
    }

    function wallHit(playerId: number) {

        const playerScore = getScoreByPlayerId(playerId);

        if(playerScore === undefined) {
            return;
        }

        soundEffect.wallSound.play();
        playerScore.scoreValue += 25;
        playerIdsHistory.value.push(playerId);
        playerScore.scoreHitHistory.push(25);
    }



    function undo() {
        soundEffect.undoSound.play();

        const lastActionPlayerId = playerIdsHistory.value.pop();

        if(lastActionPlayerId == undefined) {
            return
        }

        const poppedLastPlayerScore = playersScores.value.find(ps => ps.playerId == lastActionPlayerId);

        if(poppedLastPlayerScore === undefined) {
            return;
        }

        poppedLastPlayerScore.scoreValue += poppedLastPlayerScore.scoreHitHistory.pop() ?? 0;
    }

    return {
        playerIdsHistory,
        playersScores,
        initGame,
        resetGame,
        getScoreByPlayerId,
        playerScore,
        wallHit,
        undo
    }
}, {
    persist: {
        storage: persistedState.localStorage
    }
});