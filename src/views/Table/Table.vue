<template>
    <div>
        <ContentWrap v-loading="loading">
            <template v-if="!tableData.table">
                <!-- <p>{{route.query.url}}</p> -->
                <el-empty description="没有数据" />
            </template>

            <template v-else>
                <!-- <span class="text-size-xl font-700">{{ tableData.table?.table_name_cn }}</span>
                <el-divider /> -->

                <!-- 搜索表单 -->
                <el-form v-if="tableData.search_cols && Object.keys(tableData.search_cols).length > 0"
                    :model="searchForm" inline @keyup.enter="handleSearch">
                    <template v-for="(col, key) in tableData.search_cols" :key="key">
                        <!-- 按需换行 -->
                        <template v-if="!!col.list_search_pos_newline">
                            <br>
                        </template>
                        <el-form-item :label="col.vi_name">
                            <!-- 日期选择器 -->
                            <template v-if="FieldTypeChecker.isDateField(col)">
                                <el-date-picker :type="'datetimerange'"
                                    :format="`YYYY-MM-DD ${col.my_column_type == 'date' ? '' : 'HH:mm:ss'}`"
                                    :value-format="`YYYY-MM-DD ${col.my_column_type == 'date' ? '' : 'HH:mm:ss'}`"
                                    range-separator="-" :start-placeholder="col.placeholder_search?.split(',')[0]"
                                    :end-placeholder="col.placeholder_search?.split(',')[1]"
                                    v-model="searchForm[key]" />
                            </template>
                            <!-- switch 切换 -->
                            <el-switch v-else-if="FieldTypeChecker.isSwitchField(col)" v-model="searchForm[key]"
                                inline-prompt size="large" :active-text="col.relative_list?.[1]"
                                :inactive-text="col.relative_list?.[0]" :active-value="1" :inactive-value="0" />
                            <!-- 月份选择 -->
                            <el-date-picker v-else-if="FieldTypeChecker.isMonthField(col)" v-model="searchForm[key]"
                                type="month" :placeholder="col.placeholder_search" :format="`YYYY-MM`"
                                :value-format="`YYYY-MM`" />
                            <!-- auth 字段 -->
                            <template v-else-if="FieldTypeChecker.isAuthField(col)">
                                <AuthSelect v-model:value="searchForm[key]" />
                            </template>



                            <!-- 下拉选择框 -->
                            <template v-else-if="FieldTypeChecker.isSelectField(col)">
                                <el-form-item>
                                    <el-select class="w-26!" v-model="searchForm[key]"
                                        :placeholder="col.placeholder_search" clearable>
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
                            <template v-else-if="FieldTypeChecker.isPopupField(col)">
                                <div class="flex">
                                    <el-input v-model="searchForm[key]" :placeholder="col.placeholder_search">
                                        <!-- 数据回显 -->
                                        <template #prepend v-if="!!col.relative_col_show">
                                            <span v-for="showKey in col.relative_col_show?.split(',')">
                                                <!-- modelKey: {{ key }}
                                                value: {{ searchForm[key] }}
                                                showKey: {{ showKey }} -->
                                                <!-- {{ tableSelectObjData?.filter(el => el[key] == searchForm[key]) }} -->
                                                {{ computedShowValue(col, key, showKey) }}
                                            </span>
                                        </template>
                                        <template #prepend v-else>
                                            {{ computedShowValue(col, key) }}
                                        </template>
                                        <template #append>
                                            <el-button type="primary"
                                                @click="tableDialogSelectHandle(col)">选择</el-button>
                                        </template>
                                    </el-input>
                                </div>
                            </template>

                            <template v-else>
                                <el-input v-model="searchForm[key]" :placeholder="col.placeholder_search" />
                            </template>
                        </el-form-item>
                    </template>

                    <el-form-item>
                        <el-button @click="handleReset">重置</el-button>
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </el-form-item>
                </el-form>

                <!-- 表格命令 -->
                <el-row class="mb-2">
                    <el-col :span="24" class="flex ">
                        <template v-if="tableData.table_cmds.length">
                            <template v-for="(item, index) in tableData.table_cmds" :key="index">
                                <!-- TODO: :icon 要加条件 -->
                                <!-- 批量删除 1 coding-ajax-delete-batch -->
                                <!-- iconify [:icon="item.icon ? useIcon({ icon: item.icon }) : ''"] -->
                                <ElButton v-if="item?.class == 'coding-ajax-delete-batch'" type="primary"
                                    @click="tableCMD_AjaxDeleteHandle(item)">
                                    <template v-if="!item.icon && item.svg_icon">
                                        <el-icon>
                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                        </el-icon>
                                    </template>
                                    {{ item.cmd_cn }}
                                </ElButton>
                                <!-- 勾选导出 13 coding-ajax-batch-checked-download -->
                                <ElButton v-else-if="item?.class == 'coding-ajax-batch-checked-download'" type="primary"
                                    @click="exportExcel(item)">
                                    <template v-if="!item.icon && item.svg_icon">
                                        <el-icon>
                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                        </el-icon>
                                    </template>
                                    {{ item.cmd_cn }}
                                </ElButton>
                                <!-- 检索导出 7 coding-blank-search-form -->
                                <ElButton v-else-if="item?.class == 'coding-blank-search-form'" type="primary"
                                    @click="exportExcel(item)">
                                    <template v-if="!item.icon && item.svg_icon">
                                        <el-icon>
                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                        </el-icon>
                                    </template>
                                    {{ item.cmd_cn }}
                                </ElButton>

                                <!-- 判断type值 -->
                                <!-- ajax_delete 1 异步删除，弹窗确认，调用接口 /// -->
                                <ElButton v-else-if="item.cmd_type == 1" type="primary"
                                    @click="tableCMD_AjaxDeleteHandle(item)">
                                    <template v-if="!item.icon && item.svg_icon">
                                        <el-icon>
                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                        </el-icon>
                                    </template>
                                    {{ item.cmd_cn }}
                                </ElButton>
                                <!-- main_reload 2 新组件拿uri数据渲染，添加数据 /// -->
                                <ElButton v-else-if="item.cmd_type == 2" type="primary"
                                    @click="tableCMD_MainReloadHandler(item)">
                                    <template v-if="!item.icon && item.svg_icon">
                                        <el-icon>
                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                        </el-icon>
                                    </template>
                                    {{ item.cmd_cn }}
                                </ElButton>
                                <!-- _blank 4 新窗口打开/// -->
                                <ElButton v-else-if="item.cmd_type == 4" type="primary"
                                    @click="tableCMD_HandleOpenNewWindow(item)">
                                    <template v-if="!item.icon && item.svg_icon">
                                        <el-icon>
                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                        </el-icon>
                                    </template>
                                    {{ item.cmd_cn }}
                                </ElButton>
                                <!-- TODO: 5 .... 0927 待定 -->
                                <!-- 11 批量修改-->
                                <ElButton v-else-if="item.cmd_type == 11" type="primary" @click="handleBatchEdit(item)">
                                    <template v-if="!item.icon && item.svg_icon">
                                        <el-icon>
                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                        </el-icon>
                                    </template>
                                    {{ item.cmd_cn }}
                                </ElButton>
                                <!-- ajax_cmd 7 -->
                                <template v-else-if="item.cmd_type == 7">
                                    <template v-if="item.cmd_tips">
                                        <el-popconfirm placement="top" confirm-button-text="确定" cancel-button-text="取消"
                                            icon-color="#626AEF" :title="item.cmd_tips"
                                            @confirm="tableCMD_AjaxCmdHandle(item)">
                                            <template #reference>
                                                <el-button type="primary" :data-cmd-type="item.cmd_type">
                                                    <template v-if="!item.icon && item.svg_icon">
                                                        <el-icon>
                                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                                        </el-icon>
                                                    </template>
                                                    {{ item.cmd_cn }}
                                                </el-button>
                                            </template>
                                        </el-popconfirm>
                                    </template>
                                    <ElButton v-else type="primary" @click="tableCMD_AjaxCmdHandle(item)"
                                        :data-cmd-type="item.cmd_type">
                                        <template v-if="!item.icon && item.svg_icon">
                                            <el-icon>
                                                <img :src="getFullImageUrl(item.svg_icon)"
                                                    style="width: 100%; margin-right: 10px;" alt="icon" />
                                            </el-icon>
                                        </template>
                                        {{ item.cmd_cn }}
                                    </ElButton>
                                </template>
                                <!-- _blank_search_form 5 [复制字段 -->
                                <!-- <ElButton v-else-if="item.cmd_type == 5" type="primary" @click="">
                                    {{ item.cmd_cn }}-{{ item.cmd_type }}
                                </ElButton> -->
                                <!-- checked_batch 8  批量彻底删除 -->
                                <ElButton v-else-if="item.cmd_type == 8" type="primary"
                                    @click="tableCMD_AjaxDeleteHandle(item)">
                                    <template v-if="!item.icon && item.svg_icon">
                                        <el-icon>
                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                        </el-icon>
                                    </template>
                                    {{ item.cmd_cn }}
                                </ElButton>

                                <!-- temp btn -->
                                <ElButton v-else type="">
                                    <template v-if="!item.icon && item.svg_icon">
                                        <el-icon>
                                            <img :src="getFullImageUrl(item.svg_icon)"
                                                style="width: 100%; margin-right: 10px;" alt="icon" />
                                        </el-icon>
                                    </template>
                                    {{ item.cmd_cn }}
                                </ElButton>
                                <!-- <ElButton v-else type="" :icon="useIcon({ icon: item.icon })">{{ item.cmd_cn
                                    }}-{{ item.cmd_type }}
                                </ElButton> -->
                            </template>

                        </template>
                    </el-col>
                </el-row>

                <!-- 表格  通过 el-table-column 动态生成表格列，并且在每一列中动态绑定对应的行数据 -->
                <!-- 动态生成表格列：使用 v-for 循环遍历 tableData.cols_show，并动态生成 el-table-column。
                    绑定列属性：使用 :prop="item.my_column_name" 动态绑定列的属性名称，这样每一列都会自动对应到 rows 中的相应字段。
                    显示数据：在 el-table-column 的 default 插槽中，通过 scope.row[item.my_column_name] 动态获取并显示每一行的对应列数据。 -->
                <el-table :scrollbar-always-on="false" :data="tableData.rows" style="width: 100%" border
                    sortable="custom" @sort-change="tableSortHandle" max-height="calc(100vh - 200px)" id="tce_table"
                    @selection-change="handleSelectionChange" class="tce_table">
                    <!-- 复选框:根据tableData.table_cmds里是否有cmd_type == 1的 进行条件渲染 -->
                    <el-table-column type="selection" width="40" v-if="tableData.table_cmds.some(item =>
                        item.cmd_type == 1 ||
                        item.cmd_type == 8 ||
                        item.cmd_type == 11 ||
                        item?.class == 'coding-ajax-batch-checked-download' ||
                        item?.class == 'coding-ajax-delete-batch')" />
                    <!-- 表格列 -->
                    <el-table-column v-for="(item, index) in Object.values(tableData.cols_show)" :key="index"
                        :prop="item.my_column_name" :label="item.vi_name" :sortable="!!item.sortable"
                        :width="tableColWidth?.[item.my_column_name] ||
                            getColumnWidth(item.my_column_name, tableData.rows, index === Object.values(tableData.cols_show).length - 1, item.vi_name)" :min-width="tableColWidth?.['default']">
                        <template #default="scope">
                            <div>
                                <!--  行为类型/角色/对象 -->
                                <span v-if="FieldTypeChecker.isSelectField(item)">
                                    {{
                                        tableData.cols_show?.[item.my_column_name]?.relative_list?.[scope.row[item.my_column_name]]
                                    }}
                                </span>
                                <!-- switch 单选 -->
                                <template v-else-if="FieldTypeChecker.isSwitchField(item)">
                                    <template v-if="!!scope.row[item.my_column_name]">
                                        <el-tag type="primary">是</el-tag>
                                    </template>
                                    <template v-else>
                                        <el-tag type="info">否</el-tag>
                                    </template>
                                </template>
                                <!-- vue图标 -->
                                <template v-else-if="FieldTypeChecker.isVueIconField(item)">
                                    <template v-if="scope.row[item.my_column_name]">
                                        <el-button size="large" link
                                            :icon="useIcon({ icon: scope.row[item.my_column_name] })" />
                                    </template>
                                </template>
                                <!-- 图片 -->
                                <a v-else-if="FieldTypeChecker.isAvatarField(item)"
                                    :href="scope.row[item.my_column_name] ? getFullImageUrl(scope.row[item.my_column_name]) : ''"
                                    target="_blank">
                                    <img style="width: 40px;"
                                        :src="scope.row[item.my_column_name] ? getFullImageUrl(scope.row[item.my_column_name]) : ''" />
                                </a>
                                <!-- 列表页编辑 可编辑的项 ajax_field -->
                                <template v-else-if="!!item.ajax_field">
                                    <template v-if="scope.row[item.my_column_name]">
                                        <span contenteditable style="cursor: text;"
                                            @blur="tableItemEditHandle($event, item, scope.row)">
                                            {{ scope.row[item.my_column_name] }}<el-icon>
                                                <EditPen />
                                            </el-icon>
                                        </span>
                                    </template>
                                </template>
                                <!-- 其它 -->
                                <span v-else style="margin-left: 10px">
                                    {{ scope.row[item.my_column_name] }}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- 操作列-表格项命令(_coding_list_cmds_json) -->
                    <!-- prop, tableData, title -->
                    <!-- <el-table-column label="操作" :width="getWidthByContent(tableData.rows[0]?._coding_list_cmds_json)" -->
                    <el-table-column label="操作" :width="getWidthByContent(tableData.rows)" fixed="right">
                        <template #default="scope">
                            <div class="flex">
                                <template v-for="(cmd) in scope?.row?._coding_list_cmds_json" :key="cmd.id">
                                    <!-- 1 异步删除，弹窗确认，调用接口 -->
                                    <template v-if="cmd.cmd_type == 1">
                                        <el-popconfirm :title="cmd.cmd_tips || '确定执行此操作?'"
                                            @confirm="tableItemCMD_Handle({ ...cmd, row: scope.row })">
                                            <template #reference>
                                                <el-button :size="'small'" :type="'primary'">
                                                    {{ cmd.cmd_cn || '' }}</el-button>
                                            </template>
                                        </el-popconfirm>
                                    </template>
                                    <!-- 2 main_reload 新组件拿uri数据渲染，添加数据 /// -->
                                    <!-- 3 [已弃用] 但有编辑 -->
                                    <!-- 4 新窗口打开 -->
                                    <!-- 6 执行命令，有cmd_tips则弹窗确认 -->
                                    <template v-else>
                                        <ElButton :size="'small'" :type="'primary'" :data-cmd-type="cmd.cmd_type"
                                            @click="tableItemCMD_Handle({ ...cmd, row: scope.row })">
                                            {{ cmd.cmd_cn || '' }}
                                        </ElButton>
                                    </template>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="demo-pagination-block mt-[20px]">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="per_page"
                        :page-sizes="[10, 50, 100, 200]" background layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.total_rows" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </template>

        </ContentWrap>



        <!-- 查看详情弹出框 -->
        <el-dialog v-model="lookDialogVisible" class="font-700 max-h-[90%] overflow-auto" :title="'查看'">
            <LookForm :rowData="currentRow" :fieldsData="lookDataFields" />
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog v-model="editDialogVisible" :title="editDialogTitle">
            <FormComponent :uri="editComponentUri" :isEdit="true" :key="editComponentUri"
                @submitEvent="editSubmitHandler" />
        </el-dialog>

        <!-- 添加数据弹窗 -->
        <Dialog v-if="tableAddData" v-model="addTableDialogVisible" :title="`添加${tableData.table?.table_name_cn}`">

            <!-- TODO: type 为2，刷新主页面，先这样 -->
            <FormComponent :uri="editComponentUri" :key="editComponentUri" @submitEvent="editSubmitHandler" />

            <!-- <template #footer>
                <el-button type="primary" @click="tableCMD_HandleAddSubmit">提交</el-button>
                <el-button @click="addTableDialogVisible = false">关闭</el-button>
            </template> -->
        </Dialog>

        <!-- 搜索条件选择弹窗 -->
        <DialogSelect class="max-h-[90vh]" v-model="serchDialogVisible"
            :title="tableSelectData?.table?.table_name_cn + '选择'">
        </DialogSelect>

    </div>
