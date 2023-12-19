<template>
    <button @click="model = !model"
        class="flex flex-row border border-gray-200 rounded-lg dark:bg-transparent dark:border-gray-600 dark:text-white">
        <div class="flex-grow p-6">
            <slot />
        </div>
        <div class="flex-shrink p-6">
            <label class="w-fit relative inline-flex items-center cursor-pointer">
                <input :disabled="disabled"
                @change="model = !model"
                :checked="model" type="checkbox" class="sr-only peer" />
                <span :class="[toggleClasses, toggleSize, toggleColor]"></span>
            </label>
        </div>
    </button>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
const props = defineProps({
    disabled: Boolean,
    modelValue: Boolean
})

const model = ref(props.modelValue);

watch(model, (val: boolean) => {
    model.value = val;
    emit('update:modelValue', val);
})

const emit = defineEmits(['update:modelValue']);

const { toggleSize, toggleClasses, toggleColor } = {
    toggleSize: 'w-11 h-6 after:top-[2px] after:left-[2px] after:h-5 after:w-5',
    toggleClasses: 'bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600',
    toggleColor: 'peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:bg-green-600',
};

</script>
