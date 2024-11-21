import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import { SUCCESS_CODE } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

// 默认请求拦截器
const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  // 检查URL中是否包含多次'/Admin'，如果是则替换掉多余的'/Admin'
  if (config.url && config.url.split('/Admin').length > 2) {
    config.url = config.url.replace('/Admin', '');
  }

  // 临时添加param参数 '__API_TMP_TEST_82__': 1  测试用
  if (!config.params) config.params = {};
  config.params['__API_TMP_TEST_82__'] = 1

  // 检查是否是绝对地址
  const isAbsoluteURL = config.url?.startsWith('http');
  if (isAbsoluteURL) {
    config.baseURL = ''; // 如果是绝对地址，则不使用 baseURL
  }

  // 去重
  // if (config.url) {
  //   // 将URL按'/'分割成数组
  //   const urlParts = config.url.split('/');
  //   // 过滤掉重复的部分
  //   const uniqueParts = urlParts.filter((part, index) => urlParts.indexOf(part) == index);
  //   // 将数组重新拼接成URL
  //   config.url = uniqueParts.join('/');
  // }

  // if (
  //   config.method === 'post' &&
  //   config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  // ) { // 如果是post请求，并且是formdata格式，则转换
  //   config.data = qs.stringify(config.data)
  // } else if (
  //   TRANSFORM_REQUEST_DATA &&
  //   config.method === 'post' &&
  //   config.headers['Content-Type'] === 'multipart/form-data'
  // ) {
  //   config.data = objToFormData(config.data)
  // }

  if (config.method === 'get' && config.params) {

    // config.headers['Content-Type'] = 'application/json';
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }


  // console.info('Request URL:', config.url);
  // console.info('Base URL:', config.baseURL);

  return config
}

// 默认响应拦截器
const defaultResponseInterceptors = (response: AxiosResponse) => {
  // console.log(response.data, 'response.data');
  if (response?.config?.responseType === 'blob') { // 如果是文件流，直接过
    return response
  } else if (response.data.code == SUCCESS_CODE) { // 成功
    // 过滤掉relative_list中的空数据
    filterEmptyData(response.data)
    return response.data
  } else if (response.data.code == 201) { // 201 返回登录
    // ElMessage.error(response?.data?.msg)
    ElMessageBox.confirm(response?.data?.msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      const userStore = useUserStoreWithOut();
      userStore.logout();
      window.location.href = '/login';
    });
    return response;
  } else {
    console.log('response.data', response.data) // =1 请求错误
    if (response.status == 200 && response.data?.code != SUCCESS_CODE) {

      ElMessage.error(response?.data?.msg)
      return response

      // 判断返回的数据是否是字符串，如果是则进行 JSON.parse 转换
      const data = (response.data && typeof response.data === 'string') ? JSON.parse(response.data) : response.data;
      response.data = data;
      // console.log('response',response.data)
      // 拼接规范响应体
      let myResponse = {
        code: 0,
        msg: 'OK localhost',
        data: response.data
      }

      // 过滤掉relative_list中的空数据
      filterEmptyData(myResponse.data)

      return myResponse
    } else {
      ElMessage.error(response?.data?.msg)
      if (response?.data?.code === 401) {
        const userStore = useUserStoreWithOut()
        userStore.logout()
      }
    }

  }
}

function filterEmptyData(data: any) {
  // console.log(data, 'data before')
  // 遍历过滤掉relative_list中的空数据
  if (data.data?.form_fields) {
    // console.log(data.data.form_fields, 'form_fields')
    Object.keys(data.data?.form_fields).forEach(key => {
      if (data.data?.form_fields[key]?.relative_list) {
        Object.keys(data.data?.form_fields[key].relative_list).forEach(relKey => {
          if (relKey == "") {
            // console.log(relKey, 'relKey')
            delete data.data?.form_fields[key].relative_list[relKey];
          }
        });
      }
    });
  }
  // console.log(data, 'data after')
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