</template>

<script lang="ts" setup>
import {
    FieldTypeChecker, formatValue,
    isEditable, getFullImageUrl,
    getTableSelectNamePath, getExternalFileValue,
    determinePageType, getWidthByContent, getColumnWidth
} from "@/utils";
import {
    deleteTableRowApi,
    editTableRowGetApi,
    editTableRowPostApi,
    getTableDataApi,
    getTableRowDatailApi,
    getTableSelectDataApi
} from "@/api/table/tableApi";
import { computed, ref, provide, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import type { TableData } from '@/api/table/Table'
import {
    ElTable, ElTableColumn, ElPagination,
    ElButton, ElForm, ElFormItem, ElInput,
    ElDatePicker, ElSelect, ElOption,
    ElRow, ElCol, ElDivider, ElDialog,
    ElAvatar, ElMessage, ElMessageBox,
    ElEmpty, ElPopover, ElPopconfirm,
    ElButtonGroup, ElIcon, ElSwitch, ElTag
} from 'element-plus';
import { ContentWrap } from "@/components/ContentWrap";
import request from '@/axios'
import { useAppStore } from '@/store/modules/app'
import { Dialog } from '@/components/Dialog';
import router from "@/router";
import { SUCCESS_CODE } from "@/constants";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTagsViewStore } from "@/store/modules/tagsView";
import DialogSelect from '@/components/MyComponent/DialogSelect.vue';
import LookForm from '@/views/Form/LookForm.vue';
import FormComponent from '@/components/MyComponent/EditComponent.vue';
import AuthSelect from "@/components/MyComponent/AuthSelect.vue";
import { EditPen } from '@element-plus/icons-vue'

