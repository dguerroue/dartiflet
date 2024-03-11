<template>
    <div class="py-5">
        <div class="mb-4 dark:text-white">
            <h1 class="text-2xl font-bold">
                Dartiflet
            </h1>
        </div>
        <PlayerListView />
        <PlayerAddForm />
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'default'
});
</script>

<style lang="scss" scoped></style>