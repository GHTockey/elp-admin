// import { type MyResponse } from '../../../types/global'

// interface MyResponse {
//     code: number;
//     msg: string;
//     data: Data;
//   }

export interface NavData {
    coding_navs_group_v4: CodingNavGroup[];
    admin: Admin;
    admin_nick: string;
    admin_role_table_list: any[];
}

export interface CodingNavGroup {
    id: number;
    table_name_cn: string;
    pid: number;
    icon_normal: string;
    icon_active: string;
    sub_list: SubList[];
}

interface SubList {
    id: number;
    table_name_cn: string;
    pid: number;
    icon_normal: string;
    icon_active: string;
    sub_list: SubListItem[];
}

interface SubListItem {
    id: number;
    auth: any;
    sort: number;
    nav_group_top: string;
    nav_group: string;
    table_name_cn: string;
    table_name: string;
    manage_uri: string;
    auth_admin_id: any;
    auth_admin_role_id: any;
    icon_vue: any;
    icon_active: string | null;
    icon_normal: string | null;
    page_type: string;
    pid: number;
    sub_list: SubListItem[];
}

export interface Admin {
    id: number;
    create_time: string;
    update_time: string;
    auth: any;
    sort: any;
    auth_role: number;
    role_id: number;
    login: string;
    pass: string;
    nick: string;
    last_login_ip: string;
    last_login_time: string;
    mobile: any;
    email: any;
}