<template>
    <!-- vue 总报警：Failed to resolve component: ContentWrap -->
    <!-- <ContentWrap v-loading="loading"> -->
            <div class="pb5" v-if="showBack">
                <el-button :type="'default'" @click="router.back()">返回上一级</el-button>
            </div>
    
            <!-- 单个表单 -->
            <template v-if="Object.keys(groupedFields).length == 1">
                <el-form :model="tableDataForm" v-loading="loading" :rules="rules" ref="tableFormEl" label-width="150px" @keyup.enter="handleSubmit">
                    <template v-for="(item, key) in Object.values(groupedFields)[0]" :key="key">
                        <!-- unknown_file_accept 条件渲染表单项 -->
                        <transition name="fade">
                            <template
                                v-if="key == 'unknown_file_accept' && tableDataForm['my_data_type'] == 'unknown_file'">
                                <el-form-item :label="item.vi_name" :prop="key" class="w-[90%]">
                                    <el-input v-model="tableDataForm[key]" class="input-width" />
                                    <span v-if="item.vi_des" v-html="item.vi_des"
                                        class="text-xs text-gray font-italic"></span>
                                </el-form-item>
                            </template>
                        </transition>
                        <el-form-item :label="item.vi_name" :prop="key" v-if="key != 'unknown_file_accept'" data-testttt="form-item">
                            <!-- 日期选择器 -->
                            <el-date-picker v-if="FieldTypeChecker.isDateField(item)" :type="item.my_column_type"
                                :disabled="!SacManage.has_auth_edit_field(item)" range-separator="-"
                                :start-placeholder="item.placeholder_search?.split(',')[0]"
                                :end-placeholder="item.placeholder_search?.split(',')[1]"
                                :format="`YYYY-MM-DD ${item.my_column_type == 'date' ? '' : 'HH:mm:ss'}`"
                                :value-format="`YYYY-MM-DD ${item.my_column_type == 'date' ? '' : 'HH:mm:ss'}`"
                                :disabled-date="(time) => time.getTime() < Date.now() - 8.64e7" v-model="tableDataForm[key]"
                                class="input-width" />
    
                            <!-- 头像/图片上传 -->
                            <template v-else-if="FieldTypeChecker.isAvatarField(item)">
                                <!-- 多个图片上传 {{ item.relative_multiple }} -->
                                <el-upload v-if="item.relative_multiple" class="upload-multiple"
                                    v-model:file-list="uploadFileList[key]" list-type="picture"
                                    :on-remove="handleRemove(key)" :http-request="createUploadHandler(item.my_column_name)"
                                    multiple :on-preview="handlePreview"
                                    :on-success="(response, file) => handleAvatarSuccess(response, file, key)"
                                    :before-upload="beforeAvatarUpload" accept="image/png,image/jpg,image/jpeg,.svg">
                                    <el-button type="primary">上传</el-button>
                                </el-upload>
    
                                <!-- 单个图片上传 -->
                                <el-upload v-else class="avatar-uploader" :disabled="!SacManage.has_auth_edit_field(item)"
                                    :http-request="createUploadHandler(item.my_column_name)" :show-file-list="false"
                                    :on-success="(response, file) => handleAvatarSuccess(response, file, key)"
                                    :before-upload="beforeAvatarUpload" accept="image/png,image/jpg,image/jpeg,.svg">
                                    <img v-if="tableDataForm[key]"
                                        :src="getFullImageUrl(tableDataForm[key + '_imageUrl'] || tableDataForm[key])"
                                        class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload>
                            </template>
    
                            <!-- switch 切换 -->
                            <el-switch v-else-if="FieldTypeChecker.isSwitchField(item)" v-model="tableDataForm[key]"
                                :disabled="!SacManage.has_auth_edit_field(item)" inline-prompt size="large"
                                :active-text="item.relative_list?.[1]" :inactive-text="item.relative_list?.[0]"
                                :active-value="1" :inactive-value="0" />
    
                            <!-- 富文本编辑器 -->
                            <template v-else-if="FieldTypeChecker.isRichTextField(item)">
                                <p>
                                    <Editor v-model="tableDataForm[key]" ref="editorRef" @html="handleHtml($event, key)"
                                        @change="editorChangeHandle(key)" :placeholder="item.placeholder_search" />
                                    <!-- 富文本查看源码弹窗 -->
                                    <el-dialog v-model="viewEditorDataDialogVisible" title="富文本源码" width="800">
                                        <el-input v-model="tableDataForm[key]" type="textarea"
                                            :autosize="{ minRows: 30 }" />
                                    </el-dialog>
                                </p>
                            </template>
    
                            <!-- 文件上传 -->
                            <template v-else-if="FieldTypeChecker.isFileUploadField(item)">
                                <!-- 多文件上传 -->
                                <div v-if="!!item.relative_multiple">
                                    <el-upload v-model:file-list="uploadFileList[key]" multiple :on-preview="handlePreview"
                                        :http-request="uploadHandlerMultiple(key)" :on-remove="handleRemove(key)"
                                        :on-success="(response, file) => handleAvatarSuccess(response, file, key)">
                                        <el-button type="primary">上传</el-button>
                                    </el-upload>
                                </div>
    
                                <!-- 单文件上传 -->
                                <TceUpload v-else v-model:model-value="tableDataForm[key]" :req-params="{
                                    table_name: tableData.table_name,
                                    field_name: item.my_column_name,
                                    fileType: item.my_data_type == 'video' ? '.mp4' : (item.unknown_file_accept?.includes('excel') ? '.xlsx,.xls' : item.my_data_type)
                                }" :disabled="!SacManage.has_auth_edit_field(item)" />
                            </template>
    
                            <!-- 弹框选择 -->
                            <template v-else-if="FieldTypeChecker.isPopupField(item)">
                                <div class="flex">
                                    <el-input v-model="tableDataForm[key]" class="popup-select-input" :disabled="!SacManage.has_auth_edit_field(item)"
                                        :placeholder="item.placeholder_search">
                                        <!-- 数据回显 -->
                                        <template #prefix>
                                            <template v-if="item.relative_col_show">
                                                <span v-for="showKey in item.relative_col_show.split(',')">
                                                    {{ computedShowValue(item, key, showKey) }}
                                                </span>
                                            </template>
                                            <template v-else>
                                                {{ computedShowValue(item, key) }}
                                            </template>
                                        </template>
                                        <template #append>
                                            <el-button type="primary" @click="tableDialogSelectHandle(item)"
                                                :disabled="!SacManage.has_auth_edit_field(item)">选择</el-button>
                                        </template>
                                    </el-input>
                                </div>
                            </template>
    
                            <!-- 腾讯坐标 -->
                            <div v-else-if="FieldTypeChecker.isQqmapLnglatField(item)" class="flex">
                                <el-input v-model="tableDataForm[key]" :placeholder="item.placeholder_search" />
                                <el-button type="primary" :icon="MapLocation" @click="handleGotoMap(item)" />
                            </div>
    
                            <!-- 百度坐标 -->
                            <div v-else-if="FieldTypeChecker.isBdmapLnglatField(item)" class="flex">
                                <el-input v-model="tableDataForm[key]" :placeholder="item.placeholder_search" />
                                <el-button type="primary" :icon="MapLocation" @click="handleGotoMap(item)" />
                            </div>
    
                            <!-- 高德坐标 -->
                            <div v-else-if="FieldTypeChecker.isGdmapLnglatField(item)" class="flex">
                                <el-input v-model="tableDataForm[key]" :placeholder="item.placeholder_search" />
                                <el-button type="primary" :icon="MapLocation" @click="handleGotoMap(item)" />
                            </div>
    
                            <!-- 月份选择 -->
                            <el-date-picker v-else-if="FieldTypeChecker.isMonthField(item)" v-model="tableDataForm[key]"
                                :disabled="!SacManage.has_auth_edit_field(item)" type="month"
                                :placeholder="item.placeholder_search || '选择月份'" :format="`YYYY-MM`"
                                :value-format="`YYYY-MM`" />
    
                            <!-- auth 字段 -->
                            <template v-else-if="FieldTypeChecker.isAuthField(item)">
                                <AuthSelect v-model:value="tableDataForm[key]" />
                            </template>
    
                            <!-- 下拉框/单-多选框 -->
                            <template v-else-if="FieldTypeChecker.isSelectField(item)">
                                <!-- 下拉选择-异步模糊检索 -->
                                <template v-if="item.search_field">
                                    <!-- <div>
                                    异步模糊检索
                                    tableDataForm[key]: {{ tableDataForm[key] }}
                                    asyncSearchData[key]: {{ asyncSearchData[key] }}
                                </div> -->
                                    <el-select v-model="tableDataForm[key]" :multiple="(!!item.relative_multiple)"
                                        filterable remote reserve-keyword :placeholder="item.placeholder_search || '请输入'"
                                        :remote-method="remoteMethod(item, key)" :loading="asyncSearchData[key]?.loading"
                                        style="width: 240px">
                                        <!-- 数据回显需要，如果 asyncSearchData[key] 为空，则去 tableDataForm[key] 中找 -->
                                        <!-- 因为 asyncSearchData[key] 是异步搜索的数据 -->
                                        <template v-if="asyncSearchData[key]">
                                            <el-option v-for="(item2, index2) in asyncSearchData[key]" :key="index2"
                                                :label="item2.name" :value="item2.id" />
                                        </template>
                                        <template v-else>
                                            <!-- value绑定值判断是因为 多选框的值是数组，单选框的值是字符串， 否则回显异常-->
                                            <el-option v-for="(item2, index2) in Object.entries(item.relative_list)"
                                                :key="+item2[0] + index2" :label="item2[1]"
                                                :value="(!!item.relative_multiple) ? item2[0] : +item2[0]" />
                                        </template>
                                        <!-- 请求动画 -->
                                        <template #loading>
                                            <svg class="circular" viewBox="0 0 50 50">
                                                <circle class="path" cx="25" cy="25" r="20" fill="none" />
                                            </svg>
                                        </template>
                                    </el-select>
                                </template>
                                <template v-else>
                                    <!-- 下拉框 -->
                                    <el-select v-if="Object.entries(item.relative_list).length > 10"
                                        :disabled="!SacManage.has_auth_edit_field(item)"
                                        :multiple="(!!item.relative_multiple)" v-model="tableDataForm[key]" clearable
                                        class="input-width" :placeholder="item.placeholder_search || '请选择'">
                                        <el-option v-if="item.relative_list"
                                            @click="key == 'my_data_type' ? inferFieldType(item2[0]) : null"
                                            v-for="(item2, index) in Object.entries(item.relative_list)" :key="index"
                                            :label="item2[1]" :value="(!!item.relative_multiple) ? item2[0] : +item2[0]" />
                                    </el-select>
                                    <template v-else>
                                        <!-- 多选框组 -->
                                        <el-checkbox-group v-if="(!!item.relative_multiple)" v-model="tableDataForm[key]"
                                            :disabled="!SacManage.has_auth_edit_field(item)" size="default"
                                            :placeholder="item.placeholder_search || '请选择'">
                                            <el-checkbox-button v-for="(item2, index) in Object.entries(item.relative_list)"
                                                :key="index" :label="item2[0]">
                                                {{ item2[1] }}
                                            </el-checkbox-button>
                                        </el-checkbox-group>
                                        <!-- 单选框组 -->
                                        <el-radio-group v-else v-model="tableDataForm[key]" size="default"
                                            :disabled="!SacManage.has_auth_edit_field(item)"
                                            :placeholder="item.placeholder_search || '请选择'">
                                            <el-radio-button v-if="item.relative_list"
                                                @click="key == 'my_data_type' ? inferFieldType(item2[0]) : null"
                                                v-for="(item2, index) in Object.entries(item.relative_list)" :key="index"
                                                :label="item2[0]">{{ item2[1] }}</el-radio-button>
                                        </el-radio-group>
                                    </template>
                                </template>
                            </template>
    
                            <!-- 多行文本域 -->
                            <el-input v-else-if="FieldTypeChecker.isTextareaField(item) == 3" v-model="tableDataForm[key]"
                                :disabled="!SacManage.has_auth_edit_field(item)" style="width: 100%"
                                :placeholder="item.placeholder_search || '请输入'" show-word-limit type="textarea" />
    
                            <!-- 默认整行输入框 -->
                            <el-input v-else :disabled="!SacManage.has_auth_edit_field(item) || item.my_column_name == 'id'"
                                v-model="tableDataForm[key]" :placeholder="item.placeholder_search || '请输入'" />
                            <!-- 描述 0普通管理员 1开发者 2超级管理员 -->
                            <!-- <template v-if="userStore.userInfo?.auth_role == 1 || userStore.userInfo?.auth_role == 2"> -->
                            <template v-if="(userStore.userInfo?.auth_role == 1) || (item?.vi_des_enabled)">
                                <span v-if="item.vi_des" v-html="item.vi_des" class="text-xs text-gray font-italic"></span>
                            </template>
                        </el-form-item>
                    </template>
                </el-form>
            </template>
            <!-- 多个表单 -->
            <el-tabs v-else v-model="activeTab" type="border-card" v-loading="loading">
                <el-tab-pane v-for="(fields, tag) in groupedFields" :key="tag" :label="tag">
                    <el-form :model="tableDataForm" :rules="rules" ref="tableFormEl" label-width="180px"
                        @keyup.enter="handleSubmit">
                        <template v-for="(item, key) in fields" :key="key">
                            <!-- unknown_file_accept 条件渲染表单项 -->
                            <transition name="fade">
                                <template
                                    v-if="key == 'unknown_file_accept' && tableDataForm['my_data_type'] == 'unknown_file'">
                                    <el-form-item :label="item.vi_name" :prop="key" class="w-[90%]">
                                        <el-input v-model="tableDataForm[key]" class="input-width"
                                            :placeholder="item.placeholder_search || '请输入'" />
                                        <span v-if="item.vi_des" v-html="item.vi_des"
                                            class="text-xs text-gray font-italic"></span>
                                    </el-form-item>
                                </template>
                            </transition>
                            <el-form-item :label="item.vi_name" :prop="key" class="w-[90%]"
                                v-if="key != 'unknown_file_accept'">
                                <!-- 日期选择器 :disabled="isEditable(item.auth)" -->
                                <el-date-picker v-if="FieldTypeChecker.isDateField(item)" :type="item.my_column_type"
                                    :disabled="!SacManage.has_auth_edit_field(item)"
                                    :format="`YYYY-MM-DD ${item.my_column_type == 'date' ? '' : 'HH:mm:ss'}`"
                                    :value-format="`YYYY-MM-DD ${item.my_column_type == 'date' ? '' : 'HH:mm:ss'}`"
                                    :disabled-date="(time) => time.getTime() < Date.now() - 8.64e7"
                                    v-model="tableDataForm[key]" class="input-width"
                                    :placeholder="item.placeholder_search || '请选择'" />
    
                                <!-- 头像/图片上传 -->
                                <template v-else-if="FieldTypeChecker.isAvatarField(item)">
                                    <!-- 多个图片上传 {{ item.relative_multiple }} -->
                                    <el-upload v-if="item.relative_multiple" class="upload-multiple"
                                        :disabled="!SacManage.has_auth_edit_field(item)"
                                        v-model:file-list="uploadFileList[key]" list-type="picture"
                                        :on-remove="handleRemove(key)"
                                        :http-request="createUploadHandler(item.my_column_name)" multiple
                                        :on-preview="handlePreview"
                                        :on-success="(response, file) => handleAvatarSuccess(response, file, key)"
                                        :before-upload="imageUploadCheck(key)" accept="image/png,image/jpg,image/jpeg,.svg">
                                        <el-button type="primary">上传</el-button>
                                    </el-upload>
    
                                    <!-- 单个图片上传 -->
                                    <el-upload v-else class="avatar-uploader"
                                        :disabled="!SacManage.has_auth_edit_field(item)"
                                        :http-request="createUploadHandler(item.my_column_name)" :show-file-list="false"
                                        :on-success="(response, file) => handleAvatarSuccess(response, file, key)"
                                        :before-upload="beforeAvatarUpload" accept="image/png,image/jpg,image/jpeg,.svg">
                                        <img v-if="tableDataForm[key]"
                                            :src="getFullImageUrl(tableDataForm[key + '_imageUrl'] || tableDataForm[key])"
                                            class="avatar" />
                                        <el-icon v-else class="avatar-uploader-icon">
                                            <Plus />
                                        </el-icon>
                                    </el-upload>
                                </template>
    
                                <!-- switch 切换 -->
                                <el-switch v-else-if="FieldTypeChecker.isSwitchField(item)" v-model="tableDataForm[key]"
                                    :disabled="!SacManage.has_auth_edit_field(item)" inline-prompt size="large"
                                    :active-text="item.relative_list?.[1]" :inactive-text="item.relative_list?.[0]"
                                    :active-value="1" :inactive-value="0" />
    
                                <!-- 富文本编辑器 -->
                                <template v-else-if="FieldTypeChecker.isRichTextField(item)">
                                    <p>
                                        <Editor v-model="tableDataForm[key]" ref="editorRef" @html="handleHtml($event, key)"
                                            @change="editorChangeHandle(key)"
                                            :placeholder="item.placeholder_search || '请输入'" />
                                        <!-- 富文本查看源码弹窗 -->
                                        <el-dialog v-model="viewEditorDataDialogVisible" title="富文本源码" width="800">
                                            <el-input v-model="tableDataForm[key]" type="textarea"
                                                :autosize="{ minRows: 30 }" />
                                        </el-dialog>
                                    </p>
                                </template>
    
                                <!-- 文件上传 -->
                                <template v-else-if="FieldTypeChecker.isFileUploadField(item)">
                                    <!-- 多文件上传 -->
                                    <div v-if="!!item.relative_multiple">
                                        <el-upload v-model:file-list="uploadFileList[key]" multiple
                                            :on-preview="handlePreview" :disabled="!SacManage.has_auth_edit_field(item)"
                                            :http-request="uploadHandlerMultiple(key)" :on-remove="handleRemove(key)"
                                            :on-success="(response, file) => handleAvatarSuccess(response, file, key)">
                                            <el-button type="primary">上传</el-button>
                                        </el-upload>
                                    </div>
                                    <!-- 单文件上传 -->
                                    <TceUpload v-else v-model:model-value="tableDataForm[key]" :req-params="{
                                        table_name: tableData.table_name,
                                        field_name: item.my_column_name,
                                        fileType: item.my_data_type == 'video' ? '.mp4' : (item.unknown_file_accept?.includes('excel') ? '.xlsx,.xls' : item.my_data_type)
                                    }" :disabled="!SacManage.has_auth_edit_field(item)" />
                                </template>
                                <!-- 弹框选择 -->
                                <template v-else-if="FieldTypeChecker.isPopupField(item)">
                                    <div class="flex">
                                        <el-input v-model="tableDataForm[key]"class="popup-select-input"
                                            :placeholder="item.placeholder_search || '请选择'"
                                            :disabled="!SacManage.has_auth_edit_field(item)">
                                            <!-- 数据回显 -->
                                            <template #prefix v-if="!!item.relative_col_show">
                                                <span v-for="showKey in item.relative_col_show?.split(',')">
                                                    {{ computedShowValue(item, key, showKey) }}
                                                </span>
                                            </template>
                                            <template #prefix v-else>
                                                {{ computedShowValue(item, key) }}
                                            </template>
                                            <template #append>
                                                <el-button :disabled="!SacManage.has_auth_edit_field(item)"
                                                    @click="tableDialogSelectHandle(item)" type="primary">选择</el-button>
                                            </template>
                                        </el-input>
                                    </div>
                                </template>
                                <!-- 腾讯坐标 -->
                                <div v-else-if="FieldTypeChecker.isQqmapLnglatField(item)" class="flex">
                                    <el-input v-model="tableDataForm[key]"
                                        :placeholder="item.placeholder_search || '请输入'" />
                                    <el-button type="primary" :icon="MapLocation" @click="handleGotoMap(item)" />
                                </div>
                                <!-- 百度坐标 -->
                                <div v-else-if="FieldTypeChecker.isBdmapLnglatField(item)" class="flex">
                                    <el-input v-model="tableDataForm[key]"
                                        :placeholder="item.placeholder_search || '请输入'" />
                                    <el-button type="primary" :icon="MapLocation" @click="handleGotoMap(item)" />
                                </div>
                                <!-- 高德坐标 -->
                                <div v-else-if="FieldTypeChecker.isGdmapLnglatField(item)" class="flex">
                                    <el-input v-model="tableDataForm[key]"
                                        :placeholder="item.placeholder_search || '请输入'" />
                                    <el-button type="primary" :icon="MapLocation" @click="handleGotoMap(item)" />
                                </div>
                                <!-- 月份选择 -->
                                <el-date-picker v-else-if="FieldTypeChecker.isMonthField(item)" v-model="tableDataForm[key]"
                                    :disabled="!SacManage.has_auth_edit_field(item)" type="month"
                                    :placeholder="item.placeholder_search || '选择月份'" :format="`YYYY-MM`"
                                    :value-format="`YYYY-MM`" />
                                <!-- auth 字段 -->
                                <template v-else-if="FieldTypeChecker.isAuthField(item)">
                                    <AuthSelect v-model:value="tableDataForm[key]" />
                                </template>
    
                                <!-- 下拉框/单-多选框 -->
                                <template v-else-if="FieldTypeChecker.isSelectField(item)">
                                    <!-- 下拉选择-异步模糊检索 -->
                                    <template v-if="item.search_field">
                                        <el-select v-model="tableDataForm[key]" :multiple="(!!item.relative_multiple)"
                                            filterable remote reserve-keyword
                                            :placeholder="item.placeholder_search || '请输入'"
                                            :remote-method="remoteMethod(item, key)"
                                            :loading="asyncSearchData[key]?.loading" style="width: 240px">
                                            <!-- 数据回显需要，如果 asyncSearchData[key] 为空，则去 tableDataForm[key] 中找 -->
                                            <!-- 因为 asyncSearchData[key] 是异步搜索的数据 -->
                                            <template v-if="asyncSearchData[key]">
                                                <el-option v-for="(item2, index2) in asyncSearchData[key]" :key="index2"
                                                    :label="item2.name" :value="item2.id" />
                                            </template>
                                            <template v-else>
                                                <!-- value绑定值判断是因为 多选框的值是数组，单选框的值是字符串， 否则回显异常-->
                                                <el-option v-for="(item2, index2) in Object.entries(item.relative_list)"
                                                    :key="+item2[0] + index2" :label="item2[1]"
                                                    :value="(!!item.relative_multiple) ? item2[0] : +item2[0]" />
                                            </template>
                                            <!-- 请求动画 -->
                                            <template #loading>
                                                <svg class="circular" viewBox="0 0 50 50">
                                                    <circle class="path" cx="25" cy="25" r="20" fill="none" />
                                                </svg>
                                            </template>
                                        </el-select>
                                    </template>
                                    <template v-else>
                                        <!-- 下拉框 -->
                                        <el-select v-if="Object.entries(item.relative_list).length > 10"
                                            :placeholder="item.placeholder_search || '不限'"
                                            :disabled="!SacManage.has_auth_edit_field(item)"
                                            :multiple="(!!item.relative_multiple)" v-model="tableDataForm[key]" clearable
                                            class="input-width">
                                            <el-option v-if="item.relative_list"
                                                @click="key == 'my_data_type' ? inferFieldType(item2[0]) : null"
                                                v-for="(item2, index) in Object.entries(item.relative_list)" :key="index"
                                                :label="item2[1]"
                                                :value="(!!item.relative_multiple) ? item2[0] : +item2[0]" />
                                        </el-select>
                                        <template v-else>
                                            <!-- 多选框组 -->
                                            <el-checkbox-group v-if="(!!item.relative_multiple)"
                                                v-model="tableDataForm[key]"
                                                :disabled="!SacManage.has_auth_edit_field(item)" size="default"
                                                :placeholder="item.placeholder_search">
                                                <el-checkbox-button
                                                    v-for="(item2, index) in Object.entries(item.relative_list)"
                                                    :key="index" :label="item2[0]">
                                                    {{ item2[1] }}
                                                </el-checkbox-button>
                                            </el-checkbox-group>
                                            <!-- 单选框组 -->
                                            <el-radio-group v-else v-model="tableDataForm[key]" size="default"
                                                :disabled="!SacManage.has_auth_edit_field(item)"
                                                :placeholder="item.placeholder_search">
                                                <el-radio-button v-if="item.relative_list"
                                                    @click="key == 'my_data_type' ? inferFieldType(item2[0]) : null"
                                                    v-for="(item2, index) in Object.entries(item.relative_list)"
                                                    :key="index" :label="item2[0]">{{ item2[1] }}</el-radio-button>
                                            </el-radio-group>
                                        </template>
                                    </template>
                                </template>
    
                                <!-- 多行文本域 -->
                                <el-input v-else-if="FieldTypeChecker.isTextareaField(item) == 3"
                                    v-model="tableDataForm[key]" :disabled="!SacManage.has_auth_edit_field(item)"
                                    style="width: 100%" :placeholder="item.placeholder_search || '请输入'" show-word-limit
                                    type="textarea" />
    
                                <!-- 默认整行输入框 -->
                                <el-input v-else
                                    :disabled="!SacManage.has_auth_edit_field(item) || item.my_column_name == 'id'"
                                    v-model="tableDataForm[key]" :placeholder="item.placeholder_search || '请输入'" />
                                <!-- 描述 0普通管理员 1开发者 2超级管理员 -->
                                <!-- <template v-if="userStore.userInfo?.auth_role == 1 || userStore.userInfo?.auth_role == 2"> -->
                                <template v-if="(userStore.userInfo?.auth_role == 1) || (item?.vi_des_enabled)">
                                    <span v-if="item.vi_des" v-html="item.vi_des"
                                        class="text-xs text-gray font-italic"></span>
                                </template>
                            </el-form-item>
                        </template>
                    </el-form>
    
                </el-tab-pane>
            </el-tabs>
    
            <!-- 提交按钮 -->
            <div class="pt5">
                <el-button type="primary" @click="handleSubmit(false)" v-if="!isEdit">提交并继续</el-button>
                <el-button type="primary" @click="handleSubmit(true)">提交</el-button>
            </div>
    <!-- </ContentWrap> -->

    <!-- 弹框选择 -->
    <DialogSelect v-model="dataDialogVisible" :title="tableSelectData?.table?.table_name_cn + '选择'" />
