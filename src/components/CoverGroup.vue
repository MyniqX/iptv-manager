<template>
    <button @click="selectGroup"
        class="aspect-[2/3] relative h-full rounded-lg border border-gray-200 shadow-md dark:border-gray-700 overflow-hidden">
        
            <div class="flex flex-wrap rounded-t-lg opacity-50">
                <div :class="wClass" v-for="cover in imageList" :key="cover.Logo" class="relative">
                    <CoverView :src="cover.Logo" :alt="cover.Name" />
                    <div v-if="cover.isHot" class="absolute bottom-0 left-0">
                        <div class="absolute bottom-0 left-0 right-0 top-0 bg-gray-300 blur-sm opacity-50"></div>
                        <SvgView class="w-4 h-4" :icon="Icons.flame" />
                    </div>
                </div>
                <CoverView v-if="imageList.length === 0" src="localhost" />
            </div>

            <div class="absolute end-0 top-0 flex flex-col items-center p-3 overflow-hidden">
                <div class="absolute bottom-0 end-0 start-0 top-0 bg-gradient-to-br from-slate-200 dark:from-slate-700 opacity-50 blur-sm backdrop-blur-none"></div>
                <SvgView class="z-10 h-5 w-5" :icon="groupObject.GetListIcon" />
                <p v-if="false" class="z-10 text-ellipsis whitespace-nowrap text-sm font-medium">
                    Group
                </p>
            </div>

            <div class="absolute bottom-0 left-0 right-0 top-0 flex z-0 items-center justify-center">
                <div class="relative p-6">
                    <div
                        class="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-gradient-to-br from-slate-200 dark:from-slate-700 opacity-50 blur-sm">
                    </div>
                    <div class="text-center text-2xl font-bold tracking-tight">
                        {{ groupObject.Name }}
                    </div>
                </div>
            </div>
        </button>
</template>

<script setup lang="ts">
import { GroupObject } from '@/structures/viewables/groups/groupobject';
import CoverView from '@/components/views/CoverView.vue';
import SvgView, { Icons } from '@/components/views/SvgView.vue';

const props = defineProps({
    groupObject: {
        type: GroupObject,
        required: true
    }
})

const emits = defineEmits(["onSelectGroup"]);

const selectGroup = () => {
    emits("onSelectGroup", props.groupObject);
}

const templist = props.groupObject.getImageList();
const imageList = templist.length >= 9 ? templist : templist.length > 4 ? templist.slice(0, 4) : templist.slice(0, 1);
const wClass = imageList.length == 9 ? "w-1/3" : imageList.length == 4 ? "w-1/2" : "";


</script>
