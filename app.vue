<template>
    <div>
        <NuxtWelcome />
    </div>
</template>

<script lang="ts" setup>
import { useHelloStore } from '~/stores/helloStore'

console.log(useHelloStore().helloDude('michel'));
</script>