// 图标
import { useIcon } from '@/hooks/web/useIcon';
import axios from "@/axios";


const route = useRoute();
const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
// const baseURL = import.meta.env.VITE_API_BASE_PATH_URL || '';

// onMounted(() => {
//     // console.log(route)
//     // console.log('document.title',document.title)
//     console.log(tableData.value);
//     document.title = tableData.value?.table?.table_name_cn
// })


// 分页
const offset = ref(0) // 偏移量
const per_page = ref(50) // 每页条数
// 计算当前页码
const currentPage = computed(() => {
    // 计算当前页码：通过偏移量除以每页条数并向下取整，然后加1
    return Math.floor(offset.value / per_page.value) + 1;
})


// 搜索表单数据
const searchForm = ref<Record<string, any>>({});

// 表格信息整体
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
    rows_list_search_form: "",
    form_load_view_file: ""
})

// 获取数据时的loading状态
const loading = ref(false)

// 当前选中的行数据
const currentRow = ref<Record<string, any>>({});
const lookDialogVisible = ref(false); // 查看详情弹出框
const editDialogVisible = ref(false); // 编辑详情弹出框
const editComponentUri = ref(''); // 编辑组件的uri

// 多选选中的数据
const multipleSelection = ref<any[]>([])

// 添加数据弹窗
const addTableDialogVisible = ref(false)

