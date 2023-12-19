<template>
    <div class="relative">
        <div class="grid grid-cols-2 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-4">
            <CoverGroupVue v-for="group in groupObject.Groups" :key="groupObject.Name + group.Name" :groupObject="group"
                @onSelectGroup="onSelectGroup(group)" />
        </div>
        <div class="grid grid-cols-2 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-4">
            <CoverWatchableVue v-for="item in groupObject.Watchables" :key="item.Url" :watchable="item"
                class="transition-all duration-300" @click="onSelectWatchable(item)" />
        </div>
    </div>
</template>


<script setup lang="ts">
import { GroupObject } from '@/structures/viewables/groups/groupobject';
import { WatchableObject } from '@/structures/viewables/watchables/watchobject';
import CoverGroupVue from './CoverGroup.vue';
import CoverWatchableVue from './CoverWatchable.vue';
import { ref } from 'vue';
import CoverView from './views/CoverView.vue';
const props = defineProps({
    groupObject: {
        type: GroupObject,
        required: true
    }
});


const emits = defineEmits([
    "onGroupSelected",
    "onWactableSelected"
]);

const onSelectGroup = (group: GroupObject) => {
    emits("onGroupSelected", group);
}

const onSelectWatchable = (watchable: WatchableObject) => {
    emits('onWactableSelected', watchable);
}
</script>
