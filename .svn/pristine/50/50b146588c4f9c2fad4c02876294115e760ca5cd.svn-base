// 表格基本数据
export interface Table {
    id: number;
    create_time: string;
    update_time: string;
    my_table_name: string;
    auth: string;
    sort: number;
    table_name_cn: string;
    icon_uri: string | null;
    nav_group_top: string;
    nav_group: string;
    nav_name: string | null;
    manage_uri: string | null;
    search_delete_all: number;
    search_order_by: string | null;
    sac: number;
    log_enabled: string;
    log_main_columns: string | null;
    xls_download_column: string | null;
    btn_download_xls: string;
    engine_name: string;
    list_relative_cols: string | null;
    btn_upload: number;
    btn_download_xls_admin_id: number | null;
    btn_download_xls_admin_role_id: number | null;
    btn_upload_admin_id: number | null;
    btn_upload_admin_role_id: number | null;
    btn_upload_column: string | null;
    btn_upload_column_relative: string | null;
    btn_upload_column_pk: string | null;
    list_relative_search: string | null;
}

// 表格列信息
export interface Column {
    id: number;
    create_time: string;
    update_time: string;
    sort: number;
    auth: string;
    my_table_name: string;
    my_column_name: string;
    my_column_type: string;
    my_data_type: string | null;
    unknown_file_accept: string | null;
    vi_name: string;
    vi_des: string | null;
    vi_des_enabled: number;
    my_is_nullable: number;
    my_column_default: string | null;
    edit_tag: string | null;
    form_show_only_when: string | null;
    form_hide_only_when: string | null;
    is_relative: number;
    relative_on_delete: number;
    relative_table: string | null;
    relative_col_show: string | null;
    relative_col_store: string;
    relative_col_store_other: string | null;
    relative_ajax_select: number;
    relative_multiple: string | null;
    relative_join: string | null;
    relative_filter: string | null;
    list_position: number | null;
    list_searchable: number;
    list_search_pos: number | null;
    list_search_type: number | null;
    is_image: number;
    image_max_size: number;
    image_max_width: number;
    image_max_height: number;
    image_crop_width: number;
    image_crop_height: number;
    image_min_count: number | null;
    image_max_count: number | null;
    list_toggleable: string | null;
    relative_static: string | null;
    validate_minsize: string | null;
    validate_maxsize: string | null;
    validate_js: string | null;
    validate_php: string | null;
    validate_minvalue: string | null;
    validate_maxvalue: string | null;
    is_relative_other: number | null;
    image_thumb: string | null;
    image_thumb_max: string | null;
    image_thumb_field: string | null;
    uk: string | null;
    responsive_classes: string | null;
    sortable: number;
    ajax_field: number;
    search_field: string | null;
    batch_edit: number;
    character_set: string | null;
    list_search_pos_newline: number;
}

// 表格列信息集合
export interface AllCols {
    [key: string]: Column;
}

// 搜索列信息
export interface SearchCol {
    id: number;
    create_time: string;
    update_time: string;
    sort: number;
    auth: string;
    my_table_name: string;
    my_column_name: string;
    my_column_type: string; // 数据类型
    my_data_type: string | null;
    unknown_file_accept: string;
    vi_name: string;
    vi_des: string | null;
    vi_des_enabled: number;
    my_is_nullable: number;
    my_column_default: string | null;
    edit_tag: string | null;
    form_show_only_when: string | null;
    form_hide_only_when: string | null;
    is_relative: number;
    relative_on_delete: number;
    relative_table: string | null;
    relative_col_show: string | null;
    relative_col_store: string;
    relative_col_store_other: string | null;
    relative_ajax_select: number;
    relative_multiple: string | null;
    relative_join: string | null;
    relative_filter: string | null;
    list_position: number | null;
    list_searchable: number;
    list_search_pos: number | null;
    list_search_type: number | null;
    is_image: number;
    image_max_size: number;
    image_max_width: number;
    image_max_height: number;
    image_crop_width: number;
    image_crop_height: number;
    image_min_count: number | null;
    image_max_count: number | null;
    list_toggleable: string | null;
    relative_static: string | null;
    validate_minsize: string | null;
    validate_maxsize: string | null;
    validate_js: string | null;
    validate_php: string | null;
    validate_minvalue: string | null;
    validate_maxvalue: string | null;
    is_relative_other: number | null;
    image_thumb: string | null;
    image_thumb_max: string | null;
    image_thumb_field: string | null;
    uk: string | null;
    responsive_classes: string | null;
    sortable: number;
    ajax_field: number;
    search_field: string | null;
    batch_edit: number;
    character_set: string | null;
    list_search_pos_newline: number;
    is_nullable: string;
    relative_list: string | null | Record<string, string>; // 
}

// 搜索列信息集合
export interface SearchCols {
    [key: string]: SearchCol;
}

// 表格行信息
export interface Row {
    id: number;
    create_time: string;
    unionid: string;
    nickname: string;
    wx_image: string;
    user_name: string;
    mobile: string;
    email: string;
    is_submit_mobile: number;
    from_wx_open_id: string | null;
    datetime_submit: string | null;
    company_name: string;
    company_type: string | null;
    industry: string;
    duty_name: string;
    address: string;
    datetime_last_visit: string;
    province: string;
    city: string;
    district: string;
    datetime_submit_first: string | null;
    wx_open_id: string;
    app_id: number;
    datetime_first_visit: string;
    app_id_first_visit: number;
    fa_user_id: number;
    china_area: string;
    customer_id: string | null;
    datetime_auth_mobile: string | null;
    user_info_progress: number;
    is_need_merge: number;
    is_siemens_user: number;
    app_id_from: number;
    source_channel_id: string;
    _app_id_first_visit: string;
    _app_id_from: string;
    _create_time: string;
    _unionid: string;
    _wx_open_id: string;
    _nickname: string;
    _user_name: string;
    _mobile: string;
    _email: string;
    _china_area: string;
    _datetime_submit_first: string;
    _datetime_first_visit: string;
    _fa_user_id: string;
    _user_info_progress: string;
    _datetime_submit: string;
    _is_siemens_user: string;
    _datetime_last_visit: string;
    _coding_list_cmds: string[];
}

// 表格信息整体结构
export interface TableData {
    table: Table; // 表格信息
    all_cols: AllCols; // 表格列信息集合
    offset: number; // 当前页码
    per_page: number; // 每页数量
    url_search: any[]; // 搜索条件
    table_name: string; // 表格名称
    search_cols: SearchCols; // 搜索列信息集合
    search: any[]; // 搜索条件 ?
    search_data: any[]; // 搜索条件 ?
    cols_show: SearchCols; // 要显示列信息集合
    table_list_cmds: any[]; // ?
    cols_toggle: any[]; // ?
    table_cmds: { // 表格操作按钮
        cmd_cn: string;
        cmd_uri: string;
        cmd_type: string;
        class: string;
        icon: string;
    }[];
    rows: Row[]; // 表格行信息集合
    total_rows: number; // 表格行数量
    table_cmd_strs: string[]; // ?
    pagination: string; // 分页信息
    rows_list_search_form: string; // ?
    form_load_view_file: string; // ?
}