// 表格添加时的表单数据
const tableAddData = ref();
const tableAddDataForm = ref({});

// 查看某项数据显示的字段数据
const lookDataFields = ref({});
// 编辑某项数据的字段表单数据
const editDataForm = ref({});

// 条件搜索表单组件的弹窗状态
const serchDialogVisible = ref(false)

// 弹框标题
const editDialogTitle = ref("编辑")

// 弹框选择的tPath
const tableSelectNamePath = ref();
// 弹窗选择数据
const tableSelectData = ref();
// 弹窗选择-当前表单项字段
const tableSelectField = ref();
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

// 表格列宽度
const tableColWidth = ref();
// 排序字段
const tableSortField = ref();



getTableData()
// getTableColWidth()



// 表格排序事件
async function tableSortHandle(e: any) {
    // console.log('表格排序事件', e);
    let sortStr = e.order == 'ascending' ? 'asc' : (e.order == 'descending' ? 'desc' : '')
    let fieldName = 't.' + e.prop
    if (sortStr) {
        tableSortField.value = fieldName + ' ' + sortStr
    } else {
        tableSortField.value = ''
    }

    // 排序请求
    getTableData()
}

// 修改表格项编辑 ajax_field
async function tableItemEditHandle(e: Event, item: any, row: any) {
    // console.log('修改表格项编辑 ajax_field', item, row);
    let tableName = tableData.value.table.my_table_name
    let fieldName = item.my_column_name
    let itemId = row.id
    let value = e.target?.innerText

    // 如果数据没有改变，则不提交
    if (row[fieldName] == value) {
        return
    }

    // console.log(tableName, fieldName, itemId, value);
    let res = await request.post({
        url: window.app_base_url + `/Table/ajax_field/${tableName}/${fieldName}/${itemId}`,
        data: {
            [fieldName]: value
        }
    })
    // console.log(res);
    if (res.code == SUCCESS_CODE) {
        ElMessage({
            message: res.msg,
            type: 'success',
        })
        getTableData()
        return
    }
    ElMessage({
        message: res.msg,
        type: 'error',
    })
}

