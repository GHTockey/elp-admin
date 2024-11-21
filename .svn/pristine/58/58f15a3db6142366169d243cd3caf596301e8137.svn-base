<script lang="tsx">
import { computed, defineComponent, unref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Backtop } from '@/components/Backtop'
import { Setting } from '@/components/Setting'
import { useRenderLayout } from './components/useRenderLayout'
import { useDesign } from '@/hooks/web/useDesign'

import { getNavsApi } from "@/api/other";
import type { CodingNavGroup, NavData } from '@/api/other/types';
import { transformToAppRouteRecordRaw } from '@/utils'
import { asyncRouterMap } from '@/router'
import { usePermissionStore } from '@/store/modules/permission'
import { DEFAULT_APP_SYSTEM_NAME } from '@/constants';
import { useUserStore } from '@/store/modules/user'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

const layout = computed(() => appStore.getLayout)


const permissionStore = usePermissionStore()
const userStore = useUserStore()
// 获取 navs
async function getNavsData() {
  // let res: IResponse<NavData> = await getNavsApi()
  //   console.log(res);

  let { data }: IResponse<NavData> = await getNavsApi()
  // console.log(data);

  let navs = data.coding_navs_group_v4;
  // 转换成 AppRouteRecordRaw[]
  let dataTo: AppRouteRecordRaw[] = transformToAppRouteRecordRaw(navs)
  console.info('navs', dataTo);
  // console.log('转换后navsData', dataTo);
  // console.log(permissionStore.getRouters);

  // 存储一级菜单，用于菜单展开
  permissionStore.setNavsFirstLevelPath(dataTo.map(item => item.path))
  // 存储 admin 信息
  permissionStore.setAdmin(data.admin)
  permissionStore.setAdminRoleTableList(data.admin_role_table_list)
  let userInfo = {
    ...data.admin,
    ...userStore.getUserInfo,
    username: data.admin.nick,
  }
  userStore.setUserInfo(userInfo)

  // 添加到路由 store permission
  // permissionStore.$state.routers.push(...dataTo)
  permissionStore.generateRoutes('server', dataTo as AppCustomRouteRecordRaw[])
  // console.log(permissionStore.routers);

  // 设置logo
  appStore.setTitle(data['app_system_name'] || DEFAULT_APP_SYSTEM_NAME)
}

const handleClickOutside = () => {
  appStore.setCollapse(true)
}

// setTimeout(() => {
//   // console.log('permissionStore33633663')
//   // console.log('permissionStore.navsFirstLevelPath',  permissionStore.getNavsFirstLevelPath)
//   // 让本组件重新渲染
// }, 1000)

const renderLayout = () => {
  // console.log('renderLayout', layout.value)
  switch (unref(layout)) {
    case 'classic':
      const { renderClassic } = useRenderLayout()
      return renderClassic()
    case 'topLeft':
      const { renderTopLeft } = useRenderLayout()
      return renderTopLeft()
    case 'top':
      const { renderTop } = useRenderLayout()
      return renderTop()
    case 'cutMenu':
      const { renderCutMenu } = useRenderLayout()
      return renderCutMenu()
    default:
      break
  }
}

export default defineComponent({
  name: 'Layout',
  setup() {
    // console.log('layout setup');
    getNavsData()

    // onMounted(() => {
    //   console.log('layout mounted');
    // })

    return () => (
      <section class={[prefixCls, `${prefixCls}__${layout.value}`, 'w-[100%] h-[100%] relative']}>
        {mobile.value && !collapse.value ? (
          <div
            class="absolute top-0 left-0 w-full h-full opacity-30 z-99 bg-[var(--el-color-black)]"
            onClick={handleClickOutside}
          ></div>
        ) : undefined}

        {renderLayout()}

        <Backtop></Backtop>

        <Setting></Setting>
      </section>
    )

  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-layout';

.@{prefix-cls} {
  background-color: var(--app-content-bg-color);

  .@{prefix-cls}-content-scrollbar {
    &> :deep(.el-scrollbar__wrap) {
      &>.@{elNamespace}-scrollbar__view {
        display: flex;
        height: 100% !important;
        flex-direction: column;
      }
    }
  }
}
</style>
