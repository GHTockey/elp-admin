// import type { Plugin } from 'vue'
// import { baseURL } from "@/main";


import { getFileUploadSliceGuidApi, uploadFileApi } from "@/api/other"
import { isNumber } from "util"
import { computed, h, Ref } from "vue";
import request from "@/axios";


// const baseURL = import.meta.env.VITE_BASE_URL


/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

export const getCssVar = (prop: string, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(prop)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * 把对象转为formData
 */
export function objToFormData(obj: Recordable) {
  const formData = new FormData()
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key])
  })
  return formData
}



interface DataItem {
  id: number;
  table_name_cn: string;
  pid: number;
  icon_normal: string | null;
  icon_active: string | null;
  icon_vue: string | null;
  manage_uri?: string;
  sub_list: DataItem[];
}
// 将给定的数据转换为 AppRouteRecordRaw[] 类型的路由数据
export function transformToAppRouteRecordRaw(data: DataItem[], isTopLevel: boolean = true): AppRouteRecordRaw[] {
  return data.map(item => {
    const isLastLevel = !item.sub_list || item.sub_list.length === 0; // 判断是否是最后一级
    const path = isTopLevel ? `/admin/${item.id}` : `${item.table_name ? item.table_name : item.id}`; // 确保路径path唯一,否则高亮异常
    // const finalPath = isLastLevel ? `${path}?url=${item.manage_uri?.replace(window.app_base_url, '')}&tName=${item.table_name}` : path; // 拼接 query 参数
    // const finalPath = isLastLevel ? (`${path}?url=` + encodeURIComponent(item.manage_uri)) : path; // 直接 uri
    const finalPath = isLastLevel ? (`${path}?url=` + (item.manage_uri)) : path; // 直接 uri

    return {
      path: finalPath, // 使用拼接后的路径
      name: item.table_name_cn,
      meta: {
        title: item.table_name_cn, // 标题
        // icon: item.icon_normal,
        // icon: 'carbon:skill-level-advanced',
        // icon: item.icon_normal ? ('svg-url:' + item.icon_normal) : null,
        // icon: item.icon_vue ? item.icon_vue : (item.icon_normal ? `svg-url:${item.icon_normal}` : null), // 图标
        icon: item.icon_vue ? item.icon_vue : (item.icon_normal ? `svg-url:${item.icon_normal},${item.icon_active}` : null), // 图标
        isLastLevel, // 添加标识
      },
      children: !isLastLevel ? transformToAppRouteRecordRaw(item.sub_list, false) : [] // 递归处理子路由
    };
  });
}


export function navsDataTransform(data, parentId) {
  return data.map(item => {
    const transformed = {
      id: item.id.toString(),
      name: item.table_name_cn,
      path: item.table_name ? item.table_name : (parentId == '0' ? ('/' + item.table_name_cn) : item.table_name_cn),
      parentId: parentId,
      // component: item.manage_uri ? (<string>item.manage_uri).replace(import.meta.env.VITE_API_BASE_PATH_URL, '') : '#',
      component: '#',
      // component: item.manage_uri ? () => import('@/views/Table/Table.vue') : '#',
      meta: {
        hidden: false,
        // icon: item.icon_normal ? item.icon_normal : 'Menu',
        title: item.table_name_cn,
      },
      children: item.sub_list.length ? navsDataTransform(item.sub_list, item.id.toString()) : undefined
    };
    return transformed;
  });
}


// 表格下拉选择框回显处理程序 TODO: 临时
export function formatValue(currentRow: Ref<any>) {
  // console.log('currentRow', currentRow)
  // 属性值类型转字符串
  currentRow.value.action_type ? currentRow.value.action_type = currentRow.value.action_type.toString() : '';
  currentRow.value.app_id ? currentRow.value.app_id = currentRow.value.app_id.toString() : '';
  currentRow.value.article_category_id ? currentRow.value.article_category_id = currentRow.value.article_category_id.toString() : '';
  currentRow.value.relative_on_delete ? currentRow.value.relative_on_delete = currentRow.value.relative_on_delete.toString() : '';
  currentRow.value.cmd_type ? currentRow.value.cmd_type = currentRow.value.cmd_type.toString() : '';
  // 值为0的
  currentRow.value.list_search_pos_newline !== undefined && currentRow.value.list_search_pos_newline !== null ? currentRow.value.list_search_pos_newline = currentRow.value.list_search_pos_newline.toString() : '';
  currentRow.value.sac !== undefined && currentRow.value.sac !== null ? currentRow.value.sac = currentRow.value.sac.toString() : '';
  // 多选框回显  字符串转数组按逗号分割 （提交的时候还要转换为字符串）
  // console.log('currentRow.value.industry',currentRow.value.industry)
  currentRow.value.industry ? currentRow.value.industry = currentRow.value.industry.split(',') : '';
}


