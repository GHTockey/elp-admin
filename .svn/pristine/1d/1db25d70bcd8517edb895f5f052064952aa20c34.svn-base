<script setup lang="ts">
import { computed, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { useDesign } from '@/hooks/web/useDesign'

import { getNavsApi } from "@/api/other";
import SacManage from '@/utils/SacManage';
import { usePermissionStore } from '@/store/modules/permission';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const { getPrefixCls } = useDesign();

const prefixCls = getPrefixCls('app');

const appStore = useAppStore();

const currentSize = computed(() => appStore.getCurrentSize);

const greyMode = computed(() => appStore.getGreyMode);

appStore.initTheme();



// ; (async () => {
//   // 这里调用是为了提前获取 admin 数据
//   let { data } = await getNavsApi();
//   // console.log(data);
//   const userStore = useUserStore();
//   // 判断userStore

//   const permissionStore = usePermissionStore();
//   const { admin } = storeToRefs(permissionStore);
//   admin.value = data.admin;
//   SacManage.admin = permissionStore.admin;
//   SacManage._adminRoleTableList = permissionStore.admin_role_table_list;
// })();


// 监听 userStore.userInfo 的变化, 发生变化就给 SacManage.admin 赋值
watch(() => userInfo?.value, () => {
  // console.log('userInfo 发生变化');
  SacManage.admin = userInfo?.value || {};
});
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="less">
@prefix-cls: ~'@{namespace}-app';

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}




// 弹窗选择框的输入框样式
.popup-select-input {
  // width: 150px !important;

  // 左边框距
  // .el-input-group__prepend {
  //   padding: 0 10px !important;
  //   background-color: transparent;
  // }
  // 右边距
  // .el-input-group__append {
  //   padding: 0 15px !important;
  // }
  // 输入框
  .el-input__inner {
    width: 50px !important;
  }
  // 输入框头部内容
  // .el-input__prefix-inner {
  //   // background-color: red;
  // }
}
</style>
