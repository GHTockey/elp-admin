import request from '@/axios'
import { TableData } from './Table'
// import axios, { AxiosResponse } from "axios";



// 获取table 数据
export const getTableDataApi = (tableName: string, offset?: number, per_page?: number, data): Promise<IResponse<TableData>> => {
    return request.post({
        url: `/Table/table/${tableName}`,
        params: {
            // '__API_TMP_TEST_82__': 1,
            // 先检查是否传参, 传参则使用字段，没有传则不传递该字段
            ...(offset ? { offset } : {}),
            ...(per_page ? { per_page } : {})
        },
        data // 搜索条件
    })
}
// export const getTableDataApi = (tableName: string, offset?: number, per_page?: number): AxiosResponse<TableData> => {
//     // return request.get({ url: `/Admin/Table/table/${tableName}`, params: { '__API_TMP_TEST_82__': 1 } })
//     return axios.get(`https://a.plant360.cn/element_admin/Admin/Table/table/${tableName}`, {
//         params: {
//             '__API_TMP_TEST_82__': 1,
//             // 先检查是否传参, 传参则使用字段，没有传则不传递该字段
//             ...(offset ? { offset } : {}),
//             ...(per_page ? { per_page } : {})
//         }
//     })
// }

// 删除某行数据
export const deleteTableRowApi = (tableName: string, id: number): Promise<IResponse<any>> => {
    return request.delete({
        url: `/Table/delete/${tableName}/${id}`
    })
}


/* 查看表格某项详情 [返回form_fields表单字段  target表单数据  table表格信息] */
export const getTableRowDatailApi = (tableName: string, id: number | string): Promise<IResponse<any>> => {
    return request.get({
        url: `/Table/read/${tableName}/${id}`
    })
}

// 编辑 [获取表单字段数据]
export const editTableRowGetApi = (tableName: string, id: number | string): Promise<IResponse<any>> => {
    return request.get({
        url: `/Table/edit/${tableName}/${id}`
    })
}

// 编辑提交 [前置优先使用 form_action 的值]
export const editTableRowPostApi = (tableName: string, id: number | string, data: any): Promise<IResponse<any>> => {
    return request.post({
        url: `/Table/edit/${tableName}/${id}`,
        data
    })
}

// 获取表格列表数据 [relative_static]
export const getRelativeStaticApi = (): Promise<IResponse<{
    relative_static_list: any
    form_load_view_file: string
}>> => {
    return request.get({
        url: '/Table/relative_static'
    })
}

// 获取表格选择数据
export const getTableSelectDataApi = (tableSelectNamePath: string, searchForm: any = {}, per_page: number, offset: number): Promise<IResponse<any>> => {
    return request.post({
        // 'url': `/Table/table_select/${tableSelectNamePath}/id`,
        'url': `/Table/table_select/${tableSelectNamePath}/id${per_page ? `/${per_page}` : ''}${offset ? `/${offset}` : ''}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // 使请求的参数为表单格式
        },
        data: searchForm
    })
}

