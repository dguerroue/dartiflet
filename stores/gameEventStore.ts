import { defineStore } from 'pinia'

export const useGameEventStore = defineStore('gameEvent', () => {
    const isEventStarted = ref(false);
    const eventTime = ref<number>();
    const eventTimerId = ref<NodeJS.Timeout>();
    const eventScore = ref<number|null>(null);

    function generateEventScore() {
        const possibleEventScore = [20, 19, 18, 17, 16, 15];

        const randomIndex = Math.floor(Math.random() * possibleEventScore.length);

        eventScore.value = possibleEventScore[randomIndex];

        return eventScore.value;
    }

    function resetEventScore() {
        eventScore.value = null;
    }

    function startEvent(eventDurationSeconds: number) {
        generateEventScore();
        isEventStarted.value = true;
        
        if(eventDurationSeconds <= 0 || eventDurationSeconds > 59) {
            throw new Error('Invalid event duration, must be between 1 and 59 seconds');
        }

        eventTime.value = eventDurationSeconds;
        new Howl({ src: '/sounds/event.mp3', volume: 0.4}).play();
        
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
            eventTimerId.value = undefined;
        }
    }

    return {
        eventScore,
        eventTime,
        isEventStarted,
        generateEventScore,
        resetEventScore,
        startEvent,
        stopEvent
    }
});