</template>

<script setup lang="ts">
import { defineProps, ref, computed, provide, onMounted, shallowRef, nextTick } from 'vue';
import { useRoute, useRouter } from "vue-router";
import {
    ElMessage, ElButton, ElForm,
    ElSelect, ElOption, ElFormItem, ElInput,
    ElDatePicker, ElUpload, ElIcon, ElTabs,
    ElTabPane, ElSwitch, ElRadioGroup,
    ElRadioButton, ElCheckboxGroup, ElCheckboxButton,
    ElDialog
} from 'element-plus';
import { Plus, MapLocation } from '@element-plus/icons-vue';
import { Editor } from '@/components/Editor';
import TceUpload from "@/components/MyComponent/Upload.vue";
import DialogSelect from '@/components/MyComponent/DialogSelect.vue';
import AuthSelect from '@/components/MyComponent/AuthSelect.vue';
import {
    FieldTypeChecker, isRequired,
    formatValue, isEditable, fileToBinary,
    objToFormData, getFullImageUrl, getTableSelectNamePath,
    formatTableSelectData, determinePageType,
    uploadFile
} from "@/utils";
import request from '@/axios';
import { editTableRowGetApi, editTableRowPostApi, getTableSelectDataApi } from '@/api/table/tableApi';
import { getFileUploadSliceGuidApi, uploadFileApi } from "@/api/other";
import { SUCCESS_CODE } from '@/constants';
import type { UploadProps, UploadUserFile } from 'element-plus';
import SacManage from '@/utils/SacManage';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore()


