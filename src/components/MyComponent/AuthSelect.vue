<template>
    <div class="flex gap-x-3">
        <template v-for="(item, index) in cmdsArr" :key="index">
                <div v-if="!(index == 0 || index == 4)" class="flex items-center rounded-md px-2 bg-gray-100">
                <div>{{ userCmdTitles[index] }}：</div>
                <el-checkbox-group size="small" v-model="checkboxGroup[index]">
                    <el-checkbox-button v-for="(item, index) in cmdsStr" :key="index" :value="item" :label="item">
                        {{ item == 'r' ? '读' : item == 'e' ? '改' : item == 'a' ? '增' : item == 'd' ? '删' : '' }}
                    </el-checkbox-button>
                </el-checkbox-group>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ElCheckboxGroup, ElCheckboxButton } from 'element-plus';

const emit = defineEmits(['update:value']);
const props = defineProps({
    value: {
        type: String,
        default: ''
    }
});

const cmdsStr = ref(['r', 'e', 'a', 'd']);
const checkboxGroup = ref({
    0: [], // 待定
    1: [], // 开发者
    2: [], // 超级管理员
    3: [], // 普通管理员
    4: [], // 待定
});

const cmdsArr = ref([]); // 权限指令数组  ['read', ...]
const userCmdTitles = ref(["待定", "开发者", "超级管理员", "普通管理员", "待定"]); // 用户权限指令标题数组




if (props.value) {
    // 将props.value拆分数组 "read----re-----d--a-"  => ['read','----' 're--', '---d', '--a-']
    for (let i = 0; i < props.value.length; i += 4) {
        cmdsArr.value.push(props.value.slice(i, i + 4));
    }
    // 遍历cmdArr 将每个元素的值赋值给checkboxGroup
    for (let i = 0; i < cmdsArr.value.length; i++) {
        checkboxGroup.value[i] = cmdsArr.value[i].split('');
    }
} else {
    // 初始化为 ['read', 'read', 'read', 'read', 'read']
    for (let i = 0; i < 5; i++) {
        cmdsArr.value.push('read');
    }
}

// 将checkboxGroup的数据转为字符串 {0:['r','e','d'],1:['d'],2:[],3:[],4:[]} => 're-d---d------------'
function checkboxGroupToValue(data) {
    let value = '';
    for (let key in data) {
        let item = data[key]
        for (let i = 0; i < cmdsStr.value.length; i++) {
            if (item.includes(cmdsStr.value[i])) {
                value += cmdsStr.value[i];
            } else {
                value += '-';
            }
        }
    }
    return value;
}

// 监听checkboxGroup的变化
watch(checkboxGroup, () => {
    emit('update:value', checkboxGroupToValue(checkboxGroup.value));
}, { deep: true });
</script>

<style scoped></style>