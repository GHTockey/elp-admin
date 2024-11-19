<script setup lang="tsx">
import { reactive, ref, watch, onMounted, unref } from 'vue';
import { Form, FormSchema } from '@/components/Form';
import { useI18n } from '@/hooks/web/useI18n';
import { ElCheckbox, ElLink } from 'element-plus';
import { useForm } from '@/hooks/web/useForm';
import { loginApi, getTestRoleApi, getAdminRoleApi } from '@/api/login';
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';
import { useRouter } from 'vue-router';
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';
import { UserType } from '@/api/login/types';
import { useValidator } from '@/hooks/web/useValidator';
import { Icon } from '@/components/Icon';
import { useUserStore } from '@/store/modules/user';
import { BaseButton } from '@/components/Button';
import { getNavsApi } from '@/api/other';
import { NavData } from '@/api/other/types';
import { navsDataTransform, objToFormData } from '@/utils';
import request from '@/axios';
import router from '@/router';


const { required } = useValidator()

const emit = defineEmits(['to-register'])

const appStore = useAppStore()

const userStore = useUserStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.login')}</h2>
        }
      }
    }
  },
  {
    field: 'username',
    label: t('login.username'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    // componentProps: {
    //   placeholder: 'admin or test'
    // }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      // placeholder: 'admin or test'
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" />
                {/* <ElLink type="primary" underline={false}>
                  {t('login.forgetPassword')}
                </ElLink> */}
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <BaseButton loading={loading.value} type="primary" class="w-[100%]" onClick={signIn}>
                  登录
                </BaseButton>
              </div>
              {/* <div class="w-[100%] mt-15px">
                <BaseButton class="w-[100%]" onClick={toRegister}>
                  {t('login.register')}
                </BaseButton>
              </div> */}
            </>
          )
        }
      }
    }
  },
  // 其它登录方式-分割线
  // {
  //   field: 'other',
  //   component: 'Divider',
  //   label: t('login.otherLogin'),
  //   componentProps: {
  //     contentPosition: 'center'
  //   }
  // },
  // 社交登录图标列表
  // {
  //   field: 'otherIcon',
  //   colProps: {
  //     span: 24
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: () => {
  //         return (
  //           <>
  //             <div class="flex justify-between w-[100%]">
  //               <Icon
  //                 icon="ant-design:github-filled"
  //                 size={iconSize}
  //                 class="cursor-pointer ant-icon"
  //                 color={iconColor}
  //                 hoverColor={hoverColor}
  //               />
  //               <Icon
  //                 icon="ant-design:wechat-filled"
  //                 size={iconSize}
  //                 class="cursor-pointer ant-icon"
  //                 color={iconColor}
  //                 hoverColor={hoverColor}
  //               />
  //               <Icon
  //                 icon="ant-design:alipay-circle-filled"
  //                 size={iconSize}
  //                 color={iconColor}
  //                 hoverColor={hoverColor}
  //                 class="cursor-pointer ant-icon"
  //               />
  //               <Icon
  //                 icon="ant-design:weibo-circle-filled"
  //                 size={iconSize}
  //                 color={iconColor}
  //                 hoverColor={hoverColor}
  //                 class="cursor-pointer ant-icon"
  //               />
  //             </div>
  //           </>
  //         )
  //       }
  //     }
  //   }
  // }
])

const iconSize = 30

const remember = ref(userStore.getRememberMe)

const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    const { username, password } = loginInfo
    setValues({ username, password })
  }
}
onMounted(() => {
  initLoginInfo()
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods

const loading = ref(false)

const iconColor = '#999'

const hoverColor = 'var(--el-color-primary)'

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true

      const formData = await getFormData<UserType>()
      // console.log(formData);
      // console.log(unref(remember));

      try {
        let reqFormData = objToFormData({
          login: formData.username,
          pass: formData.password
        })

        let res = await request.post({ 'url': `/Index/login`, data: reqFormData })
        // console.log(res);
        // return

        // 临时返回写死数据
        // const res = {
        //   data: {
        //     username: 'admin',
        //     role: 'admin',
        //     roleId: '1',
        //     permissions: ['admin', 'test']
        //   }
        // }

        if (res.code == 0) {
          // 是否记住我
          if (unref(remember)) {
            userStore.setLoginInfo({
              username: formData.username,
              password: formData.password
            })
          } else {
            userStore.setLoginInfo(undefined)
          }
          userStore.setRememberMe(unref(remember))
          // userStore.setUserInfo(res.data)


          let { data } = await getNavsApi();
          userStore.setUserInfo(data.admin)
          // 检查是否有 redirect 参数，有则重定向，否则重定向到首页
          if (redirect.value) {
            // console.log(redirect.value);
            router.push(redirect.value)
          } else {
            router.push('/home')
          }

          // // 是否使用动态路由
          // if (appStore.getDynamicRouter) {
          //   console.log('使用动态路由')
          //   // getRole()

          //   // *************************************************************************************
          //   // // 获取 navs
          //   // let { data }: IResponse<NavData> = await getNavsApi()
          //   // // console.log(data);
          //   // let navs = data.coding_navs_group_v4;
          //   // // 转换成 AppRouteRecordRaw[]
          //   // let dataTo: AppRouteRecordRaw[] = navsDataTransform(navs, 0)
          //   // console.log('navsData', dataTo);

          //   // await permissionStore.generateRoutes('server', dataTo).catch((e) => {
          //   //   console.log(e)
          //   // })
          //   // permissionStore.getAddRouters.forEach((route) => {
          //   //   addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
          //   // })
          //   // permissionStore.setIsAddRouters(true)
          //   // // push({ path: redirect.value || permissionStore.addRouters[0].path })
          //   // push('/')

          // } else {
          //   await permissionStore.generateRoutes('static').catch(() => { })
          //   permissionStore.getAddRouters.forEach((route) => {
          //     addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
          //   })
          //   permissionStore.setIsAddRouters(true)
          //   // push({ path: redirect.value || permissionStore.addRouters[0].path })
          // }
        }
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取角色信息
const getRole = async () => {
  const formData = await getFormData<UserType>()
  const params = {
    roleName: formData.username
  }
  const res =
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await getAdminRoleApi(params)
      : await getTestRoleApi(params)
  if (res) {
    const routers = res.data || []
    userStore.setRoleRouters(routers)
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await permissionStore.generateRoutes('server', routers).catch(() => { })
      : await permissionStore.generateRoutes('frontEnd', routers).catch(() => { })

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}

// 去注册页面
const toRegister = () => {
  emit('to-register')
}



</script>

<template>
  <Form :schema="schema" :rules="rules" label-position="top" hide-required-asterisk size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)" @register="formRegister" />
</template>