const props = defineProps({
    tableName: {
        type: String,
        required: false
    },
    id: {
        type: String,
        required: false
    },
    uri: {
        type: String,
        required: true
    },
    isEdit: {
        type: Boolean,
        required: false
    },
    showBack: {
        type: Boolean,
        required: false
    },
    // 提交事件
    submitEvent: {
        type: Function,
        required: false
    }
});

// console.log('props', props)

const emit = defineEmits(['submitEvent']);

const router = useRouter();
const route = useRoute();

const rules = ref({}); // 表单验证规则

const tableData = ref();
const tableDataForm = ref({});
const fields = ref({}); // 添加这行

const loading = ref(false);

const tableFormEl = ref(null);
const editorRef = ref(null);

const activeTab = ref('0');
const dataDialogVisible = ref(false);
const tableSelectData = ref({});
const tableSelectNamePath = ref('');
const tableSelectField = ref('');
const tableSelectObjData = ref({});
// 弹窗选择-当前表单项字段数据
const computedShowValue = computed(() => {
    return (item: any, key: string, showKey?: string) => {
        if (!tableDataForm.value[key]) return ''; // 表单项必须有值
        // console.log('key:', key, 'showKey:', showKey);
        let res = tableSelectObjData.value?.[item.relative_table]?.find(el => el[key] == tableDataForm.value[key] ||
            el.name == tableDataForm.value[key] ||
            el.id == tableDataForm.value[key]
        )
        // console.log('res', res);
        // console.log('tableSelectObjData',tableSelectObjData.value);
        // console.log('[showKey]', showKey, res?.[showKey]);
        return res?.[showKey || 'name']
    }
})
// 上传的文件列表 回显用
const uploadFileList = ref<{ [key: string]: UploadUserFile[] }>({
    // test_upl_more: [{
    //     name: '/uploads/element_admin/res_v2/16552b0f0d7779bd1686762966038f6e.s20253.w148.h129.png',
    //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    // }]
});

