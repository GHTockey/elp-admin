<template>
    <ContentWrap>
        <EditComponent :uri="(route.query.uri as string)" :is-edit="isEdit" :show-back="true" />
    </ContentWrap>

</template>

<script setup lang="ts">
import { ContentWrap } from "@/components/ContentWrap";
import { useRoute } from "vue-router";
import EditComponent from "@/components/MyComponent/EditComponent.vue";
import { ref } from "vue";

const route = useRoute();

// 判断是添加还是编辑
const isEdit = ref(false);
if (route.query.id && route.query.uri?.includes('edit')) {
    isEdit.value = true;
}
</script>
