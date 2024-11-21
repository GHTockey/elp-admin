<script setup lang="ts">
import { onBeforeUnmount, computed, PropType, unref, nextTick, ref, watch, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IDomEditor, IEditorConfig, i18nChangeLanguage } from '@wangeditor/editor';
import { propTypes } from '@/utils/propTypes';
import { isNumber } from '@/utils/is';
import { ElMessage, ElButton } from 'element-plus';
import { useLocaleStore } from '@/store/modules/locale';
import { getFileUploadSliceGuidApi, uploadFileApi } from '@/api/other';
import { fileToBinary, objToFormData, uploadFile } from '@/utils';
import { SUCCESS_CODE } from '@/constants';
import { useIcon } from '@/hooks/web/useIcon';


const localeStore = useLocaleStore()

const currentLocale = computed(() => localeStore.getCurrentLocale)

i18nChangeLanguage(unref(currentLocale).lang)

const props = defineProps({
  editorId: propTypes.string.def('wangeEditor-1'),
  height: propTypes.oneOfType([Number, String]).def('500px'),
  editorConfig: {
    type: Object as PropType<IEditorConfig>,
    default: () => undefined
  },
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['change', 'update:modelValue', 'html'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

const valueHtml = ref('')


const handleHtml = (e: any) => {
  emit('html', e)
}


watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return
    valueHtml.value = val
  },
  {
    immediate: true
  }
)

// 监听
watch(
  () => valueHtml.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 编辑器配置
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      readOnly: false,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            ElMessage.success(s)
            break
          case 'info':
            ElMessage.info(s)
            break
          case 'warning':
            ElMessage.warning(s)
            break
          case 'error':
            ElMessage.error(s)
            break
          default:
            ElMessage.info(s)
            break
        }
      },
      autoFocus: false,
      scroll: true,
      uploadImgShowBase64: true,
      placeholder: '请输入内容...',
      MENU_CONF: {
        // uploadImage: {
        //   server: import.meta.env.VITE_API_BASE_PATH_URL + '/ResManageV2/uploadSlice?__API_TMP_TEST_82__=1',
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //     // Authorization: 'token'
        //   },
        //   // params: {
        //   //   '__API_TMP_TEST_82__': 1
        //   // },
        //   fieldName: 'file',// 这里有个坑，如果返回的响应结果是没有上传文件，跟这里关系很大
        //   customInsert(res, insertFn) {

        //     console.log(res);


        //     // if (res.code == 200) {
        //     //   let { url, alt, href } = res.data
        //     //   insertFn(baseUrl + url, alt, href)
        //     // }
        //   }
        // }
      }
    },
    props.editorConfig || {}
  )
})

editorConfig.value.MENU_CONF['uploadImage'] = {
  // 自定义上传图片
  async customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
    // file 即选中的文件
    // console.log(file);

    // 自己实现上传，并得到图片 url alt href
    // const { data: { fileUploadSliceGuid } } = await getFileUploadSliceGuidApi();
    // const fileContent: ArrayBuffer = await fileToBinary(file); // 将文件转换为二进制
    // let data = objToFormData({
    //   fileName: file.name,
    //   fileUploadSliceGuid,
    //   fileSize: file.size,
    //   resize_width: 0,
    //   fileContent: new Blob([fileContent], { type: file.type }),
    // })
    // const response = await uploadFileApi(data);
    const response = await uploadFile(file, {}, (progress) => {
      console.log(`上传进度: ${progress}%`);
      // 这里可以添加更新进度条UI的逻辑
    });
    // console.log(response);
    if (response.code === SUCCESS_CODE) {
      let url = response.data.file.startsWith('http') ? response.data.file : import.meta.env.VITE_BASE_URL + response.data.file;
      let alt = file.name;
      let href = url;
      // 最后插入图片
      insertFn(url, alt, href)
    } else {
      ElMessage.error(response.msg);
    }
  }
}

editorConfig.value.MENU_CONF['uploadVideo'] = {
  // 自定义上传视频
  async customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
    // file 即选中的文件
    console.log(file);

    // 自己实现上传，并得到视频 url poster
    // const { data: { fileUploadSliceGuid } } = await getFileUploadSliceGuidApi();
    // const fileContent: ArrayBuffer = await fileToBinary(file); // 将文件转换为二进制
    // let data = objToFormData({
    //   fileName: file.name,
    //   fileUploadSliceGuid,
    //   fileSize: file.size,
    //   resize_width: 0,
    //   fileContent: new Blob([fileContent], { type: file.type }),
    // })
    // const response = await uploadFileApi(data);
    const response = await uploadFile(file, {}, (progress) => {
      console.log(`上传进度: ${progress}%`);
    });
    // console.log(response);
    if (response.code === SUCCESS_CODE) {
      let url = response.data.file.startsWith('http') ? response.data.file : import.meta.env.VITE_BASE_URL + response.data.file;
      // 最后插入视频
      insertFn(url)
    } else {
      ElMessage.error(response.msg);
    }
  }
}

const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height
  }
})

// 回调函数
const handleChange = (editor: IDomEditor) => {
  emit('change', editor)
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = unref(editorRef.value)

  // 销毁，并移除 editor
  editor?.destroy()
})

const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return unref(editorRef.value) as IDomEditor
}


import { DomEditor } from '@wangeditor/editor';
// console.log(IToolbarConfig);
onMounted(() => {
  setTimeout(() => {
    // console.log(editorRef.value);
    // const toolbar = DomEditor.getToolbar(editorRef.value)
    // console.log(toolbar);
    // const curToolbarConfig = toolbar.getConfig()

    // curToolbarConfig.insertKeys
    // curToolbarConfig.insertKeys = {
    //   index: 5, // 插入的位置，基于当前的 toolbarKeys
    //   keys: ['menu-key1', 'menu-key2']
    // }

    // curToolbarConfig.toolbarKeys?.push('"modalAppendToBody": false')
    // console.log(curToolbarConfig) // 当前菜单排序和分组
  }, 0)
})


defineExpose({
  getEditorRef
})
</script>

<template>
  <div class="border-1 border-solid border-[var(--el-border-color)] z-10">
    <!-- 工具栏 -->
    <Toolbar :editor="editorRef" :editorId="editorId"
      class="border-0 b-b-1 border-solid border-[var(--el-border-color)] tce_toolbar">
    </Toolbar>
    <!-- <el-button class="absolute top-[20px] left-[20px]" :type="'text'"
      :icon="useIcon({ icon: 'dashicons:html', size: 28, color: 'black' })" /> -->
    <el-button class="absolute top-[27px] left-[10px]" link @click="handleHtml" >
      HTML
    </el-button>
    <!-- 编辑器 -->
    <Editor v-model="valueHtml" :editorId="editorId" :defaultConfig="editorConfig" :style="editorStyle"
      @on-change="handleChange" @on-created="handleCreated">
    </Editor>
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="less">
.tce_toolbar {
  /* position: relative; */
  // border: 5px solid red;

  .w-e-bar-show {
    // background-color: aqua !important;

    .w-e-bar-item:first-child {
      padding-left: 50px;
    }
  }
}
</style>