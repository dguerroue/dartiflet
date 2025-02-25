import { min } from 'date-fns';
import { defineStore } from 'pinia'

export const useGameEventStore = defineStore('gameEvent', () => {
    const isEventStarted = ref(false);
    const isEventHurryUp = ref(false);
    const eventTime = ref<number>();
    const eventScore = ref<number|null>(null);
    // const eventTimeoutId = ref<NodeJS.Timeout>();
    // const eventLoopTimeoutId = ref<NodeJS.Timeout>();
    const eventTimeoutIdCollection = ref<NodeJS.Timeout[]>([]);
    const eventLoopTimeoutIdCollection = ref<NodeJS.Timeout[]>([]);
    // const endCountEventTimeoutId = ref<NodeJS.Timeout>();

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
        minSeconds = 40,
        maxSeconds = 120,
        eventDurationSeconds = 35,
        scores = [20, 19, 18, 17, 16, 15]
    }: {
        minSeconds?: number,
        maxSeconds?: number,
        eventDurationSeconds?: number,
        scores?: number[]
    } = {}) {
        console.log({
            minSeconds,
            maxSeconds,
            eventDurationSeconds,
        })
        const randTimeout = Math.floor(Math.random() * (maxSeconds - minSeconds) + minSeconds);

        console.log(`Next event in: ${(randTimeout + eventDurationSeconds)}s at: ${new Date(Date.now() + (randTimeout + eventDurationSeconds) * 1000).toTimeString().slice(0, 8) }`);

        eventLoopTimeoutIdCollection.value.push(setTimeout(() => {
            if(!isEventStarted.value) {
                stopEvent();
                startEvent(eventDurationSeconds, scores);
            }

            startRandomEventLoop({
                minSeconds: minSeconds,
                maxSeconds: maxSeconds,
                eventDurationSeconds: eventDurationSeconds, 
                scores: scores
            });


            // start new event
        }, (randTimeout + eventDurationSeconds) * 1000));

    }

    function stopRandomEventLoop() {
        stopEvent();
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
        
        eventTimeoutIdCollection.value.push(setInterval(() => {
            if(eventTime.value !== undefined) {
                eventTime.value -= 1;

                if (eventTime.value == 6) {
                    isEventHurryUp.value = true;
                    useSoundEffect().endEventSound.play();
                }
                
                if (eventTime.value <= 0) {
                    stopEvent();
                }
            }
        }, 1000));
    }

    function stopEvent() {
        resetEventScore();
        isEventStarted.value = false;
        isEventHurryUp.value = false;

        eventLoopTimeoutIdCollection.value.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        eventTimeoutIdCollection.value.forEach(timeoutId => {
            clearInterval(timeoutId);
        });

        eventLoopTimeoutIdCollection.value = [];
        eventTimeoutIdCollection.value = [];
    }

    return {
        eventTimeoutIdCollection,
        eventLoopTimeoutIdCollection,
        eventScore,
        eventTime,
        isEventStarted,
        isEventHurryUp,
        generateEventScore,
        resetEventScore,
        startRandomEventLoop,
        stopRandomEventLoop,
        startEvent,
        stopEvent
    }
});