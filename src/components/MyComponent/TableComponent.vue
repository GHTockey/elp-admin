<template>
    <div style="margin-right: 20px;" class="w-full h-full box-border">
        <!-- 搜索表单 -->
        <el-form v-if="tableData.search_cols && Object.keys(tableData.search_cols).length > 0" :model="searchForm"
            inline>
            <el-form-item v-for="(col, key) in tableData.search_cols" :key="key" :label="col.vi_name">
                <!-- 日期选择器 -->
                <template v-if="FieldTypeChecker.isDateField(col)">
                    <el-date-picker :type="'datetimerange'"
                        :format="`YYYY-MM-DD ${col.my_column_type == 'date' ? '' : 'HH:mm:ss'}`"
                        :value-format="`YYYY-MM-DD ${col.my_column_type == 'date' ? '' : 'HH:mm:ss'}`"
                        range-separator="-" :start-placeholder="col.placeholder_search?.split(',')[0]"
                        :end-placeholder="col.placeholder_search?.split(',')[1]" v-model="searchForm[key]" />
                </template>
                <!-- 下拉选择框 -->
                <template v-else-if="FieldTypeChecker.isSelectField(col)">
                    <el-form-item>
                        <el-select class="w-26!" v-model="searchForm[key]" :placeholder="col.placeholder_search"
                            clearable>
                            <!-- relative_list 为对象，遍历使用 Object.entries() 方法 -->
                            <el-option v-if="col.relative_list"
                                v-for="(item, index) in Object.entries(col.relative_list)" :key="item[0]"
                                :label="item[1]" :value="item[0]" />
                        </el-select>
                    </el-form-item>
                </template>
                <!-- 输入框 -->
                <template v-else-if="FieldTypeChecker.isInputField(col)">
                    <el-input v-model="searchForm[key]" :placeholder="col.placeholder_search" />
                </template>
                <!-- 弹框选择 -->
                <!-- <template v-else-if="FieldTypeChecker.isPopupField(col)">
                    <div class="flex w-42" @click="serchDialogVisible = true">
                        <el-input v-model="searchForm[key]" :placeholder="col.placeholder_search">
                            <template #append>
                                <el-button type="primary">选择</el-button>
                            </template>
                        </el-input>
                    </div>
                </template> -->
                <template v-else-if="FieldTypeChecker.isPopupField(col)">
                    <div class="flex">
                        <!-- <el-button type="primary" disabled>Primary</el-button> -->
                        <el-input style="max-width: 600px" class="popup-select-input" v-model="searchForm[key]"
                            :placeholder="col.placeholder_search">
                            <!-- 数据回显 -->
                            <template #prefix v-if="!!col.relative_col_show">
                                <template v-for="showKey in col.relative_col_show?.split(',')">
                                    <span>{{ computedShowValue(col, key, showKey) }}</span>
                                </template>
                            </template>
                            <template #prefix v-else>
                                {{ computedShowValue(col, key) }}
                            </template>
                            <template #append>
                                <el-button type="primary" @click="tableDialogSelectHandle(col)">选择2</el-button>
                            </template>
                        </el-input>
                    </div>
                </template>

                <template v-else>
                    <el-input v-model="searchForm[key]" :placeholder="col.placeholder_search" />
                </template>
            </el-form-item>

            <el-form-item>
                <el-button @click="handleReset">重置</el-button>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格和空状态 -->
        <div v-loading="loading" element-loading-text="加载中...">
            <el-table v-if="tableData?.rows.length" :data="tableData.rows" style="width: 100%" border max-height="60vh"
                @selection-change="handleSelectionChange">
                <!-- 复选框:根据tableData.table_cmds里是否有cmd_type == 1的 进行条件渲染 -->
                <el-table-column type="selection" width="50" v-if="tableData.table_cmds.some(item =>
                    item.cmd_type == 1 ||
                    item.cmd_type == 8 ||
                    item?.class == 'coding-ajax-batch-checked-download' ||
                    item?.class == 'coding-ajax-delete-batch')" />
                <el-table-column v-for="(item, index) in Object.values(tableData.cols_show)" :key="index"
                    :prop="item.my_column_name" :label="item.vi_name" :sortable="!!item.sortable">
                    <template #default="scope">
                        <div style="display: flex; align-items: center">
                            <span v-if="FieldTypeChecker.isSelectField(item)">
                                {{
                                    tableData.cols_show[item.my_column_name].relative_list[scope.row[item.my_column_name]]
                                }}
                            </span>
                            <el-avatar v-else-if="item.my_column_name == 'wx_image'" :size="50"
                                :src="getFullImageUrl(scope.row[item.my_column_name])" />
                            <span v-else style="margin-left: 10px">{{ scope.row[item.my_column_name] }}</span>
                        </div>
                    </template>
                </el-table-column>
                <!-- 操作栏 -->
                <el-table-column label="操作" width="80" fixed="right">
                    <template #default="scope">
                        <el-button :size="'small'" type="primary" @click="handleSelect(scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-empty v-else description="暂无数据" />
        </div>

        <!-- 分页 -->
        <div class="demo-pagination-block mt-[20px]" v-if="tableData.total_rows > 0">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="per_page"
                :page-sizes="[10, 50, 100, 200]" background layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total_rows" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>


        <Teleport to="#app">
            <!-- 搜索条件选择弹窗 -->
            <DialogSelect class="max-h-[90vh]" v-model="serchDialogVisible"
                :title="tableSelectDataDeliver?.table?.table_name_cn + '选择'"
                :tableSelectDataReception="tableSelectDataDeliver">
            </DialogSelect>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, provide } from 'vue';
