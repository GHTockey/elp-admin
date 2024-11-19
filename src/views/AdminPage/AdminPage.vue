<template>
  <!-- <div class="bg-blue p-3 px-10 rounded-10">
        <h3>AdminPage</h3>
        <p>params 参数：{{ $route.params }}</p>
        <p>query 参数：{{ $route.query }}</p>
        <p>mate 参数: {{ $route.meta }}</p>
    </div> -->
  <div class="admin-page">
    <TablePage v-if="pageType == 'table'" />
    <CmdPage v-else-if="pageType == 'cmd'"></CmdPage>
    <InfoListPage v-else-if="pageType == 'infoList'"></InfoListPage>
  </div>
</template>

<script lang="ts" setup>
// import { ContentWrap } from "@/components/ContentWrap";
import { ref, unref } from 'vue';
import { useRoute } from 'vue-router';
import TablePage from "../Table/Table.vue";
import InfoListPage from "../InfoListPage/InfoListPage.vue";
import CmdPage from "../CmdPage/CmdPage.vue";
import { determinePageType } from '@/utils';
import router from '@/router';

const route = useRoute();

// 页面类型
const pageType = ref<'table' | 'cmd' | 'infoList'>();


// 存储 query 参数并确定页面类型
if (route.query.url) {
  const queryParams = route.query.url as string;
  pageType.value = determinePageType(queryParams);
  console.log('页面类型:', pageType.value);
} else {
  // console.log(JSON.parse(JSON.stringify(unref(route))), 666);

  // 如果存在 redirectedFrom 参数，则跳转到该参数指定的路径
  if (route.redirectedFrom) {
    router.push(route.redirectedFrom)
  } else {
    // 否则跳转到 unknownPage
    router.push('/unknownPage');
  }
}
</script>