// 弹窗选择点击事件
const tableSelectHandle = (row: any, tableName: string) => {
    console.log('触发了上级组件中的函数', row, tableName);
    // searchForm.value[tableSelectField.value] = row.id
    searchForm.value[tableSelectField.value] = row[tableSelectField.value] ? row[tableSelectField.value] : row.id
    if (!tableSelectObjData.value[tableName]) { // 初始化
        tableSelectObjData.value[tableName] = []
    }
    tableSelectObjData.value[tableName].push(row) // 记录点击后的数据，用于回显

    // 关闭弹窗
    serchDialogVisible.value = false
};

// 提供给下级组件
provide('triggerFunction', tableSelectHandle); // 弹窗选择点击事件
provide('tableSelectNamePath', tableSelectNamePath); // 弹窗选择-当前表单项字段


// console.log("getExternalFileValue('sort')", getExternalFileValue('sort'))


// 获取表格列宽度 [public/table-col.json]
async function getTableColWidth() {
    tableColWidth.value = await getExternalFileValue()
};


// 表格弹窗-选择数据
async function tableDialogSelectHandle(data: any) {
    // 获取表名
    // console.log(data);
    tableSelectNamePath.value = getTableSelectNamePath(data)
    // console.log(tableSelectNamePath.value, 'xxxxxxxxxxxxx');

    // tips: 这个请求如有改变那么组件TableComponent.vue 也需要修改[暂且这样]
    // let res = await request.post({
    //     'url': `/Table/table_select/${tableSelectNamePath.value}/id`,
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded' // 使请求的参数为表单格式
    //     },
    //     data: searchForm.value
    // })
    // 仅仅为了回显表名
    let res = await getTableSelectDataApi(tableSelectNamePath.value)
    tableSelectData.value = res.data
    // 显示弹窗
    serchDialogVisible.value = true
    // 记录当前表单项字段，用于选择后数据填充到表单项
    tableSelectField.value = data.my_column_name
};

// 获取表格数据
async function getTableData() {
    tableData.value.rows = []
    // 处理数据：将搜索条件中值为日期范围的值，转换为_xxx_max  _xxx_min
    for (const key in searchForm.value) {
        // 是否已time结尾 && 是否是数组
        if (key.endsWith('time') && Array.isArray(searchForm.value[key])) {
            searchForm.value[`_${key}_max`] = searchForm.value[key][1]
            searchForm.value[`_${key}_min`] = searchForm.value[key][0]
        }
    }


    let res;
    if (route.query.url) {
        loading.value = true

        // 排序请求
        if (tableSortField.value) {
            offset.value = 0
            res = await request.post({
                url: route.query.url as string,
                params: { // 分页参数
                    offset: offset.value,
                    per_page: per_page.value
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // 使请求的参数为表单格式
                },
                data: { ...searchForm.value, table_sort: tableSortField.value } // 搜索条件
            })
        } else {
            // 常规请求
            res = await request.post({
                url: route.query.url as string,
                params: { // 分页参数
                    offset: offset.value,
                    per_page: per_page.value
                },
                data: searchForm.value // 搜索条件
            })
        }





        // res = await axios.get(route.query.url as string)
    } else {
        ElMessage({ message: '请检查url' })
        return
    }


    tableData.value = res.data

    // 关闭loading
    loading.value = false

    // 将路由添加到标签栏
    // console.log('router.currentRoute.value',router.currentRoute.value)
    router.currentRoute.value.meta.title = tableData.value?.table?.table_name_cn
    tagsViewStore.addVisitedView({ // 不缓存
        ...router.currentRoute.value,
        icon: 'Aim'
        // name: tableData.value?.table?.table_name_cn
    })

    // 设置网页标题
    document.title = tableData.value?.table?.table_name_cn
};

// 处理搜索
async function handleSearch() {
    console.log('搜索条件:', searchForm.value);
    // 在这里添加搜索逻辑，例如调用API并传递搜索条件

    // let searchRes = await request.post({
    //     url: route.query.uri as string,
    //     data: {
    //         ...searchForm.value
    //     },
    //     params: {
    //         offset: offset.value,
    //         per_page: per_page.value
    //     }
    // })
    // console.log('searchRes', searchRes)
    // create_time 是一个数组，分别为开始时间和结束时间
    // if (searchForm.value['create_time']?.length) {
    //     searchForm.value['_create_time_min'] = searchForm.value['create_time'][0]
    //     searchForm.value['_create_time_max'] = searchForm.value['create_time'][1]
    // }

    getTableData()
};
// 处理重置
function handleReset() {
    for (const key in searchForm.value) {
        searchForm.value[key] = null;
    }
    // 重置后可以重新获取数据或清空表格内容
};