import { FieldTypeChecker, getFullImageUrl, getTableSelectNamePath } from "@/utils";
import { useAppStore } from '@/store/modules/app';
import DialogSelect from '@/components/MyComponent/DialogSelect.vue';

import {
    ElTable,
    ElTableColumn,
    ElPagination,
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElDatePicker,
    ElSelect,
    ElOption,
    ElAvatar,
    ElMessage,
    ElEmpty
} from 'element-plus';
import { TableData } from '@/api/table/Table';
import { getTableSelectDataApi } from '@/api/table/tableApi';

// const route = useRoute();
const appStore = useAppStore();
const props = defineProps({
    tableSelectDataReception: Object
});

// console.log('tableComponent props 666 ', props.tableSelectDataReception);

const offset = ref(0);
const per_page = ref(10);
const currentPage = computed(() => Math.floor(offset.value / per_page.value) + 1);
const searchForm = ref<Record<string, any>>({});
const tableData = ref<TableData>({
    table: undefined,
    all_cols: undefined,
    offset: 0,
    per_page: 0,
    url_search: [],
    table_name: "",
    search_cols: undefined,
    search: [],
    search_data: [],
    cols_show: undefined,
    table_list_cmds: [],
    cols_toggle: [],
    table_cmds: [],
    rows: [],
    total_rows: 0,
    table_cmd_strs: [],
    pagination: "",
    rows_list_search_form: ""
});
const loading = ref(false);
const multipleSelection = ref<any[]>([]);

// 获取父组件链中的函数
// 如果父组件链上多个组件对同一个 key 提供了值，那么离得更近的组件将会“覆盖”链上更远的组件所提供的值
const triggerFunction = inject('triggerFunction');
const tableSelectNamePath = inject('tableSelectNamePath');


const tableSelectHandle = (row: any, tableName: string) => {
    searchForm.value[tableSelectField.value] = row[tableSelectField.value] ? row[tableSelectField.value] : row.id;
    if (!tableSelectObjData.value[tableName]) {
        tableSelectObjData.value[tableName] = [];
    }
    tableSelectObjData.value[tableName].push(row);
    serchDialogVisible.value = false;
};


