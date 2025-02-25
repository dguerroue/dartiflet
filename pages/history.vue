<template>
    <div class="h-full py-5">
        <div class="mb-12 flex items-center text-white">
            <NuxtLink to="/" class="mr-2">
                <ButtonIcon size="32" class="text-white">
                    <template #icon>
                        <IconBack />
                    </template>
                </ButtonIcon>
            </NuxtLink>

            <h1 class="text-2xl font-bold">
                Historique
            </h1>
        </div>

        <div class="flex flex-col gap-14 overflow-y-auto">
            <div class="flex flex-col gap-4">
                <p class="text-lg font-bold text-slate-400">
                    Aujourd'hui
                </p>
                <HistoryCard v-for="historyLine, index in historyStore.historyToday"
                             :key="index"
                             :history-item="historyLine"
                             date-format="H:mm" />
            </div>

            <div class="flex flex-col gap-4">
                <p class="text-lg font-bold text-slate-400">
                    Autres parties
                </p>
                <HistoryCard v-for="historyLine, index in historyStore.historyPast"
                             :key="index"
                             :history-item="historyLine"
                             date-format="dd/MM/yyyy - H:mm" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const historyStore = useHistoryStore();
</script>

<style lang="scss" scoped></style>