<template>
  <ContentWrap>
    <el-table :data="relativeStaticList" style="width: 100%">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column v-for="(value, key) in relativeStaticList[0]" :key="key" :prop="key" :label="key">
        <template #default="{ row }">
          <el-tag v-for="(item, index) in splitRelativeStatic(row.relative_static)" :key="index" class="mx-1">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElTable, ElTableColumn, ElTag } from 'element-plus';
import { ContentWrap } from "@/components/ContentWrap";
import { getRelativeStaticApi } from "@/api/table/tableApi";
import { SUCCESS_CODE } from '@/constants';
import router from '@/router';
import { useTagsViewStore } from "@/store/modules/tagsView";

const tagsViewStore = useTagsViewStore()

const relativeStaticList = ref([]);

getRelativeStaticHandler();

async function getRelativeStaticHandler() {
  try {
    const response = await getRelativeStaticApi();
    if (response.code == SUCCESS_CODE) {
      relativeStaticList.value = response.data.relative_static_list;
      // console.log(response.data,333);





      // 将路由添加到标签栏
      router.currentRoute.value.meta.title = '系统枚举值'
      tagsViewStore.addVisitedView({ // 不缓存
        ...router.currentRoute.value,
      })
      // 设置标题
      document.title = '系统枚举值'
    } else {
      console.error('获取相对静态数据失败:', response.msg);
    }
  } catch (error) {
    console.error('获取相对静态数据时发生错误:', error);
  }
}



// 将相对静态字符串拆分为数组
// 参数:
//   relativeStatic: 包含多个选项的字符串,选项之间用分号分隔
// 返回值:
//   拆分后的选项数组,去除了空白项
const splitRelativeStatic = (relativeStatic: string) => {
  return relativeStatic.split(';').filter(item => item.trim() !== '');
};
</script>
