<template>
  <ContentWrap class="cmd-page">
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="名称" width="150">
        </el-table-column>
        <el-table-column prop="actions" label="操作">
          <template #default="scope">
            <div class="flex flex-wrap items-center">
              <el-button-group>
                <el-button v-for="(url, buttonName) in scope.row.actions" :key="buttonName"
                  @click="cmdGroupsHandler(scope.row.field, url)" class="mr-2 mb-2">{{ buttonName }}</el-button>
              </el-button-group>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ContentWrap } from "@/components/ContentWrap";
import { ref } from 'vue';
import { getCmdsDataApi } from '@/api/other';
import { ElTable, ElTableColumn, ElButton, ElButtonGroup, ElMessage } from 'element-plus';
import request from '@/axios';

import router from "@/router";
import { SUCCESS_CODE } from "@/constants";
import { useTagsViewStore } from "@/store/modules/tagsView";

const tagsViewStore = useTagsViewStore()
const tableData = ref([])


getData()



async function cmdGroupsHandler(cmd: string, url: string) {
  if (cmd == 'cmd_groups_blank') {
    openInNewTab(url)
  } else if (cmd == 'cmd_groups_form') {
    goToFormPage(url)
  } else if (cmd == 'cmd_groups') {
    let res = await request.get({ url })
    if (res.code != SUCCESS_CODE) return ElMessage.error(res.msg)
    ElMessage.success(res.msg)
  }
}


// 打开新标签页
function openInNewTab(url: string) {
  window.open(url, '_blank');
}

// 跳转表单页
function goToFormPage(url: string) {
  // console.log(url)
  router.push('/form/edit?uri=' + url)
}

// 获取数据
async function getData() {
  const res = await getCmdsDataApi()
  let d = typeof res.data == 'string' ? JSON.parse(res.data as unknown as string) : res.data

  // 遍历指定的字段  cmd_groups异步请求，结果提示  cmd_groups_blank新页面打开url  cmd_groups_form 跳转表单页
  const targetFields = ['cmd_groups', 'cmd_groups_blank', 'cmd_groups_form'];

  for (const field of targetFields) {
    if (d[field]) {
      // 遍历每个组中的键值对
      for (const key in d[field]) {
        // 将每个键值对添加到tableData数组中
        tableData.value.push({
          name: key, // 键作为名称
          actions: d[field][key], // 值作为操作
          field: field
        });
      }
    }
  }

  // 将路由添加到标签栏
  router.currentRoute.value.meta.title = '常用命令'
  tagsViewStore.addVisitedView({ // 不缓存
    ...router.currentRoute.value,
  })
  // 设置标题
  document.title = '常用命令'
}

</script>
