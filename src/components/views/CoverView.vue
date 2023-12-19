<template>
    <div class="aspect-[2/3] w-full h-full relative overflow-hidden">
        <img v-if="!failed" class="w-full h-full object-cover" :src="src" @load="onLoad" @error="onError" />
        <div v-if="!loaded" :class="!failed ? 'animate-pulse' : ''"
            class="p-2 flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 z-[1]">
            <SvgView :icon="Icons.play" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SvgView, { Icons } from './SvgView.vue';
defineProps({
    src: String
});
const loaded = ref(false);
const failed = ref(false);

const onLoad = () => {
    loaded.value = true;
};

const onError = () => {
    failed.value = true;
};
</script>
