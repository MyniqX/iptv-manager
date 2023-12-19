<template>
    <div class="fixed right-0 bottom-10 flex flex-col-reverse gap-1 z-50  max-w-md">
        <TransitionGroup name="slide-left">
            <div v-for="[msg, info] of toastList" :key="msg"
                class="flow flow-row py-2 pl-2 pr-10 gap-2 transition-opacity bg-opacity-70 bg-gray-200 dark:bg-gray-800 border-gray-500 border-l border-t border-b rounded-tl-2xl rounded-bl-2xl">
                <div class="flex flex-row items-center">
                    <SvgView :icon="info.icon" class="w-6 h-6 m-3 flex-none" />
                    <div class="flex flex-col gap-2 p-3 overflow-hidden">
                        <span v-if="info.title" class="text-lg font-semibold">{{ info.title }}</span>
                        <span class="whitespace-break-spaces break-all mr-4"> {{ info.message }}</span>
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import SvgView, { Icons } from './views/SvgView.vue';
import { Toast } from '@/utils/toast';

const toast = Toast.getInstance();
const toastList = toast.toastList;
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.5s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.5s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-top-enter-active,
.slide-top-leave-active {
    transition: all 0.5s ease;
}

.slide-top-enter-from,
.slide-top-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
    transition: all 0.5s ease;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
