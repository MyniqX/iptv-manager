<template>
    <li>
        <div class="flex flex-1 flex-row items-center">
            <button class="w-6 h-6 mx-1 flex-none">
                <SvgView v-if="groupObject.Groups.length" class="w-6 h-6" @click="toggle = !toggle"
                    :icon="toggle ? Icons.caret_down : Icons.caret_right" />
            </button>
            <button type="button" @click="passToParent(groupObject)"
                @contextmenu.prevent="showMenu"
                class="items-center p-2 flex  rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700">
                <SvgView :icon="groupObject.GetListIcon"
                    class="w-6 h-6 inline  transition duration-75 group-hover:text-gray-900  dark:group-hover:text-white" />
                <div class="inline ml-3">
                    <p :class="anyELements() ? 'text-inherit' : 'text-gray-400'" class="text-left whitespace-nowrap">
                        {{ groupObject.Name }} <span class="text-blue-800 dark:text-blue-300 text-sm">[{{
                            groupObject.Groups.length + groupObject.Watchables.length }}]</span></p>
                </div>
            </button>
            <div v-if="menuVisible"
                :style="{ top: `${contextMenuPosition.top}px`, left: `${contextMenuPosition.left}px` }"
                class="fixed border border-gray-400 shadow-sm p-1 z-50 rounded-lg bg-white">
                <ul>
                    <li class="p-2 cursor-pointer hover:text-gray-600" @click="handleMenuItemClick('item1')">Item 1</li>
                    <li class="p-2 cursor-pointer" @click="handleMenuItemClick('item2')">Item 2</li>
                </ul>
            </div>
        </div>
        <ul v-if="groupObject.Groups.length && toggle" class="ml-5 space-y-2 w-max border-l-green-600 overflow-auto">
            <SidePanelItem v-for="subGroup in groupObject.Groups" :key="subGroup.Name" :groupObject="subGroup"
                @selectedGroup="passToParent" />
        </ul>
    </li>
</template>


<script setup lang="ts">
import SidePanelItem from "./SidePanelItem.vue"
import { GroupObject } from "@/structures/viewables/groups/groupobject";
import { ref, defineEmits } from "vue";
import SvgView, { Icons } from '@/components/views/SvgView.vue';
import { Toast } from "@/utils/toast";


const emits = defineEmits(["selectedGroup"]);

const passToParent = (data: GroupObject) => {
    emits("selectedGroup", data);
}

const props = defineProps(
    {
        groupObject: {
            required: true,
            type: GroupObject
        }
    }
);


const anyELements = () => {
    return props.groupObject.localCount() > 0;
}


const toggle = ref(false);
const menuVisible = ref(false);
const contextMenuPosition = ref({ top: 0, left: 0 });
const toast = Toast.getInstance();

const showMenu = (event: MouseEvent) => {
    event.preventDefault();
    menuVisible.value = true;
    contextMenuPosition.value = { top: event.clientY, left: event.clientX };
    window.addEventListener('click', hideMenu);
    toast.addToast(`Right click at ${event.clientX}, ${event.clientY} ${event.movementX}, ${event.movementY}`);
}

const hideMenu = () => {
    menuVisible.value = false;
    window.removeEventListener('click', hideMenu);
}

const handleMenuItemClick = (item:any) => {
    toast.addToast(`Clicked: ${item}`);
    hideMenu();
}

</script>
