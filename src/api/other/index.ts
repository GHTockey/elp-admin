import request from '@/axios'
import type { NavData } from './types'


// 获取navs数据
export const getNavsApi = (): Promise<IResponse<NavData>> => {
    return request.get({
        url: '/Index/index', headers: {
            'Content-Type': 'application/json'
        }
    })
}


// 上传文件【GET】获取 fileUploadSliceGuid
export const getFileUploadSliceGuidApi = (): Promise<IResponse<{
    fileUploadSliceGuid: string
}>> => {
    return request.get({ url: '/ResManageV2/uploadSlice' })
}

// 上传文件【POST】
// export const uploadFileApi = async (data: FormData, onUploadProgress?: (progressEvent: any) => void): Promise<IResponse<{
//     file: string // 返回文件相对路径
// }>> => {
//     return (await axios.post(window.app_base_url  + '/ResManageV2/uploadSlice', data, {
//     // return (await axios.post(import.meta.env.VITE_API_BASE_PATH_URL + '/ResManageV2/uploadSlice', data, {
//         // headers: {
//         //     'Content-Type': 'multipart/form-data'
//         //     'Content-Type': 'application/x-www-form-urlencoded'
//         // },
//         params: {
//             '__API_TMP_TEST_82__': 1 // TODO: 待修改；原封装的axios传formData参数有问题，这里临时解决
//         },
//         onUploadProgress: onUploadProgress
//     })).data
// }
// 
export const uploadFileApi = (data: FormData, onUploadProgress?: (progressEvent: any) => void) => {
    return request.post({
        url: '/ResManageV2/uploadSlice',
        data,
        headers: {
            // 'Content-Type': 'multipart/form-data'
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        onUploadProgress: onUploadProgress
    })
}


// 获取cmds数据 [应该是布局数据]
export interface CmdGroup {
    [key: string]: string;
}

export interface CmdGroups {
    [key: string]: CmdGroup;
}

export interface CmdsData {
    cmd_groups: CmdGroups;
    cmd_groups_blank: CmdGroups;
    cmd_groups_form: CmdGroups;
    form_load_view_file: string;
}

export const getCmdsDataApi = (): Promise<IResponse<CmdsData>> => {
    return request.get({ url: '/Cd/cmds' })
}