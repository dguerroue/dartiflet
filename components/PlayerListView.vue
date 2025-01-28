<template>
    <div class="my-8">
        <div v-for="player in playerStore.players" :key="player.id">
            <div class="my-4 flex items-center justify-between rounded-lg border-2 border-white pl-4 font-bold text-white">
                <span class="flex items-center gap-2 text-xl">
                    <IconPlayer size="18" />
                    {{ player.name }}
                </span>

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