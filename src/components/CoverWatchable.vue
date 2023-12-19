<template>
    <button
        class=" rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div class="relative">

            <CoverView :src="watchable.Logo" :alt="watchable.Name" class="rounded-t-lg" />

            <div class="absolute end-0 top-0 flex flex-col items-center p-3 overflow-hidden">
                <div class="absolute bottom-0 end-0 start-0 top-0 bg-slate-100 opacity-30 blur-xl backdrop-blur-none"></div>
                <SvgView class="z-[1] h-5 w-5" :icon="watchable.TitleIcon" />
                <p class="z-[1] text-ellipsis whitespace-nowrap text-sm font-medium text-black dark:text-white">
                    {{ watchable.Title }}</p>
            </div>

            <div v-if="watchable.ListIcon" class="absolute left-0 top-0 h-24 w-32 overflow-hidden">
                <div
                    class="absolute bottom-0 end-0 start-0 top-0 -translate-x-14 -translate-y-12 -rotate-45 bg-gray-300 opacity-50 blur-sm">
                </div>
                <SvgView class="absolute left-3 top-3 h-5 w-5" :icon="watchable.ListIcon" />
            </div>

            <div v-if="watchable.DateDiff.length > 0"
                class="absolute -left-6 bottom-0 w-auto items-center overflow-hidden">
                <div
                    class="absolute -bottom-10 left-0 right-0 top-0 rounded-full bg-red-600 opacity-50 blur-sm backdrop-blur-sm">
                </div>
                <div class="mx-8 flex p-0.5">
                    <SvgView class="z-[1] mr-1 h-4 w-3" :icon="Icons.flame" />
                    <span class="z-[1] text-ellipsis whitespace-nowrap text-xs text-white">{{ watchable.DateDiff }}</span>
                </div>
            </div>
        </div>
        <div class="p-3">
            <p
                class="text-md overflow-hidden text-ellipsis whitespace-nowrap text-center font-bold tracking-tight text-gray-900 dark:text-white">
                {{ watchable.Name }}</p>
        </div>
    </button>
</template>

<script setup lang="ts">
import { WatchableObject } from '@/structures/viewables/watchables/watchobject';
import SvgView, { Icons } from '@/components/views/SvgView.vue';
import CoverView from './views/CoverView.vue';


const props = defineProps({
    watchable: {
        required: true,
        type: WatchableObject
    },
    selected: Boolean
})
</script>