// 查看源码弹窗
const viewEditorDataDialogVisible = ref(false);

const tableSelectHandle = (row: any, tableName: string) => {
    tableDataForm.value[tableSelectField.value] = row[tableSelectField.value] ? row[tableSelectField.value] : row.id;
    if (!tableSelectObjData.value[tableName]) {
        tableSelectObjData.value[tableName] = [];
    }
    tableSelectObjData.value[tableName].push(row);
    dataDialogVisible.value = false;
};

provide('triggerFunction', tableSelectHandle);
provide('tableSelectNamePath', tableSelectNamePath);


// 异步模糊检索数据占位对象
const asyncSearchData = ref({});



getFormData();



// 富文本编辑器内容改变
function editorChangeHandle(key: string) {
    // console.log('editorChangeHandle', key);
    // 去除所有空格 
    // 只去除文本节点中的空格
    tableDataForm.value[key] = tableDataForm.value[key].replace(/>(\s+)</g, '><').replace(/\s{2,}/g, ' ');
}

// 模糊检索获取数据
function remoteMethod(fieldData: any, key: string) {
    return async (val: string) => {
        // console.log('fieldData',fieldData)
        // console.log('val', val);
        // console.log('key', key)

        // 转成表单数据
        let formData = objToFormData({ name: val });
        let uri = getTableSelectNamePath(fieldData);
        // console.log('uri', uri);
        if (!asyncSearchData.value[key]) asyncSearchData.value[key] = {
            loading: false // 初始化
        };
        asyncSearchData.value[key].loading = true;
        let res = await request.post({ 'url': `/Table/table_select${uri}/${fieldData.id}`, 'data': formData });
        asyncSearchData.value[key].loading = false;
        // console.log('res', res.data.rows);
        asyncSearchData.value[key] = res.data.rows;
    }
}

