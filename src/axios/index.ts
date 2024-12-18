import service from './service'
import { CONTENT_TYPE } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType, onUploadProgress } = option
  const userStore = useUserStoreWithOut()
  const isFormData = data instanceof FormData; // **
  return service.request({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      // 'Content-Type': CONTENT_TYPE,
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      // [userStore.getTokenKey ?? 'Authorization']: userStore.getToken ?? '',
      ...headers
    },
    onUploadProgress: onUploadProgress
  })
}

export default {
  get: <T = any>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<IResponse<T>>
  },
  post: <T = any>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<IResponse<T>>
  },
  delete: <T = any>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<IResponse<T>>
  },
  put: <T = any>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<IResponse<T>>
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
