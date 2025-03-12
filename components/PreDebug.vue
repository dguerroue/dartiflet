<template>
    <pre class="pointer-events-none fixed right-0 top-0 z-50 border-2 border-red-700 bg-white/75 p-4 text-black">{{ data }}</pre>
</template>

<script lang="ts" setup>
defineProps({
    data: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped></style>