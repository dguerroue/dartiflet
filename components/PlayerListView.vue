<template>
    <div class="my-8">
        <div v-for="player in playerStore.players" :key="player.id">
            <div class="my-4 flex items-center justify-between rounded-md border-2 border-white pl-4 font-bold text-white">
                {{ player.name }}

                <button type="button" class="p-4" @click="playerStore.removePlayer(player.id)">
                    <IconXmark />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const playerStore = usePlayerStore();
</script>

<style lang="scss" scoped></style>