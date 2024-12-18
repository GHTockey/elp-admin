import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

// 基础路由
export const constantRouterMap: AppRouteRecordRaw[] = [
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Root',
    meta: {
      hidden: true
    },
    children: [  // home
      {
        path: 'home',
        component: () => import('@/views/Home.vue'),
        name: 'Home',
        meta: {
          hidden: true,
          title: '首页',
          noTagsView: true
        }
      },]
  },
  // 重定向
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  // admin
  {
    path: '/admin/:p*',
    name: '',
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '',
        name: '',
        component:  () => import('@/views/AdminPage/AdminPage.vue'),
        meta: {
          desc: '静态路由',
          // title: 'table',
        }
      },
    ]
  },
  // cmd page
  {
    path: '/cmd/:oneId*',
    component: Layout,
    name: '',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '',
        name: '',
        meta: undefined,
        component: () => import('@/views/CmdPage/CmdPage.vue')
      }
    ]
  },
  // InfoListPage
  {
    path: '/infoList/:oneId*',
    component: Layout,
    name: '',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '',
        name: '',
        meta: undefined,
        component: () => import('@/views/InfoListPage/InfoListPage.vue')
      }
    ]
  },
  // unknownPage
  {
    path: '/unknownPage',
    // component: () => import('@/views/unknownPage/unknownPage.vue'),
    component: Layout,
    name: '',
    meta: {
      hidden: true,
      title: 'unknownPage',
    },
    children: [
      {
        path: '',
        name: 'unknownPage',
        component: () => import('@/views/unknownPage/unknownPage.vue'),
        // component: () => import('@/views/error/404.vue'),
        meta: {
          title: 'unknownPage',
        }
      },
    ]
  },
  // table page
  { // /table是入口 /oneId是父级id，用途：导航菜单高亮
    path: '/table/:oneId?/:twoId?/:tableName*',
    component: Layout,
    name: '',
    meta: {
      hidden: true, // 不在标签栏显示
      title: 'table',
    },
    children: [
      {
        path: '',
        name: '',
        component: () => import('@/views/Table/Table.vue'),
        meta: {
          desc: '静态路由',
          title: 'table',
        }
      },
    ]
  },
  // 表单
  {
    path: '/form',
    component: Layout,
    name: 'form',
    meta: {
      hidden: true, // 不在标签栏显示
      title: 'form',
    },
    children: [
      {
        path: 'edit',
        name: '',
        component: () => import('@/views/Form/EditForm.vue'),
        meta: {
          title: 'EditForm',
        }
      },
      {
        path: 'look',
        name: '',
        component: () => import('@/views/Form/LookForm.vue'),
        meta: {
          title: 'LookForm',
        }
      },
    ]
  },
  // login
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  // 404
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
]

// 动态路由
export const asyncRouterMap: AppRouteRecordRaw[] = [
  // {
  //   path: '/level',
  //   component: Layout,
  //   redirect: '/level/menu1/menu1-1/menu1-1-1',
  //   name: 'Level',
  //   meta: {
  //     title: t('router.level'),
  //     icon: 'carbon:skill-level-advanced'
  //   },
  //   children: [
  //     // 菜单1
  //     {
  //       path: 'menu1',
  //       name: 'Menu1',
  //       component: getParentLayout(),
  //       redirect: '/level/menu1/menu1-1/menu1-1-1',
  //       meta: {
  //         title: t('router.menu1')
  //       },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           name: 'Menu11',
  //           component: getParentLayout(),
  //           redirect: '/level/menu1/menu1-1/menu1-1-1',
  //           meta: {
  //             title: t('router.menu11'),
  //             alwaysShow: true
  //           },
  //           children: [
  //             {
  //               path: 'menu1-1-1',
  //               name: 'Menu111',
  //               component: () => import('@/views/Level/Menu111.vue'),
  //               meta: {
  //                 title: t('router.menu111')
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-2',
  //           name: 'Menu12',
  //           component: () => import('@/views/Level/Menu12.vue'),
  //           meta: {
  //             title: t('router.menu12')
  //           }
  //         }
  //       ]
  //     },
  //     // 菜单2
  //     {
  //       path: 'menu2',
  //       name: 'Menu2',
  //       component: () => import('@/views/Level/Menu2.vue'),
  //       meta: {
  //         title: t('router.menu2')
  //       }
  //     },
  //     // > 菜单3 my
  //     {
  //       path: 'menu3',
  //       name: 'Menu3',
  //       component: () => import('@/views/Level/Menu3.vue'),
  //       meta: {
  //         title: 'm3'
  //       }
  //     }
  //   ]
  // },
  // temp11
  // {
  //   path: '/temp',
  //   name: 'Temp',
  //   component: Layout,
  //   // component: () => import('@/views/TempTest.vue'),
  //   meta: {
  //     title: 'Tempf'
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'Temp1',
  //       component: () => import('@/views/Level/Menu3.vue'),
  //       meta: {
  //         title: 'Temp11'
  //       }
  //     }
  //   ]
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(),
  // strict: true, // 大小写区分
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