// 判断页面类型的函数  TODO: 1119-lixiaosong 这里应改为从 query 得到 uri 然后发起请求拿到数据来判断类型的 [2024/11/20 已完成]
export const determinePageType = async (uri: string, uriData: any): Promise<string> => {
  // if (uri.includes('/Table') && uri.includes('/table')) { // 表格页
  //   return 'table';
  // } else if (uri.includes('/cmds')) { // 常用命令页
  //   return 'cmd';
  // } else if (uri.includes('/relative_static')) { // 系统枚举页
  //   return 'enum';
  // } else if (uri.includes('/edit') || uri.includes('/add')) { // 表单页
  //   return 'form';
  // }
  // return 'unknown'; // 默认返回 'unknown'

  // 如果 uriData 为空，则请求uri获取
  if (!uriData) {
    let res = await request.get({ url: uri })
    uriData = res.data
  }

  if (uriData.form_load_view_file == 'TableManage:rows_list_layout') { // 表格页
    return 'table';
  } else if (uriData.form_load_view_file == 'Cd:cmds_layout') { // 常用命令页
    return 'cmd';
  } else if (uriData.form_load_view_file == 'Column:relative_static_layout') { // 系统枚举页
    return 'enum';
  } else if (uriData.form_load_view_file == 'CommonAjax:coding_edit_sys_layout') { // 表单页
    return 'form';
  }
  return 'unknown'; // 默认返回 'unknown'
}


// computed
// export const isDateField = (field) => field.my_column_type == 'date' || field.my_column_type == 'datetime';
// export const isInputField = (field) => field.my_column_type.includes('varchar') || field.vi_name == 'OneId';
// export const isSelectField = (field) => {
//   return (
//     field.my_column_type.includes('int') &&
//     field.vi_name != 'OneId' &&
//     field.vi_name != 'id' &&
//     field.vi_name != 'is_2_convertlab' &&
//     field.vi_name != '数量') ||
//     field.relative_list != null
// };

// 字段类型检查器类
export class FieldTypeChecker {
  // 是否是日期选择器
  static isDateField(field) {
    return field.my_column_type === 'date' || field.my_column_type == 'datetime';
  }

  // 是否是输入框
  static isInputField(field) {
    // 判断字段类型是否是 varchar 或 int
    const isVarcharOrInt = field.my_column_type.startsWith('varchar') || field.my_column_type.startsWith('int');
    // 判断字段是否不是下拉选择器
    const notSelectField = !field.relative_static && !field.relative_list;
    // 判断字段是否不是弹框选择器
    const notPopupField = !(field.is_relative == 1 && field.relative_ajax_select == 1);
    // 如果字段是 varchar 或 int 且不是下拉选择器和弹框选择器，则认为是输入框
    return isVarcharOrInt && notSelectField && notPopupField;
  }

  // 是否是下拉选择器
  static isSelectField(field) {
    // relative_static：是否有静态下拉选项  relative_list：是否有下拉选项
    // 如果字段的 relative_static 或 relative_list 存在，则认为是下拉选择器
    return field.relative_static || field.relative_list;
  }

  // 判断是否是上传头像组件 [显示头像]
  static isAvatarField(field) {
    // 判断字段的数据类型是否为 image
    return field.my_data_type == 'image';
  }

  // 判断是否是vue图标 iconify
  static isVueIconField(field) {
    return field.my_column_name == 'icon_vue';
  }

  // 是否是弹框选择器
  static isPopupField(field) {
    // 如果字段是相对的且支持 AJAX 选择，则认为是弹框选择器
    return field.is_relative == 1 && field.relative_ajax_select == 1;
  }

  // 是否是 switch 开关
  static isSwitchField(field) {
    // 判断字段的数据类型是否为 tinyint(1)
    return field.my_column_type === 'tinyint(1)';
  }

  // 判断是否是富文本 longtext
  static isRichTextField(field) {
    // 判断字段的数据类型是否为 longtext
    return field.my_column_type == 'longtext' && field.my_data_type == "long_content";
  }

  // 判断是否是文件上传组件
  static isFileUploadField(field) {
    // 判断字段的数据类型是否为 unknown_file
    return field.my_data_type == 'unknown_file' || field.my_data_type == 'video';
  }

