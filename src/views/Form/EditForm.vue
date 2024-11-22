<template>
    <ContentWrap>
        <!-- <EditComponent :uri="(route.query.uri as string)" :is-edit="isEdit" :show-back="true" /> -->
        <EditComponent :uri="((route.query.uri || route.query.url) as string)" :is-edit="isEdit" :show-back="true" />
    </ContentWrap>

</template>

<script setup lang="ts">
import { ContentWrap } from "@/components/ContentWrap";
import { useRoute } from "vue-router";
import EditComponent from "@/components/MyComponent/EditComponent.vue";
import { ref } from "vue";

// const props = defineProps<{
//     isEdit: boolean
// }>();
const route = useRoute();

// 判断是添加还是编辑
const isEdit = ref(false);
// TODO: 这里需要优化，不能根据uri判断，应判断uri返回的数据 target ?
if (route.query.id && (route.query.url?.includes('edit') || route.query.uri?.includes('edit'))) {
    isEdit.value = true;
}
isEdit.value ? console.log('前往编辑') : console.log('前往添加')

</script>
