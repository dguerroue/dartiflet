<template>
    <div class="group relative flex cursor-pointer items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
        <!-- initial state -->
        <span class="absolute" :class="$slots['icon-hover'] ? 'group-hover:opacity-0' : ''">
            <slot name="icon"></slot>
        </span>

        <!-- hover state -->
        <span v-if="$slots['icon-hover']"
              class="absolute cursor-pointer opacity-0 group-hover:opacity-100 group-active:opacity-100">
            <slot name="icon-hover"></slot>
        </span>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
  size: string
}>();
</script>