  // 判断腾讯坐标按钮
  static isQqmapLnglatField(field) {
    // 判断字段的数据类型是否为 qqmap_lnglat
    return field.my_data_type == 'qqmap_lnglat';
  }
  // 判断百度坐标按钮
  static isBdmapLnglatField(field) {
    // 判断字段的数据类型是否为 bdmap_lnglat
    return field.my_data_type == 'bdmap_lnglat';
  }
  // 判断高德坐标按钮
  static isGdmapLnglatField(field) {
    // 判断字段的数据类型是否为 gdmap_lnglat
    return field.my_data_type == 'amap';
  }

  // 判断月份选择器
  static isMonthField(field) {
    // 判断字段的数据类型是否为 month
    return field.my_data_type == 'month';
  }

  // 判断文本域
  static isTextareaField(field) {
    // console.log('field', field)
    // 判断字段的数据类型是否为 varchar(XXX)
    // varchar(40) 以内  || int(10)  短输入框，一般用于人名、手机号、分类名称等  返回1
    // varchar(200) 以内 整行的输入框，如：文章标题、产品名称、等  返回2
    // varchar(200) 以上（不含200） 整行的输入框，如：文章标题、产品名称、等  返回3
    if (field.my_column_type.startsWith('int')) {
      return 1;
    } else if (field.my_column_type.startsWith('varchar')) {
      const length = parseInt(field.my_column_type.split('(')[1].split(')')[0]);
      if (length <= 40) {
        return 1;
      } else if (length <= 200) {
        return 2;
      } else {
        return 3;
      }
    }
    return 0;
  }

  // 判断 auth 权限
  static isAuthField(field) {
    return field.my_column_name == 'auth'; // TODO: temp
  }

  // 通用字段类型判断方法
  static checkFieldType(type, field) {
    if (this[type]) {
      return this[type](field);
    }
    throw new Error(`未知的字段类型检查器: ${type}`);
  }
}




// 【表单】根据 auth 判断是否是可编辑的字段
export function isEditable(auth: string) {
  // 使用正则表达式查找所有"read"的出现次数
  const readCount = (auth.match(/read/g) || []).length;
  // console.log('readCount:', readCount)
  return readCount < 2;
}

// 【表单】根据 "my_is_nullable": 0, 判断是否是必填字段
export function isRequired(field) {
  // 判断字段是否为必填字段
  return field.my_is_nullable == 0; // TODO: 2024/10/18 这是数据库是否可空的意思
}



/**
 * 将 File 对象转换为 （ArrayBuffer）
 * @param file - 要转换的 File 对象
 * @returns 一个 Promise，它解析为包含二进制数据的 ArrayBuffer
 */
export function fileToBinary(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("无法将文件转换为 ArrayBuffer"));
      }
    };

    reader.onerror = () => {
      reject(new Error("读取文件时出错"));
    };

    reader.readAsArrayBuffer(file);
  });
};


// 获取图片的完整 URL
export function getFullImageUrl(imageUrl) {
  // console.log(imageUrl, 'imageUrl');
  if (typeof imageUrl != 'string') return '';
  // 如果imageUrl是绝对路径 则直接返回
  if (imageUrl.startsWith('http') || imageUrl.startsWith('blob') || imageUrl.startsWith('data:image')) {
    return imageUrl;
  } else {
    // 如果是以/oss开头则拼接window.cdn_img_base_url
    if (imageUrl.startsWith('/oss')) {
      return (window.cdn_img_base_url || '') + imageUrl
    } else { // 否则拼接window.img_base_url
      return (window.img_base_url || '') + imageUrl
    }
  }
};

// 将html字符串数组转换为 html 元素数组
export function htmlStrToElements(htmlArray: string[]): ChildNode[] {
  console.log('htmlArray', htmlArray)
  const template = document.createElement('template');
  const elements: ChildNode[] = [];

  htmlArray.forEach(html => {
    template.innerHTML = html.trim();
    if (template.content.firstChild) {
      elements.push(template.content.firstChild.cloneNode(true));
    }
  });
  // console.log('elements',elements)
  return elements;
}

// 文件上传
export async function uploadFile(file: File, otherData?: any, onProgress?: (progress: number) => void) {
  const { data: { fileUploadSliceGuid } } = await getFileUploadSliceGuidApi();
  const fileContent: ArrayBuffer = await fileToBinary(file); // 将文件转换为二进制
  let data = objToFormData({
    fileName: file.name,
    fileUploadSliceGuid,
    fileSize: file.size,
    resize_width: 0,
    fileContent: new Blob([fileContent], { type: file.type }),
    // 其它参数
    ...otherData
  })
  return await uploadFileApi(data, (progressEvent) => {
    if (progressEvent.total) {
      // 计算进度
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      // 调用 onProgress 回调函数，将进度传递出去
      onProgress && onProgress(progress);
    }
  });
}