// 查看操作
async function handleView(row: any) {
    console.log('查看:', row);
    if (appStore.getFormIsOpen) {
        currentRow.value = { ...row };
        formatValue(currentRow);

        lookDialogVisible.value = true; // 先显示弹框，再加载数据
        let res = await getTableRowDatailApi((route.params.tableName || route.query.tName) as string, row.id);
        lookDataFields.value = res.data;
    } else {
        router.push(`/form/look?tableName=${(route.params.tableName || route.query.tName) as string}&id=${row.id}`);
    }
};

// 删除操作
function handleDelete(row: any) {
    // console.log('删除:', row);
    ElMessageBox.confirm('确定要删除这条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        // 执行删除操作
        let delRes = await deleteTableRowApi((route.params.tableName || route.query.tName) as string, row.id)
        // console.log('delRes',delRes)
        if (delRes.code == SUCCESS_CODE) {
            ElMessage({
                type: 'success',
                message: delRes.msg,
            })
            getTableData() // 重新获取数据
        } else {
            ElMessage({
                type: 'error',
                message: '失败: ' + delRes.msg,
            })
        }
    }).catch(() => {
        // 取消删除操作
    })
}

// 编辑操作 [原拼接tName数据]
async function handleEdit(row: any) {
    // console.log((route.params.tableName || route.query.tName) as string, row);
    // return
    // appStore.getFormIsOpen // 是否是弹窗的方式打开表单
    if (appStore.getFormIsOpen) {
        currentRow.value = { ...row };

        formatValue(currentRow) // 将某些字段值转换为字符串以解决下拉选择框回显问题

        let res = await editTableRowGetApi((route.params.tableName || route.query.tName) as string, row.id);
        console.log('res', res);
        editDataForm.value = res.data;
        editDialogVisible.value = true;

    } else {
        // 新页面打开
        router.push(`/form/edit?tableName=${(route.params.tableName || route.query.tName) as string}&id=${row.id}`)
    }

}

// 编辑提交操作
async function editSubmitHandler() {
    // console.log('编辑提交操作');
    // 关闭
    editDialogVisible.value = false;
    getTableData()
}


// 表格分页点击事件
const handleSizeChange = (val: number) => {
    // console.log(`${val} items per page`)
    // per_page.value = val
    // getTableData()

    // 更新每页条数
    per_page.value = val;
    // 重新计算偏移量
    offset.value = (currentPage.value - 1) * per_page.value;
    // 获取新的表格数据
    getTableData();
}

// 表格当前页点击事件
const handleCurrentChange = (val: number) => {
    // console.log(`current page: ${val}`)
    // offset.value = val
    // getTableData()

    // 更新偏移量
    offset.value = (val - 1) * per_page.value;
    // 获取新的表格数据
    getTableData();
}

// 表格多选框选择事件
const handleSelectionChange = (val: any[]) => {
    // multipleSelection.value = val
    // console.log(multipleSelection.value);
    // 抽取id
    let ids = []
    for (const item of val) {
        ids.push(item.id);
    }
    multipleSelection.value = ids;
}

