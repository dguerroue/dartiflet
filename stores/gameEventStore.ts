import { min } from 'date-fns';
import { defineStore } from 'pinia'

export const useGameEventStore = defineStore('gameEvent', () => {
    const isEventStarted = ref(false);
    const isEventHurryUp = ref(false);
    const eventTime = ref<number>();
    const eventScoreTarget = ref<number|null>(null);
    
    const clockIntervalId = ref<NodeJS.Timeout>();
    const clockValue = ref<number>(0);
    const nextEventClockValue = ref<number|null>(null);

    const defaultMinIntervalSeconds = 40;
    const defaultMaxIntervalSeconds = 120;
    const defaultEventDurationSeconds = 35;

    const defaultPossibleEventScore = [20, 19, 18, 17, 16, 15];
    const possibleEventScore = ref<number[]>(defaultPossibleEventScore);

    const { newEventSound } = useSoundEffect();

    function startClock() {
        if(clockIntervalId.value) {
            console.warn('Clock already started');
            return;
        }
        clockIntervalId.value = setInterval(() => {
            clockValue.value += 1;

            if(isEventStarted.value) {
                // manage current event
                if(eventTime.value !== undefined) {
                    eventTime.value -= 1;
    
                    if (eventTime.value == 6) {
                        isEventHurryUp.value = true;
                        useSoundEffect().endEventSound.play();
                    }
                    
                    if (eventTime.value <= 0) {
                        stopAndResetEvent();
                    }
                }
            } else if(!nextEventClockValue.value) {
                const [nexEventTime] = getNextEventTime(clockValue.value);

                nextEventClockValue.value = nexEventTime;

            } else {
                if(clockValue.value >= nextEventClockValue.value) {
                    startRandomEvent();
                }
            }
        }, 1000);
    }

    /**
     * Stop the clock and reset event values
     */
    function stopClock() {
        clearInterval(clockIntervalId.value);
        clockIntervalId.value = undefined;

        clockValue.value = 0;
        stopAndResetEvent();
    }

    /**
     * Get the next event time and the time in second remaining until the next event
     * 
     */
    function getNextEventTime(offsetSeconds: number): [number, Date] {
        const minSeconds = defaultMinIntervalSeconds;
        const maxSeconds = defaultMaxIntervalSeconds;

        const randSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds) + minSeconds);

        const nextEventDate = new Date(Date.now() + (offsetSeconds + randSeconds) * 1000);
        const nextEventTime = offsetSeconds + randSeconds;

        console.log(`Next event at: ${new Date(Date.now() + randSeconds * 1000).toTimeString().slice(0, 8) }, in: ${(randSeconds)}s `);

        return [nextEventTime, nextEventDate];
    }

    function startRandomEvent() {
        const minSeconds = defaultMinIntervalSeconds;
        const maxSeconds = defaultMaxIntervalSeconds;
        const eventDurationSeconds = defaultEventDurationSeconds;

        console.log({
            minSeconds,
            maxSeconds,
            eventDurationSeconds,
        })
        
        if(isEventStarted.value) {
            return;
        }

        // pick one score randomly
        const randomIndex = Math.floor(Math.random() * possibleEventScore.value.length);
        eventScoreTarget.value = possibleEventScore.value[randomIndex];

        isEventStarted.value = true;
        
        if(eventDurationSeconds <= 0 || eventDurationSeconds > 59) {
            throw new Error('Invalid event duration, must be between 1 and 59 seconds');
        }

        eventTime.value = eventDurationSeconds;
        newEventSound.play();
    }

    function stopAndResetEvent() {
        isEventStarted.value = false;

        isEventHurryUp.value = false;
        eventScoreTarget.value = null;
        nextEventClockValue.value = null;
    }

    return {
        eventScoreTarget,
        eventTime,
        isEventStarted,
        isEventHurryUp,
        possibleEventScore,
        startClock,
        stopClock
    }
});