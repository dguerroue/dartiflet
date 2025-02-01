import { defineStore } from 'pinia'

export const useGameEventStore = defineStore('gameEvent', () => {
    const isEventStarted = ref(false);
    const eventTime = ref<number>();
    const eventTimerId = ref<NodeJS.Timeout>();
    const eventScore = ref<number|null>(null);
    const clockEventId = ref<NodeJS.Timeout>();

    const { newEventSound } = useSoundEffect();

    function generateEventScore(scores: number[]) {
        const randomIndex = Math.floor(Math.random() * scores.length);

        eventScore.value = scores[randomIndex];

        return eventScore.value;
    }

    function resetEventScore() {
        eventScore.value = null;
    }

    function startRandomEventLoop({
        minSeconds,
        maxSeconds,
        eventDurationSeconds,
        scores
    }: {
        minSeconds?: number,
        maxSeconds?: number,
        eventDurationSeconds?: number,
        scores?: number[]
    } = {
        minSeconds: 40,
        maxSeconds: 120,
        eventDurationSeconds: 40,
        scores: [20, 19, 18, 17, 16, 15]
    }) {
        const randTimeout = Math.floor(Math.random() * (maxSeconds - minSeconds) + minSeconds);
        console.log('Next event in: ', randTimeout);
        clockEventId.value = setTimeout(() => {
            if(!isEventStarted.value) {
                stopEvent();
                startEvent(eventDurationSeconds, scores);
            }
            startRandomEventLoop({
                minSeconds: eventDurationSeconds + minSeconds,
                maxSeconds: maxSeconds,
                eventDurationSeconds: eventDurationSeconds, 
                scores: scores
            });
        }, randTimeout * 1000);
    }

    function stopRandomEventLoop() {
        if (clockEventId.value) {

            stopEvent();
            clearTimeout(clockEventId.value);
        }
    }

    function startEvent(eventDurationSeconds: number, scores: number[]) {
        if(isEventStarted.value) {
            return;
        }

        generateEventScore(scores);
        isEventStarted.value = true;
        
        if(eventDurationSeconds <= 0 || eventDurationSeconds > 59) {
            throw new Error('Invalid event duration, must be between 1 and 59 seconds');
        }

        eventTime.value = eventDurationSeconds;
        newEventSound.play();
        
        eventTimerId.value = setInterval(() => {
            if(eventTime.value !== undefined) {
                eventTime.value -= 1;
                
                if (eventTime.value <= 0) {
                    stopEvent();
                }
            }
        }, 1000);
    }

    function stopEvent() {
        resetEventScore();
        isEventStarted.value = false;

        if (eventTimerId.value) {
            clearInterval(eventTimerId.value);
        }
    }

    return {
        eventScore,
        eventTime,
        isEventStarted,
        generateEventScore,
        resetEventScore,
        startRandomEventLoop,
        stopRandomEventLoop,
        startEvent,
        stopEvent
    }
});