<template>
    <div class="dark:text-white">
        <pre>{{ gameStore.game }}</pre>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'default',
    middleware: 'has-game'
});

const gameStore = useGameStore();
</script>

<style lang="scss" scoped></style>