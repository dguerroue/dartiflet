<template>
    <div class="flex flex-col gap-3 rounded-xl bg-slate-800 p-4 text-white">
        <div class="flex w-full justify-between">
            <span class="font-bold text-slate-200">{{ format(historyItem.date, dateFormat) }}</span>
            <span class="flex items-center text-xl font-bold">
                <IconMedal size="17" class="mr-1 text-yellow-400" />
                {{ historyItem.winnerPlayer.name }}
            </span>
        </div>

        <div>
            <span class="rounded-xl bg-slate-900 px-3 py-2 text-sm">
                {{ historyItem.gamemode }}<span v-if="historyItem.variant"> - {{ historyItem.variant }}</span>
            </span>
        </div>

        <div>
            <div v-for="score, key in historyItem.scores" :key="key" class="flex justify-between py-1">
                <span class="text-lg" :class="{'winner font-semibold': score.player.id === historyItem.winnerPlayer.id}">{{ score.player.name }}</span>
                <span class="text-xl font-bold">{{ score.score }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';

defineProps<{
    historyItem: HistoryItem,
    dateFormat: string
  }>();
</script>

<style lang="scss" scoped></style>