// 预览
const handlePreview = (uploadFile: UploadUserFile) => {
    console.log('uploadFile', uploadFile);
    // 新页面打开
    window.open(getFullImageUrl(uploadFile.url));
}

// 自定义上传[多文件]
const uploadHandlerMultiple = (key: string): UploadProps['httpRequest'] => {
    return async ({ file, onSuccess, onError, onProgress }) => {
        try {
            const response = await uploadFile(file, {}, (progress) => {
                onProgress({ percent: progress });
            });
            if (response.code == SUCCESS_CODE) {
                onSuccess(response.data);

                // 检查 uploadFileList 中是否存在 key 对应的文件
                // 如果存在， 则替换
                uploadFileList.value[key] = uploadFileList.value[key].map((item: UploadUserFile) => {
                    if (item.name == file.name) {
                        return {
                            name: response.data.file,
                            url: response.data.file
                        }
                    }
                    return item;
                })
                // 如果不存在，则添加
                if (uploadFileList.value[key].length == 0) {
                    uploadFileList.value[key].push({
                        name: response.data.file,
                        url: response.data.file
                    })
                }

                // 判断是否是多选
                if (tableData.value.form_fields[key].relative_multiple) {
                    // 将 uploadFileList 中的数组转字符串
                    tableDataForm.value[key] = uploadFileList.value[key].map(item => item.name).join(',');
                } else {
                    tableDataForm.value[key] = response.data.file;
                }

            } else {
                onError(new Error(response.msg));
                ElMessage.error(response.msg);
            }
        } catch (error) {
            onError(error);
        }
    };
}


// 多文件上传组件的文件移除事件
const handleRemove = (key: string) => {
    return (uploadFile: UploadUserFile, uploadFiles: UploadUserFile[]) => {
        // console.log(uploadFile, uploadFiles, key);
        // 从 uploadFileList 中删除
        uploadFileList.value[uploadFile.name] = uploadFileList.value[uploadFile.name]?.filter((item: UploadUserFile) => item.name != uploadFile.name);
        // console.log(uploadFileList.value, 'uploadFileList.value');

        // 从 tableDataForm 中删除
        tableDataForm.value[key] = tableDataForm.value[key]?.split(',')?.filter((item: string) => item != uploadFile.name).join(',');
        console.log(tableDataForm.value, 'tableDataForm.value');
    }
}

// 查看源码
const handleHtml = (e: any, key: string) => {
    // console.log('html', e);
    // console.log('openEditor');
    editorRef.value[0].getEditorRef().then((editor: any) => {
        // console.log(editor);
        // console.log(editor.getHtml());
        viewEditorDataDialogVisible.value = true;
        // tableDataForm.value[key] = String(editor.getHtml());

    });
}

// 弹窗选择
async function tableDialogSelectHandle(data: any) {
    tableSelectNamePath.value = getTableSelectNamePath(data);
    let res = await getTableSelectDataApi(tableSelectNamePath.value);
    tableSelectData.value = res.data;
    dataDialogVisible.value = true;
    tableSelectField.value = data.my_column_name;
}

