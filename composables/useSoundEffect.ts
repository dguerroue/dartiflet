import { Howl } from 'howler';

let instance: ReturnType<typeof createSoundEffect> | null = null;

function createSoundEffect() {
    const dartSound1 = new Howl({ src: '/sounds/dart1.mp3', volume: 0.4 });
    const dartSound2 = new Howl({ src: '/sounds/dart2.mp3', volume: 0.4 });
    const dartSound3 = new Howl({ src: '/sounds/dart3.mp3', volume: 0.4 });

    const wallSound = new Howl({ src: '/sounds/turtle_scream.mp3', volume: 2 });
    const undoSound = new Howl({ src: '/sounds/undo.mp3', volume: 0.3 });

    const newEventSound = new Howl({ src: '/sounds/event.mp3', volume: 0.6 });
    const endEventSound = new Howl({ src: '/sounds/countdown-beep-5s.mp3', volume: 0.6 });

    return {
        dartSound1,
        dartSound2,
        dartSound3,
        wallSound,
        undoSound,
        newEventSound,
        endEventSound
    };
}

export function useSoundEffect() {
    if (!instance) {
        instance = createSoundEffect();
    }

    return instance;
}