// 表格命令：批量删除  ajax_delete 1
function tableCMD_AjaxDeleteHandle(cmdData: any) {
    // console.log('cmdData', cmdData)
    // console.log('批量删除:', multipleSelection.value);
    // 检查选中的项目数量
    if (!multipleSelection.value.length) {
        ElMessage({
            message: '请勾选要删除的项目',
            type: 'warning',
        })
    } else {
        ElMessageBox.confirm(
            cmdData.cmd_tips || `确定要删除选中的 ${multipleSelection.value.length} 项数据?`,
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(async () => {
            await batchDelHandler(cmdData);
        }).catch(() => { })
    }

}

// 批量删除执行操作
async function batchDelHandler(cmdData: any) {
    // 将所有id以逗号分隔
    let ids = multipleSelection.value.join(',');
    // console.log('cmdData',cmdData)
    // 执行删除操作
    let res = await request.post({
        url: cmdData.cmd_uri,
        data: { ids },
        // params: {ids}
    });
    console.log('res', res);
    if (res.code == 0) {
        ElMessage({
            message: res.data.msg,
            type: 'success',
        });
        // 刷新表格数据
        // getTableData()
    } else {
        ElMessage({
            message: res.data.msg,
            type: 'warning',
        });
    }
}

// 表格命令：mainReload 点击事件 type=2
async function tableCMD_MainReloadHandler(cmdData: any) {
    // appStore.getFormIsOpen // 是否是弹窗的方式打开表单
    console.log(cmdData);


    // 回到 /admin 页让 determinePageType 判断页面类型进行跳转
    router.push({
        path: '/admin',
        query: { url: cmdData.cmd_uri }
    })
    return

    // 处理uri 
    // let uri = [...new Set(cmdData.cmd_uri.split('/'))].join('/')
    // // console.log('uri', uri)
    // // console.log('url', url)
    // // console.log(determinePageType(uri), 'determinePageType')
    // // if (uri.includes('/Table/table')) {
    // if (determinePageType(uri) == 'table') {
    //     const getTableNameFromUrl = (url) => {
    //         const match = url.match(/\/Table\/table\/(.+)$/) || url.match(/\/Admin\/Table\/table\/(.+)$/);
    //         return match ? match[1] : '';
    //     };
    //     const tableName = getTableNameFromUrl(uri); // 获取表名
    //     router.push({ path: `/admin`, query: { uri: uri, tName: tableName } });
    //     return;
    // }
    // router.push(`/form/edit?uri=${uri}`)
};
// 表格命令：添加数据
async function tableCMD_HandleAddSubmit() {
    // console.log('保存数据:', tableAddData.value);
    // addTableDialogVisible

    let url = tableAddData.value.form_action
    let res = await request.post({ url, data: tableAddDataForm.value })
    // console.log('res', res)
    if (res.code == 0) {
        addTableDialogVisible.value = false;
        ElMessage({
            message: `${res.msg}`,
            type: 'success',
            duration: 1500,
        })
        // 刷新表格数据
        getTableData()
        // 重置表单
        tableAddDataForm.value = {}

    } else {
        ElMessage({
            message: `失败: ${res.msg}`,
            type: 'warning',
        })
    }
};
// 表格命令：4 _blank  新窗口打开
async function tableCMD_HandleOpenNewWindow(cmdData: any) {
    // console.log(cmdData);
    let targetURL = cmdData.cmd_uri.startsWith('http') ? cmdData.cmd_uri : window.app_base_url + cmdData.cmd_uri;
    // console.log('targetURL', targetURL)
    window.open(targetURL)
};
// 表格命令：7 ajax_cmd [tips提示确认 确认调uri
function tableCMD_AjaxCmdHandle(cmdData: any) {
    // console.log(cmdData);
    // 将搜索条件参数以post请求新页面打开
    openNewPageWithSearchPost(cmdData.cmd_uri)
};


// 表格项命令：动态处理[属性/升级/彻底删除]
async function tableItemCMD_Handle(cmdData: any) {
    // console.log('cmdData', cmdData)
    let { cmd_uri, cmd_type, row } = cmdData;
    if (cmd_type == 2) { // table 表中表
        console.log('2 cmd_uri', cmd_uri);
        // console.log('/table?tName=' + (<string>cmd_uri).replace('/Table/table', '') + (row.my_table_name || '/' + row.id));
        if (cmd_uri.startsWith('http')) {
            // 判断页面类型
            let pageType = await determinePageType(cmd_uri, null)
            if (pageType == 'table') {
                router.push('/table?url=' + cmd_uri)
            } else if (pageType == 'form') {
                router.push(`/form/edit?uri=${cmdData.cmd_uri}&id=${cmdData.row.id}`)
            }
        } else {
            ElMessage({
                message: 'URL 不是绝对路径',
                type: 'warning',
            })
        }
    } else if (cmd_type == 1) { // 异步删除
        // console.log('1', cmd_uri);
        // console.log(cmd_uri + (row.my_table_name || '/' + row.id));
        // return
        // let execRes = await request.post({ url: cmd_uri + (row.my_table_name || '/' + row.id) })
        let execRes = await request.post({ url: cmd_uri })
        if (execRes.code == SUCCESS_CODE) {
            ElMessage({ message: execRes.msg, type: 'success' })
            getTableData()
            return
        }
        ElMessage({ message: execRes.msg, type: 'warning' })
    } else if (cmd_type == 3) { // [已弃用]
        if (cmdData.cmd_cn == '编辑') { // 传id是因为编辑页面需要id来判断是添加还是编辑
            // console.log(cmdData, 'cmdData edit');
            router.push(`/form/edit?uri=${cmdData.cmd_uri}&id=${cmdData.row.id}`)
            return
        };
        ElMessage({ message: '此命令已弃用', type: 'warning' })
    } else if (cmd_type == 4) { // 新窗口打开
        let targetURL = cmdData.cmd_uri.startsWith('http') ? cmdData.cmd_uri : window.app_base_url + cmdData.cmd_uri;
        window.open(targetURL)
    } else if (cmd_type == 6) { // 执行命令，有cmd_tips则弹窗确认
        // console.log('cmdData', cmdData)
        ElMessageBox.confirm(cmdData.cmd_tips || '确定执行此操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            let execRes = await request.post({ url: cmd_uri })
            if (execRes.code == SUCCESS_CODE) {
                ElMessage({ message: execRes.msg, type: 'success' })
                getTableData()
                return
            }
            ElMessage({ message: execRes.msg, type: 'warning' })
        }).catch(() => { })
    } else if (cmd_type == 0 || cmd_type == 5) { // 弹窗编辑表单
        // console.log('cmdData', cmdData)
        editComponentUri.value = cmdData.cmd_uri;
        editDialogVisible.value = true;
    } else {
        console.log(cmdData);
        ElMessage({ message: '未知的命令类型或已弃用', type: 'warning' })
    }
};


