import { defineStore } from 'pinia'

export const useHelloStore = defineStore('hello', () => {
    const message = 'hello';

    function helloDude(dude: string) {
        return `${message} ${dude} !`
    }
    return { message, helloDude }
});