<template>
    <Dialog v-model="internalValue" :title="title" style="min-width: 800px;" >
        <!-- 这里可以添加具体的搜索条件表单内容 -->
        <TableComponent :tableSelectDataReception="tableSelectDataReception" />
    </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Dialog } from '@/components/Dialog';
import TableComponent from './TableComponent.vue';

const props = defineProps({
    modelValue: Boolean,
    title: String,
    // idFieldName: String,
    tableSelectDataReception: Object,
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    internalValue.value = newValue;
});

watch(internalValue, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>