// 导出Exel
const exportExcel = (item: any) => {
    // console.log(item);
    // 勾选导出coding-ajax-batch-checked-download
    if (item.class == 'coding-ajax-batch-checked-download') {
        // 判断有没有选中的数据
        if (multipleSelection.value.length) {
            // 处理选中数据的导出逻辑
            const selectedRows = tableData.value.rows.filter(row => multipleSelection.value.includes(row.id));
            exportToExcel(selectedRows, 'selected_table_data.xlsx');
        } else {
            ElMessage({
                message: '请勾选要导出的数据',
                type: 'warning',
            })
        }
    } else if (item.class == 'coding-blank-search-form') {
        // 检索导出coding-blank-search-form
        // create_time 是一个数组，分别为开始时间和结束时间
        openNewPageWithSearchPost(item.cmd_uri);
    }
};
// 导出 Excel 的逻辑封装成单独的函数
const exportToExcel = (rows, fileName) => {
    // 创建一个工作簿
    const wb = XLSX.utils.book_new();

    let visibleColumns;
    if (tableData.value.table.xls_download_column) {
        const downloadColumns = tableData.value.table.xls_download_column.split(',');
        visibleColumns = downloadColumns.map(col => {
            return {
                my_column_name: col,
                ...tableData.value.all_cols[col]
            };
        });
    } else {
        visibleColumns = Object.values(tableData.value.cols_show); // 获取可见列
    }

    console.log('visibleColumns', visibleColumns)
    let data = formatTableData(rows, visibleColumns); // 格式化数据

    console.log('data', data)

    // 将数据转换为工作表
    const jsonData = data.map(row => {
        const formattedRow = {};
        visibleColumns.forEach(col => { // 取中文表头
            formattedRow[col.vi_name] = row[col.my_column_name];
        });
        return formattedRow;
    });
    const ws = XLSX.utils.json_to_sheet(jsonData);

    // 表头样式
    const headerRange = XLSX.utils.decode_range(ws['!ref'] ?? '');
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!ws[address]) continue;
        ws[address].s = {
            font: {
                name: 'Arial',
                sz: 14,
                bold: true,
                color: { rgb: "FFFFFF" }
            },
            fill: {
                fgColor: { rgb: "4F81BD" }
            },
            alignment: {
                vertical: "center",
                horizontal: "center"
            },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };
    }
    // 设置列宽
    ws['!cols'] = visibleColumns.map(col => ({ wpx: col.width || 130 }));

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 生成 Excel 文件并触发下载
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName);
};
// 提取并格式化数据
const formatTableData = (rows, columns) => {
    return rows.map(row => {
        const formattedRow = {};
        columns.forEach(col => {
            formattedRow[col.my_column_name] = row[col.my_column_name];
        });
        return formattedRow;
    });
};

// 批量弹框操作
// 批量修改名称，批量修改排序 11
// 选中后点击将项的id逗号拼接到uri尾部进行get请求得到表单数据进行渲染,提交表单则是post请求uri
// 批量修改操作
async function handleBatchEdit(cmdData: any) {
    // 检查是否有选中的项目
    if (!multipleSelection.value.length) {
        ElMessage({
            message: '请勾选要修改的项目',
            type: 'warning',
        });
        return;
    }

    // 拼接选中项的id
    const ids = multipleSelection.value.join(',');

    // console.log('cmdData', cmdData)
    let uri = `${cmdData.cmd_uri}/${ids}`
    // console.log('uri', uri)
    editComponentUri.value = uri;
    editDialogVisible.value = true;
    return


    // 获取表单数据
    const res = await request.get({ url: `${cmdData.cmd_uri}/${ids}` });
    if (res.code === SUCCESS_CODE) {
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        // 打开弹窗并渲染表单数据
        console.log('data', data)
        editDialogTitle.value = cmdData.cmd_cn;
        editDialogVisible.value = true;
        editDataForm.value = data;
    } else {
        ElMessage({
            message: `获取表单数据失败: ${res.msg}`,
            type: 'error',
        });
    }
}


// 携带搜索条件参数新页面post请求后端
// 创建一个表单并提交以打开新页面
function openNewPageWithSearchPost(uri: string) {
    if (searchForm.value['create_time']?.length) {
        searchForm.value['_create_time_min'] = searchForm.value['create_time'][0];
        searchForm.value['_create_time_max'] = searchForm.value['create_time'][1];
    }
    // let url = import.meta.env.VITE_API_BASE_PATH_URL + item.cmd_uri + '?__API_TMP_TEST_82__=1';
    // // // 去重
    // url = [...new Set(urlArr)].join('/');

    // let url = window.app_base_url + uri;
    let url = uri;

    console.log('uri', uri)
    console.log('url', url)

    let form = document.createElement('form');
    form.action = url;
    form.method = 'POST';
    form.target = '_blank';

    // 添加搜索条件参数到表单
    for (let key in searchForm.value) {
        if (searchForm.value.hasOwnProperty(key)) {
            let input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = searchForm.value[key];
            form.appendChild(input);
        }
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};
</script>

<style scoped>
.field-container {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.field-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eaeaea;
}

.field-label {
    font-weight: bold;
    color: #333;
}

.field-value {
    color: #666;
}

.tce_table.el-table .cell {
    display: flex;
}
</style>

<style>
/* 隐藏元素UI Table的垂直滚动条 */
.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: auto !important;
}

/* 隐藏滚动条的样式 */
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    display: none;
    /* 针对Webkit浏览器 */
}

.el-table--scrollable-y .el-table__body-wrapper {
    -ms-overflow-style: none;
    /* 针对IE、Edge浏览器 */
    scrollbar-width: none;
    /* 针对Firefox浏览器 */
}

.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    display: none;
    /* 针对Webkit浏览器 */
}

.el-table--scrollable-y .el-table__body-wrapper {
    -ms-overflow-style: none;
    /* 针对IE、Edge浏览器 */
    scrollbar-width: none;
    /* 针对Firefox浏览器 */
}
</style>