// 获取tableSelectNamePath [table组件]
export function getTableSelectNamePath(data: any) {
  const table = data.relative_table ? `/${data.relative_table}` : '';
  const colShow = data.relative_col_show ? `/${data.relative_col_show}` : '/name';
  const colStore = data.relative_col_store ? `/${data.relative_col_store}` : '';
  return `${table}${colShow}${colStore}`;
}

// 弹窗选择数据回显对应数据
export function formatTableSelectData(tableSelectField: any, tableSelectObjData: any) {
  // 根据tableSelectField的值去tableSelectObjData数组中遍历获取数据，返回数据的my_table_name值
  return tableSelectObjData.find(item => item.id == tableSelectField)?.my_table_name;
}


// 根据给定参数，去读外部文件，获取值
export async function getExternalFileValue() {
  const res = await fetch('/table-col.json');
  const data = await res.json();
  // console.log('data', data)
  // return data[params];
  return data;
}


// 计算属性：计算操作栏宽度
// export const getWidthByContent = (codingListCmds: any[]) => {
//   if (!codingListCmds || codingListCmds.length == 0) return;
//   // console.log('codingListCmds', codingListCmds)
//   // 一个文字12px，按钮padding 25px，间距12px
//   let width = 0;
//   codingListCmds.forEach(item => { // 计算每个按钮中文字的宽度+padding
//     width += item.cmd_cn.length * 12 + 25;
//   })
//   width += (codingListCmds.length) * 12; // 计算按钮之间的间距
//   width += 25; // 计算最后一个按钮的padding
//   return width;
// }
// 计算属性：计算操作栏宽度
export const getWidthByContent = (codingLists: any[][]) => {
  let maxWidth = 0;

  codingLists.forEach(codingListCmds => {
    if (!codingListCmds._coding_list_cmds_json || codingListCmds._coding_list_cmds_json.length === 0) return;

    let width = 0;
    codingListCmds._coding_list_cmds_json.forEach(item => { // 计算每个按钮中文字的宽度+padding
      width += item.cmd_cn.length * 12 + 25;
    });
    width += (codingListCmds._coding_list_cmds_json.length) * 12; // 计算按钮之间的间距
    width += 25; // 计算最后一个按钮的padding

    if (width > maxWidth) {
      maxWidth = width;
    }
  });

  return maxWidth;
}

// 获取navs所有的一级菜单 path  
export const getNavsFirstLevelPath = computed(() => (navs: any[]) => {
  return navs.map(item => item.path);
});

// 计算列宽
// 优先表头宽度[为了不换行], 其次单元格内容宽度
// 最后一列不计算宽度[默认占满剩余宽度]
export function getColumnWidth(key: string, cols: any[], isLastColumn: boolean = false, headerValue: string) {
  if (isLastColumn) {
    return 'auto';
  }

  let contentMaxWidth = 0;
  // 根据 headerValue 计算默认宽度
  const defaultWidth = headerValue.length * 16 + 45; // 假设每个字符宽度为16px，padding为45px (留出padding是为了有的表头内容还有排序箭头)

  cols.forEach(row => {
    const value = row[key];
    if (value === undefined || value === null) return;

    if (typeof value === 'string') {
      // 检查值是否为链接或相对地址
      if (value.startsWith('http') || value.startsWith('/')) {
        contentMaxWidth = Math.max(contentMaxWidth, defaultWidth); // 每次循环结束取最大值(同一列的数据有的是两个字，有的是三个字，取最大的)
      } else {
        // 计算每个单元格内容的宽度
        // const width = value.length * 10;
        // contentMaxWidth = Math.max(contentMaxWidth, width);

        // 计算每个单元格内容的宽度
        const englishAndNumbers = value.replace(/[\u4e00-\u9fa5]/g, '').length;
        const chineseCharacters = value.length - englishAndNumbers;
        const width = englishAndNumbers * 12 + chineseCharacters * 26; // 前者是英文和数字的宽度，后者是中文的宽度
        contentMaxWidth = Math.max(contentMaxWidth, width);
      }
    } else if (typeof value === 'number') {
      // 处理数字类型
      const width = value.toString().length * 16;
      contentMaxWidth = Math.max(contentMaxWidth, width);
    } else {
      // 处理其他类型，使用默认宽度
      contentMaxWidth = Math.max(contentMaxWidth, defaultWidth);
    }
  });

  // console.log('表头宽度', headerValue, defaultWidth)
  // console.log('内容宽度', contentMaxWidth)

  return contentMaxWidth > defaultWidth ? contentMaxWidth : defaultWidth;
  // return contentMaxWidth;
}