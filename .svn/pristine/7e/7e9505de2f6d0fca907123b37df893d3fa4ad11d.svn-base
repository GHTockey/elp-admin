<template>
    <div class="unknown-page">
        <el-alert type="error" description="这个页面还未适配" show-icon>
        </el-alert>
        <div v-if="data" class=" bg-white p-4 mt-5"> {{ data }}</div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
// 导入组件
import { ElAlert, ElButton } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import request from "@/axios";
const router = useRouter();
const route = useRoute();

const data = ref();

onMounted(async () => {
    await getPageData();
});

async function getPageData() {
    const url = route.query.url;
    if (!url) return;
    const res = await request.get({ url: url });
    data.value = res.data;
}
</script>

<style scoped>

</style>
