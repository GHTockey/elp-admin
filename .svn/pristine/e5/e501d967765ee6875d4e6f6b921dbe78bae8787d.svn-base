import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes
} from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { Admin } from '@/api/other/types'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]

  admin: Admin
  admin_role_table_list: any[]
  navsFirstLevelPath: string[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: [],
    admin: {} as Admin,
    admin_role_table_list: [],
    navsFirstLevelPath: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    },

    getAdmin(): Admin {
      return this.admin
    },
    getAdminRoleTableList(): any[] {
      return this.admin_role_table_list
    },
    getNavsFirstLevelPath(): string[] {
      return this.navsFirstLevelPath
    }
  },
  actions: {
    generateRoutes(
      type: 'server' | 'frontEnd' | 'static',
      routers?: AppCustomRouteRecordRaw[] | string[]
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = [] // 菜单列表
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
          // console.log('routerMap ', routerMap)
        } else if (type === 'frontEnd') {
          // console.log('frontEnd router')
          // 模拟前端过滤菜单
          routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
        } else {
          // console.log('static router')
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouterMap)
        }
        
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        // console.log(cloneDeep(constantRouterMap), routerMap);
        // console.log(this.routers);
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    },

    setAdmin(admin: Admin): void {
      this.admin = admin
    },
    setAdminRoleTableList(admin_role_table_list: any[]): void {
      this.admin_role_table_list = admin_role_table_list
    },
    setNavsFirstLevelPath(navsFirstLevelPath: string[]): void {
      this.navsFirstLevelPath = navsFirstLevelPath
    }
  },
  persist: {
    // paths: ['routers', 'addRouters', 'menuTabRouters']
    paths: ['addRouters', 'menuTabRouters']
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
