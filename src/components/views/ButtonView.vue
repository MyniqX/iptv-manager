<template>
    <button
        :class="vert ? 'flex-col' : 'flex-row'"
        class="p-2 flex gap-2 items-center border border-transparent rounded-lg hover:border-gray-300 hover:shadow-inner  hover:text-black hover:bg-gray-100  dark:hover:bg-gray-700 dark:hover:text-white">
        <SvgView v-if="icon" :icon="icon" :class="iconSize[size]" class="flex-none" />
        <span v-if="title">{{ title }}</span>
        <slot />
    </button>
</template>

<script setup lang="ts">
import SvgView from './SvgView.vue'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

const props = defineProps({
    icon: String,
    title: String,
    size: {
        type: String,
        default: 'sm'
    },
    vert: {
        type: Boolean,
        default: false
    }
});

const iconSize: { [key :string]: string } = {
    'sm': 'w-4 h-4',
    'md': 'w-6 h-6',
    'lg': 'w-8 h-8',
    'xl': 'w-10 h-10'
} as { [key in ButtonSize]: string };

</script>
