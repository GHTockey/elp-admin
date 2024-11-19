<template>
  <ContentWrap :title="'me333'">

    <div class="flex items-center">
      Menu3:
      <ElInput v-model="text" class="pl-20px" />
    </div>

    <br>

    <div class="mb-4">
      <el-button type="primary" @click="testApi">test</el-button>
    </div>

  </ContentWrap>
</template>

<script setup lang="ts">
  import { ElInput, ElButton } from 'element-plus'
  import { ContentWrap } from '@/components/ContentWrap'
  // import { useI18n } from '@/hooks/web/useI18n'
  import { ref } from 'vue'
  import { getNavsApi } from "@/api/other";
  import * as Rule from '@/utils/rule';
  import SacManage from '@/utils/SacManage';

  defineOptions({
    name: 'Menu3'
  })

  // const { t } = useI18n()

  const text = ref('3333')


  async function testApi() {

    // 测试hasSa
    var admin = {
      'id': 82,
      'auth': "readread------------",
      'sort': null,
      'auth_role': 1,
      'role_id': 0,
      'login': "System",
      'nick': "SYSTEM",
      'last_login_ip': "221.15.171.190",
      'last_login_time': "2024-09-03 20:02:30",
    }

    SacManage.admin = admin;
    var res = SacManage.isSystem();
    console.log('testApiSacManage');
    console.log(res);

    // var hasSaMenth = Rule.isSystem(admin);
    // console.log('testApi');
    // console.log(hasSaMenth)

    // yh-----
    // let res = await getNavsApi()
    // console.log(res)
  }

</script>