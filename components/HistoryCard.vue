<template>
    <div class="relative flex select-none flex-col gap-3 overflow-hidden rounded-xl bg-slate-800 p-4 text-white"
         @mousedown="!isMobile() && onHistoryCardClickDown()"
         @mouseup="!isMobile() &&onHistoryCardClickUp()"
         @touchstart="onHistoryCardClickDown()"
         @touchend="onHistoryCardClickUp()">
        <div class="absolute left-0 top-0 z-0 h-full bg-red-700" :style="{width: removingWIdthPercent}"></div>
        <div class="relative z-10 flex w-full justify-between">
            <span class="font-bold text-slate-200">{{ format(historyItem.date, dateFormat) }}</span>

            <span class="flex items-center text-xl font-bold">
                <IconMedal size="17" class="mr-1 text-yellow-400" />
                {{ historyItem.winnerPlayer.name }}
            </span>
        </div>

        <div>
            <span class="relative z-10 rounded-xl bg-slate-900 px-3 py-2 text-sm">
                {{ historyItem.gamemode }}<span v-if="historyItem.variant"> - {{ historyItem.variant }}</span>
            </span>
        </div>

        <div class="relative z-10">
            <div v-for="score, key in historyItem.scores" :key="key" class="flex justify-between py-1">
                <span class="text-lg" :class="{'winner font-semibold': score.player.id === historyItem.winnerPlayer.id}">{{ score.player.name }}</span>
                <span class="text-xl font-bold">{{ score.score }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';

const props = defineProps<{
    historyItem: HistoryItem,
    dateFormat: string
  }>();

const clickTimerId = ref<NodeJS.Timeout | null>(null);
const clickTime = ref<number>(0);
const removingWIdthPercent = computed(() => {
    return `${clickTime.value / 2}%`;
})

function isMobile() {
    return window.matchMedia("(max-width: 1024px)").matches || ("ontouchstart" in window || navigator.maxTouchPoints > 0);
};

function removeHistoryItem() {
    useHistoryStore().removeHistoryRecord(props.historyItem.date);
}

function onHistoryCardClickDown() {
    clickTimerId.value = setInterval(() => {
        clickTime.value += 1;
        if (clickTime.value >= 200 && clickTimerId.value) {
            clearInterval(clickTimerId.value);
            clickTimerId.value = null;
            clickTime.value = 0;
            removeHistoryItem();
        }
    }, 10);
}

function onHistoryCardClickUp() {
    if (clickTimerId.value) {
        clearInterval(clickTimerId.value);
        clickTimerId.value = null;
        clickTime.value = 0;
    }
}
</script>

<style lang="scss" scoped></style>