// 获取表单数据
async function getFormData() {
    loading.value = true;
    let res;
    if (props.isEdit) {
        let { tableName, id, uri } = props;
        if (uri) {
            res = await request.get({ url: uri });
        } else {
            if (!tableName) return ElMessage.error('参数错误:tableName为空');
            res = await editTableRowGetApi(tableName, id);
        }
        // console.log(res, 'res321312');
        tableDataForm.value = JSON.parse(JSON.stringify(res.data.target));
        // console.log(tableDataForm.value, 'tableDataForm.value');
        // 遍历表单字段 回显上传的文件用
        for (const key in res.data.form_fields) {
            // 如果字段是多选的
            if (res.data.form_fields[key].relative_multiple) {
                // console.log('multiple key', key);
                // console.log(tableDataForm.value[key], 'tableDataForm.value[key]');
                // console.log('uploadFileList.value[key]', uploadFileList.value[key]);
                // 将字符串分割为数组
                if (tableDataForm.value[key]) {
                    tableDataForm.value[key].split(',').forEach((item: any) => {
                        // 如果 item 以 / 开头，则表示是上传的文件，放到 uploadFileList 中进行回显
                        if (item.startsWith('/')) {
                            if (!uploadFileList.value[key]) uploadFileList.value[key] = []; // 初始化
                            uploadFileList.value[key].push({
                                name: item,
                                url: getFullImageUrl(item)
                            })
                        }
                    })
                    if (typeof tableDataForm.value[key] == 'string') {
                        // console.log('tableDataForm.value[key]', tableDataForm.value[key]);
                        tableDataForm.value[key] = tableDataForm.value[key].split(',')
                        // tableDataForm.value[key] = tableDataForm.value[key].split(',').map(item => {
                        //     return /^[0-9]$/.test(item) ? Number(item) : item;
                        // });
                        // console.log('tableDataForm.value[key]', tableDataForm.value[key]);
                    }
                } else { // 没有值就初始化空数组 组件需要
                    tableDataForm.value[key] = [];
                }
            }
        }

        // formatValue(tableDataForm);
        if (res.data.target.wx_image) { // TODO: 待修改
            tableDataForm.value.wx_image_imageUrl = getFullImageUrl(res.data.target.wx_image);
        }
    } else {
        res = await request.get({ url: props.uri });
        // 填充默认值
        tableDataForm.value = {};
        for (const key in res.data.form_fields) {
            // console.log(key, 'key');
            if (res.data.form_fields[key].my_column_default) {
                // 如果relative_list成立，则 my_column_default 用作键名
                if (res.data.form_fields[key].relative_list) {

                    // let defaultKey = res.data.form_fields[key].my_column_default;
                    // console.log(defaultKey, 'defaultKey');
                    // console.log(res.data.form_fields[key].relative_list, 'relative_list');
                    // console.log(res.data.form_fields[key].relative_list[defaultKey], 'relative_list[defaultKey]');

                    tableDataForm.value[key] = res.data.form_fields[key].my_column_default;
                } else {
                    tableDataForm.value[key] = res.data.form_fields[key].my_column_default;
                }
            }
        }
        // 填充 target [如成立，则将 target 的值赋给 tableDataForm]
        if (res.data?.target) {
            for (const key in res.data.target) {
                tableDataForm.value[key] = res.data.target[key];
            }
        }
    }

    if (res.code == SUCCESS_CODE) {
        tableData.value = res.data;
        fields.value = res.data.form_fields; // 添加这行
        initRules();
        document.title = (props.isEdit ? '编辑' : '添加') + tableData.value.table?.table_name_cn;
    } else {
        ElMessage({
            message: `失败: ${res.msg}`,
            type: 'warning',
        });
    }
    loading.value = false;
}

// 添加提交
async function tableCMD_HandleAddSubmit(isBack: boolean = false) {
    let uri = tableData.value.form_action;
    let res = await request.post({ url: uri, data: tableDataForm.value });
    if (res.code == 0) {
        ElMessage({
            message: `${res.msg}`,
            type: 'success',
            duration: 1500,
        });
        if (isBack) {
            router.back();
        }
    } else {
        ElMessage({
            message: `失败: ${res.msg}`,
            type: 'warning',
        });
    }
}

