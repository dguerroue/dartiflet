<template>
    <div>
        <form class="flex flex-col gap-5" @submit.prevent="onAddPlayer">
            <label for="player"
                   class="relative block overflow-hidden rounded-lg border border-gray-700 bg-gray-800 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <input id="player"
                       v-model="formData.playerName"
                       type="text"
                       placeholder="Ajouter un joueur"
                       required="true"
                       class="peer h-8 w-full border-none bg-transparent p-0 text-white placeholder:text-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm" />

                <span class="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-200 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                    Ajouter un joueur
                </span>
            </label>

            <button type="submit" class="inline-block rounded-lg border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500">
                Ajouter
            </button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import type { Player } from '~/stores/playerStore';

const playerStore = usePlayerStore();

const formData = reactive({
    playerName: ''
})

function onAddPlayer(e: Event) {
    playerStore.addPlayer(formData.playerName);

    formData.playerName = ''
}
</script>

<style lang="scss" scoped></style>