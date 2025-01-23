<template>
    <div class="h-full py-5">
        <div class="mb-12 flex items-center dark:text-white">
            <NuxtLink to="/" class="mr-2">
                <ButtonIcon size="32" class="dark:text-white">
                    <template #icon>
                        <IconBack />
                    </template>
                </ButtonIcon>
            </NuxtLink>

            <h1 class="text-2xl font-bold">
                Historique
            </h1>
        </div>

        <div class="flex flex-col space-y-4 overflow-y-auto">
            <div v-for="historyLine in history" :key="historyLine.id" class="rounded-xl bg-slate-800 p-4 dark:text-white">
                <div class="mb-4 flex w-full items-center justify-between">
                    <span class="text-xl font-bold" :class="isToday(historyLine.date) ? 'dark:text-white' : 'text-slate-400'">{{ format(historyLine.date, "MM/dd/yyyy") }}</span>
                    <span class="text-xl font-bold">{{ historyLine.winnerPlayer.name }}</span>
                    <span class="rounded-xl bg-slate-900 px-3 py-1">
                        {{ historyLine.gamemode }}
                    </span>
                </div>

                <div v-for="score, key in historyLine.scores" :key="key" class="flex justify-between py-1">
                    <span class="text-lg" :class="{'winner': score.player.id === historyLine.winnerPlayer.id}">{{ score.player.name }}</span>
                    <span class="text-xl font-bold">{{ score.score }}</span>
                </div>
            </div>
            <!-- {{ historyLine.players }} -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { format, isToday } from 'date-fns';
const historyStore = useHistoryStore();

const history = historyStore.getHistory();
</script>

<style lang="scss" scoped></style>