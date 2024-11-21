<template>
    <el-upload ref="upload" v-model:file-list="fileList" auto-upload class="w-[300px]" :on-preview="handlePreview"
        :on-remove="handleRemove" :before-remove="beforeRemove" :multiple="reqParams.multiple"
        :http-request="uploadHandler" :on-change="handleChange" :show-file-list="true" :accept="reqParams.fileType">
        <el-input v-model="fileURL" />
        <el-button type="primary" class="m-0!" :icon="Upload"></el-button>
        <!-- <template #tip>
            <div class="el-upload__tip">
                jpg/png files with a size less than 500KB.
            </div>
        </template> -->
    </el-upload>
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { ElMessage, ElMessageBox, ElUpload, ElButton, ElInput, genFileId } from 'element-plus'

import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { getFullImageUrl, uploadFile } from '@/utils';
import { SUCCESS_CODE } from '@/constants';
import { Upload } from '@element-plus/icons-vue'

const props = defineProps<{
    reqParams?: any,
    modelValue?: string,
}>();

const emit = defineEmits(['update:modelValue']);

const fileList = ref<UploadUserFile[]>([]);

const fileURL = ref<string>(props.modelValue || '');

const upload = ref<UploadInstance>()


// Watch for changes in fileList and emit update:modelValue
watch(fileURL, (newFileList) => {
    emit('update:modelValue', newFileList);
});

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    // console.log(file, uploadFiles)
}

// 点击了文件
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    // console.log(uploadFile)
    window.open(getFullImageUrl(fileURL.value))
}

// 超出限制
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    // ElMessage.warning(
    //     `限制为1个文件，您这次选择了${files.length}个文件，总共${files.length + uploadFiles.length}个文件`
    // )
    // upload.value!.clearFiles() // 清除文件列表
    // upload.value!.handleRemove(uploadFiles[0])
    // const file = files[0] as UploadRawFile // 获取文件
    // file.uid = genFileId() // 重新设置uid
    // upload.value!.handleStart(file) // 重新开始上传
    // 再次上传
};

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    //   fileList.value = fileList.value.slice(-3)
    // 移除前一次文件
    if (uploadFiles.length > 1) {
        upload.value!.handleRemove(uploadFiles[0])
    }
}

// 删除
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
    fileURL.value = ''
    return true
}

// 自定义上传
const uploadHandler: UploadProps['httpRequest'] = async ({ file, onSuccess, onError, onProgress }) => {
    try {
        let data = {
            ...props.reqParams
        }
        const response = await uploadFile(file, data, (progress) => {
            // console.log('progress', progress)
            onProgress({ percent: progress });
        });
        // console.log('response', response)
        if (response.code === SUCCESS_CODE) {
            onSuccess(response.data);
            // console.log('response.data.file',response.data.file)
            // fileURL_List.value.push(response.data.file)
            fileURL.value = response.data.file
        } else {
            onError(new Error(response.msg));
            ElMessage.error(response.msg);
        }
    } catch (error) {
        onError(error);
    }
};

</script>