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
    <InfoListPage v-else-if="pageType == 'enum'"></InfoListPage>
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
import request from '@/axios';

const route = useRoute();

// uri 返回的数据
const uriData = ref<any>(null);
// 页面类型
const pageType = ref<'table' | 'cmd' | 'enum' | 'form'>();


// 存储 query 参数并确定页面类型
; (async () => {
  if (route.query.url) {
    const queryParams = route.query.url as string;

    await getUriData(queryParams);

    pageType.value = determinePageType(queryParams, uriData.value);
    console.log('页面类型:', pageType.value, uriData.value?.form_load_view_file);
    // 如果是 form 类型，则跳转
    if (pageType.value == 'form') {
      router.push(`/form/edit?uri=${queryParams}`);
    }
  } else {
    if (route.redirectedFrom) {
      router.push(route.redirectedFrom)
    } else {
      router.push('/unknownPage');
    }
  }
})();


async function getUriData(uri: string) {
  let res = await request.get({ url: uri });
  if (res.code == 0) {
    uriData.value = res.data;
  } else {
    console.debug(res.msg);
  }
}
</script>