// 弹窗选择-当前表单项字段
const tableSelectField = ref();
// 条件搜索表单组件的弹窗状态
const serchDialogVisible = ref(false)
// 弹窗选择数据
const tableSelectDataDeliver = ref();
// 记录点击后的数据，用于回显
const tableSelectObjData = ref({})
// 弹窗选择-当前表单项字段数据
const computedShowValue = computed(() => {
    return (col: any, key: string, showKey?: string) => {
        if (!searchForm.value[key]) return ''; // 表单项必须有值
        // console.log('col:', col);
        // console.log('key:', key, 'showKey:', showKey);
        let res = tableSelectObjData.value?.[col.relative_table]?.find(el => el[key] == searchForm.value[key] ||
            el.name == searchForm.value[key] ||
            el.id == searchForm.value[key])
        // console.log('res', res);
        // console.log('[showKey]', showKey, res?.[showKey]);
        return res?.[showKey || 'name']
    }
})
const currentTableSelectNamePath = ref('');
// 表格弹窗-选择数据
async function tableDialogSelectHandle(data: any) {
    // // 获取表名
    currentTableSelectNamePath.value = getTableSelectNamePath(data)
    console.log(currentTableSelectNamePath.value, 'currentTableSelectNamePath.value');
    // // 仅仅为了回显表名
    let res = await getTableSelectDataApi(currentTableSelectNamePath.value)
    console.log('tableSelectDataDeliver', res);
    tableSelectDataDeliver.value = res.data
    // // 显示弹窗
    serchDialogVisible.value = true
    // // 记录当前表单项字段，用于选择后数据填充到表单项
    tableSelectField.value = data.my_column_name
};


getTableData();

// 提供给下游组件使用
provide('triggerFunction', tableSelectHandle);
provide('tableSelectNamePath', currentTableSelectNamePath);

async function getTableData() {
    console.log('getTableData 666');

    if (props.tableSelectDataReception) {
        tableData.value = props.tableSelectDataReception
        loading.value = true;
        let res = await getTableSelectDataApi(tableSelectNamePath.value, searchForm.value, per_page.value, offset.value);
        tableData.value = res.data;
        loading.value = false;
        return
    }
    // console.log(tableSelectNamePath.value, '弹框获取数据');
    if (!tableSelectNamePath.value) {
        ElMessage({ message: '表名参数缺失: relative_[...]  /id', type: 'warning' });
        return;
    }

    loading.value = true;
    // let res = await getTableDataApi(route.query.tName as string, offset.value, per_page.value, searchForm.value);


    // let res = await request.post({
    //     'url': `/Table/table_select/${tableSelectNamePath.value}/id/${per_page.value}/${offset.value}`,
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded' // 使请求的参数为表单格式
    //     },
    //     data: searchForm.value
    // })

    // 如果 props.tableSelectDataReception 有值，则使用 props.tableSelectDataReception 的值
    // if (props.tableSelectDataReception) {
    //     tableData.value = props.tableSelectDataReception
    //     let res = await getTableSelectDataApi(currentTableSelectNamePath.value, searchForm.value, per_page.value, offset.value);
    //     tableData.value = res.data;
    //     loading.value = false;
    //     return
    // } else {

        let res = await getTableSelectDataApi(tableSelectNamePath.value, searchForm.value, per_page.value, offset.value);
        // console.log(res.data); // table_name
        tableData.value = res.data;
        loading.value = false;
        // router.currentRoute.value.meta.title = tableData.value?.table?.table_name_cn;
    // }

}

function handleSelectionChange(val: any[]) {
    multipleSelection.value = val.map(item => item.id);
}

function handleSelect(row: any) {
    // ElMessage({ message: `选择了: ${row.id}`, type: 'success' });
    (triggerFunction as Function)(row, tableData.value.table_name) // 传递选择的数据和表名
}

function handleSearch() {
    offset.value = 0;
    getTableData();
}

function handleReset() {
    searchForm.value = {};
    handleSearch();
}

function handleSizeChange(size: number) {
    per_page.value = size;
    getTableData();
}

function handleCurrentChange(page: number) {
    offset.value = (page - 1) * per_page.value;
    getTableData();
}
</script>