// 初始化表单验证规则
function initRules() {
    for (const key in tableData.value?.form_fields) {
        if (tableData.value?.form_fields.hasOwnProperty(key)) {
            const field = tableData.value.form_fields[key];

            // console.log('field.vi_name', field.vi_name);
            // console.log('field', field);
            // if (isRequired(field)) {
            //     rules.value[key] = [{ required: true, message: '此项必填', trigger: 'blur' }];
            // }

            //根据field.validate_js: string的数据来生成表单规则 [[start]]
            // 判断field.validate_js是否有 required
            // console.log('field', field);
            if ((field.validate_js?.includes('required') || isRequired(field)) && SacManage.has_auth_edit_field(field)) { // 必填项 [已配置客户端检验 或 数据库不可空 且 可编辑]
            // if (field.validate_js?.includes('required') || isRequired(field)) { // 必填项 [已配置客户端检验 或 数据库不可空]
            // if (field.validate_js?.includes('required')) { // 必填项 [已配置客户端检验]
                if (!rules.value[key]) rules.value[key] = [];
                rules.value[key].push({ required: true, message: '此项必填！', trigger: 'blur' });
            }
            if (field.validate_js?.includes('mobile')) { // 手机号
                if (!rules.value[key]) rules.value[key] = [];
                rules.value[key].push({
                    validator: (rule: any, value: any, callback: any) => {
                        // 如果 value 没有值，则不验证
                        if (!value) {
                            callback();
                            return;
                        }
                        if (!value || !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
                            callback(new Error('请输入正确的手机号码'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                });
            }
            if (field.validate_js?.includes('email')) { // 邮箱
                if (!rules.value[key]) rules.value[key] = [];
                rules.value[key].push({
                    validator: (rule: any, value: any, callback: any) => {
                        // 如果 value 没有值，则不验证
                        if (!value) {
                            callback();
                            return;
                        }
                        if (!value || !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)) {
                            callback(new Error('请输入正确的邮箱地址'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                });
            }
            if (field.validate_js?.includes('onlyNumber')) { // 纯数字
                if (!rules.value[key]) rules.value[key] = [];
                rules.value[key].push({
                    validator: (rule: any, value: any, callback: any) => {
                        // 如果 value 没有值，则不验证
                        if (!value) {
                            callback();
                            return;
                        }
                        if (!value || !/^\d+$/.test(value)) {
                            callback(new Error('请输入纯数字'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                });
            }
            if (field.validate_js?.includes('date')) { // 日期
                if (!rules.value[key]) rules.value[key] = [];
                rules.value[key].push({
                    validator: (rule: any, value: any, callback: any) => {
                        // 如果 value 没有值，则不验证
                        if (!value) {
                            callback();
                            return;
                        }
                        if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                            callback(new Error('请输入正确的日期格式'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                });
            }
            // [[end]]

            // 最大长度 validate_maxsize   
            if (field.validate_maxsize) {
                if (!rules.value[key]) rules.value[key] = [];
                rules.value[key].push({
                    validator: (rule: any, value: any, callback: any) => {
                        // 如果 value 没有值，则不验证
                        if (!value) {
                            callback();
                            return;
                        }
                        if (value?.length > field.validate_maxsize) {
                            callback(new Error(`最大长度不能超过${field.validate_maxsize}个字符`));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                });
            }
            // 最小长度 validate_minsize
            if (field.validate_minsize) {
                if (!rules.value[key]) rules.value[key] = [];
                rules.value[key].push({
                    validator: (rule: any, value: any, callback: any) => {
                        // 如果 value 没有值，则不验证
                        if (!value) {
                            callback();
                            return;
                        }
                        if (value?.length < field.validate_minsize) {
                            callback(new Error(`最小长度不能小于${field.validate_minsize}个字符`));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                });
            }
            // 最大值 validate_maxvalue
            if (field.validate_maxvalue) {
                if (!rules.value[key]) rules.value[key] = [];
                rules.value[key].push({
                    validator: (rule: any, value: any, callback: any) => {
                        // 如果 value 没有值，则不验证
                        if (!value) {
                            callback();
                            return;
                        }
                        if (value > field.validate_maxvalue) {
                            callback(new Error(`请输入最大值为${field.validate_maxvalue}的数字`));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                });
            }
            // 最小值 validate_minvalue
            if (field.validate_minvalue) {
                if (!rules.value[key]) rules.value[key] = [];
                rules.value[key].push({
                    validator: (rule: any, value: any, callback: any) => {
                        // 如果 value 没有值，则不验证
                        if (!value) {
                            callback();
                            return;
                        }
                        if (value < field.validate_minvalue) {
                            callback(new Error(`请输入最小值为${field.validate_minvalue}的数字`));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                });
            }

            // 图片 [[start]]
            // console.log('key', key);
            // console.log('rules.value[key]', rules.value[key]);
            if (field.image_max_count) { // 最多上传图片数量
                // if (!rules.value[key]) rules.value[key] = [];
                // rules.value[key].push({
                //     validator: (rule: any, value: any, callback: any) => {
                //         if (uploadFileList.value[key].length > field.image_max_count) {
                //             callback(new Error(`最多上传${field.image_max_count}张图片`));
                //         } else {
                //             callback();
                //         }
                //     }, trigger: 'change'
                // });

                if (!rules.value[key]) rules.value[key] = {};
                rules.value[key].image_max_count = field.image_max_count;
            }
            if (field.image_min_count) { // 最少上传图片数量
                if (!rules.value[key]) rules.value[key] = {};
                rules.value[key].image_min_count = field.image_min_count;
                // if (!rules.value[key]) rules.value[key] = [];
                // rules.value[key].push({
                //     validator: (rule: any, value: any, callback: any) => {
                //         if (uploadFileList.value[key].length < field.image_min_count) {
                //             callback(new Error(`最少上传${field.image_min_count}张图片`));
                //         } else {
                //             callback();
                //         }
                //     }, trigger: 'change'
                // });
            }
            if (field.image_max_height) { // 图片最大高度
                if (!rules.value[key]) rules.value[key] = {};
                rules.value[key].image_max_height = field.image_max_height;
            }
            if (field.image_max_width) { // 图片最大宽度
                if (!rules.value[key]) rules.value[key] = {};
                rules.value[key].image_max_width = field.image_max_width;
            }
            if (field.image_max_size) { // 图片大小
                if (!rules.value[key]) rules.value[key] = {};
                rules.value[key].image_max_size = field.image_max_size;
            }
            // 图片 [[end]]
        }
    }
}

// 提交
async function handleSubmit(isBack: boolean = false) {
    // console.log('uri', props.uri);
    // console.log('route.path', route.path);
    // console.log('handleSubmit',Object.keys(groupedFields.value).length);
    // console.log('groupedFields.value',groupedFields.value);
    // console.log('tableFormEl.value',tableFormEl.value);
    // 如果只有一个表单，直接验证该表单
    if (Object.keys(groupedFields.value).length === 1) {
        try {
            await tableFormEl.value?.validate();
        } catch (error) {
            console.log(error);
            return;
        }
    } else {
        // 如果有多个表单，逐个验证
        for (let i = 0; i < Object.keys(groupedFields.value).length; i++) {
            try {
                await tableFormEl.value?.[i]?.validate();
            } catch (error) {
                activeTab.value = i.toString();
                console.log(error);
                return;
            }
        }
    }

    // console.log('tableDataForm', tableDataForm.value)
    // return

    if (props.isEdit) { // 编辑提交
        console.log('Edit');
        let res;
        if (tableData.value.form_action) {
            res = await request.post({
                url: tableData.value.form_action,
                data: tableDataForm.value
            });
        } else {
            // let { tableName, id } = props;
            // res = await editTableRowPostApi(tableName, id, tableDataForm.value);
            ElMessage.error('编辑失败, form_action 为空');
            return;
        }
        if (res.code == SUCCESS_CODE) {
            ElMessage({
                type: 'success',
                message: res.msg,
            });
            // console.log(determinePageType(props.uri));
            emit('submitEvent');

            if (isBack) {
                router.back(); // 返回上一页
            }
        }
    } else { // 添加提交
        console.log('add');
        tableCMD_HandleAddSubmit(isBack);
    }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile, key) => {
    const imageUrl = URL.createObjectURL(uploadFile.raw!);
    tableDataForm.value[key + '_imageUrl'] = imageUrl;
}

// 上传前检查 [单]
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (!(rawFile?.type === 'image/jpeg' ||
        rawFile?.type === 'image/png' ||
        rawFile?.type === 'image/svg+xml' ||
        rawFile?.type === 'image/jpg')) {
        ElMessage.error('头像图片必须是 JPG、PNG 或 SVG 格式!');
        return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像图片大小不能超过 2MB!');
        return false;
    }
    return true;
}

// 上传前检查 [多]
function imageUploadCheck(key: string): UploadProps['beforeUpload'] {
    return (rawFile) => {
        // if (!(rawFile?.type === 'image/jpeg' ||
        //     rawFile?.type === 'image/png' ||
        //     rawFile?.type === 'image/svg+xml' ||
        //     rawFile?.type === 'image/jpg')) {
        //     ElMessage.error('头像图片必须是 JPG、PNG 或 SVG 格式!');
        //     return false;
        // } else if (rawFile.size / 1024 / 1024 > 2) {
        //     ElMessage.error('头像图片大小不能超过 2MB!');
        //     return false;
        // }
        // return true;


        // console.log('rules.value[key]', rules.value[key]);
        if (!rules.value[key]) return true;
        const check = new Promise((resolve, reject) => {
            // console.log('imageUploadCheck', key);
            // console.log('rawFile', rawFile);
            let {
                image_max_width,
                image_max_height,
                image_max_size,
                image_max_count,
                image_min_count
            } = rules.value[key];
            // 获取宽高
            const img = new Image();
            img.src = URL.createObjectURL(rawFile);
            img.onload = () => {
                console.log('img.width', img.width);
                console.log('img.height', img.height);

                // 获取已经上传的文件
                // // console.log('uploadFileList.value[key]', uploadFileList.value[key]);
                // let file = uploadFileList.value[key];
                // 检查宽
                if (img.width > image_max_width) {
                    ElMessage.error(`图片宽度不能超过${image_max_width}px`);
                    // 删除已经上传的文件 [uploadFileList]
                    // uploadFileList.value[key] = uploadFileList.value[key].filter((item: any) => item.name != rawFile.name);
                    // 删除已经上传的文件 [tableDataForm]
                    // console.log('tableDataForm.value[key]', tableDataForm.value[key]);
                    // tableDataForm.value[key] = tableDataForm.value[key].split(',').filter((item: any) => item != rawFile.name).join(',');
                    // console.log('tableDataForm.value[key]', tableDataForm.value[key]);
                    reject()
                }
                // 检查高度
                if (img.height > image_max_height) {
                    ElMessage.error(`图片高度不能超过${image_max_height}px`);
                    reject()
                }
                // 检查大小
                if (rawFile.size / 1024 / 1024 > image_max_size) { // 单位MB
                    // if (rawFile.size / 1024 > image_max_size) { // 单位KB
                    // if (rawFile.size > image_max_size) { // 单位B
                    ElMessage.error(`图片大小不能超过${image_max_size}B`);
                    reject()
                }
                // 检查数量
                let fileList = uploadFileList.value[key].filter((item: any) => item.name);
                if (fileList.length > image_max_count) {
                    ElMessage.error(`最多上传${image_max_count}张图片`);
                    reject()
                }
                // 检查最小数量 [触发方式非此]
                // if (fileList.length < image_min_count) {
                //     ElMessage.error(`最少上传${image_min_count}张图片`);
                //     reject()
                // }
                resolve()
            }

        }).then(() => {
            return rawFile;
        }, () => {
            return Promise.reject()
        })
        // return true;
        return check;
    }
}

// 上传处理函数
const createUploadHandler = (fieldName: string) => {
    const uploadAvatar: UploadProps['httpRequest'] = async ({ file, onSuccess, onError }) => {
        try {
            const { data: { fileUploadSliceGuid } } = await getFileUploadSliceGuidApi();
            const fileContent: ArrayBuffer = await fileToBinary(file);
            let data = objToFormData({
                fileName: file.name,
                fileUploadSliceGuid,
                fileSize: file.size,
                table_name: tableData.value.table_name,
                field_name: fieldName,
                resize_width: 0,
                fileContent: new Blob([fileContent], { type: file?.type }),
            });
            const response = await uploadFileApi(data);
            if (response.code == SUCCESS_CODE) {
                onSuccess(response.data);
                // tableDataForm.value[fieldName] = response.data.file;
                // console.log('fieldName', fieldName);
                // console.log('tableDataForm.value[fieldName]',tableDataForm.value[fieldName])
                // console.log('file.name',file.name)
                // 将上传的文件添加到 uploadFileList 中
                if (!uploadFileList.value[fieldName]) uploadFileList.value[fieldName] = [];
                // 先检查是否有同名, 有则替换url
                uploadFileList.value[fieldName] = uploadFileList.value[fieldName].map((item: any) => {
                    if (item.name == file.name) {
                        item.name = response.data.file;
                        item.url = getFullImageUrl(response.data.file);
                    }
                    return item;
                })
                // 没有同名则添加
                if (uploadFileList.value[fieldName].length == 0) {
                    uploadFileList.value[fieldName].push({
                        name: response.data.file,
                        url: getFullImageUrl(response.data.file)
                    })
                }

                // 判断是否是多选
                if (tableData.value.form_fields[fieldName].relative_multiple) {
                    // 将 uploadFileList 中的数组转字符串
                    tableDataForm.value[fieldName] = uploadFileList.value[fieldName].map(item => item.name).join(',');
                } else {
                    tableDataForm.value[fieldName] = response.data.file;
                }
            } else {
                onError(new Error(response.msg));
            }
        } catch (error) {
            onError(error);
        }
    };
    return uploadAvatar;
}

// edit_teg 分组
const groupedFields = computed(() => {
    const groups = {};
    if (tableData.value && tableData.value.form_fields) {
        for (const [key, field] of Object.entries(tableData.value.form_fields)) {
            const tag = field.edit_tag || `基础`;
            if (!groups[tag]) {
                groups[tag] = {};
            }
            groups[tag][key] = field;
        }
    }
    return groups;
});

// 推断字段类型
function inferFieldType(typeStr: string) {
    let inferredType = '';
    switch (typeStr) {
        case 'month':
            inferredType = 'varchar(7)';
            break;
        case 'bdmap':
        case 'amap':
        case 'qqmap_lnglat':
        case 'bdmap_lnglat':
            inferredType = 'varchar(40)';
            break;
        case 'unknown_file':
        case 'video':
        case 'image':
            inferredType = 'varchar(255)';
            break;
        case 'long_content':
            inferredType = 'longtext';
            break;
    }
    if (inferredType) {
        tableDataForm.value['my_column_type'] = inferredType;
    }
}

function handleGotoMap(item: any) {
    if (FieldTypeChecker.isQqmapLnglatField(item)) {
        window.open('https://lbs.qq.com/getPoint/');
    } else if (FieldTypeChecker.isBdmapLnglatField(item)) {
        window.open('https://api.map.baidu.com/lbsapi/getpoint/index.html');
    } else if (FieldTypeChecker.isGdmapLnglatField(item)) {
        window.open('https://map.geoq.cn/');
    }
}
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s, height 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
    height: 0;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    height: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    height: auto;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.el-select-dropdown__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 20px;
}

.circular {
    display: inline;
    height: 30px;
    width: 30px;
    animation: loading-rotate 2s linear infinite;
}

.path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: var(--el-color-primary);
    stroke-linecap: round;
}

.loading-path .dot1 {
    transform: translate(3.75px, 3.75px);
    fill: var(--el-color-primary);
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
}

.loading-path .dot2 {
    transform: translate(calc(100% - 3.75px), 3.75px);
    fill: var(--el-color-primary);
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
    animation-delay: 0.4s;
}

.loading-path .dot3 {
    transform: translate(3.75px, calc(100% - 3.75px));
    fill: var(--el-color-primary);
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
    animation-delay: 1.2s;
}

.loading-path .dot4 {
    transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
    fill: var(--el-color-primary);
    animation: custom-spin-move 1s infinite linear alternate;
    opacity: 0.3;
    animation-delay: 0.8s;
}

@keyframes loading-rotate {
    to {
        transform: rotate(360deg);
    }
}

@keyframes loading-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -40px;
    }

    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -120px;
    }
}

@keyframes custom-spin-move {
    to {
        opacity: 1;
    }
}
</style>