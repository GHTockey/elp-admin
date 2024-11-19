import request from '@/axios'
import type { UserType } from './types'
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/mock/user/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  console.log(PATH_URL, 'path_url');
  return request.get({ url: '/mock/role/list2', params })
}

export const getTestFoxApi = (): Promise<IResponse<string[]>> => {
  console.log(PATH_URL, 'path_url');
  return request.get({ url: '/pet/1' })
}
