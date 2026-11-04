<script setup>
import { ref, nextTick } from 'vue';
import { todayTimeStamp, parseDateTextToUTC } from "@/utils/date.js";
import { validLeaveType, handoverStatus } from '@/constants/masterData';

const props = defineProps({
    processing: { type: Boolean, default: false },
});

// v-model与一览表view同步表单输入查询条件
const model = defineModel({ required: true });

const emit = defineEmits(["submit"]);

function requestSubmit() {
    emit("submit");
}

const formRef = ref(null);

// DOM聚焦
const leaveTypeBar = ref(null);
const beginningDateBar = ref(null);
const endingDateBar = ref(null);
const reasonBar = ref(null);
const handoverBar = ref(null);
const noticeBar = ref(null);

const inputRefs = {
    "leave-type": leaveTypeBar,
    "beginning-date": beginningDateBar,
    "ending-date": endingDateBar,
    "reason": reasonBar,
    "handover": handoverBar,
    "notice": noticeBar,
}
// 交接状态选择后马上校验
async function onHandoverChange(value) {
    console.log('单选事件的值：', value);

    await nextTick();

    await handoverBar.value?.validate();
}

// 申请表单校验函数
const leaveTypeRules = [
    value => {
        if (!value) return "休暇類別を選択してください";
        if (!validLeaveType.some(leaveType => leaveType.value === value)) return "正しい休暇類別を選択してください";
        return true;
    }
]

const beginningDateRules = [
    value => {
        const editedBeginningDate = parseDateTextToUTC(value);

        if (!editedBeginningDate) return "正しい開始日を選択してください";
        if (editedBeginningDate < todayTimeStamp()) return "開始日は今日以降の日付を選択してください";
        return true;
    }
]

const endingDateRules = [
    value => {
        const editedBeginningDate = parseDateTextToUTC(model.value.startDate);
        const editedEndingDate = parseDateTextToUTC(value);

        if (!editedEndingDate) return "正しい終了日を選択してください";
        if (editedBeginningDate && editedEndingDate < editedBeginningDate) return "終了日は開始日以降の日付を選択してください";
        if ((model.value.leaveType === "half-am" || model.value.leaveType === "half-pm") && editedBeginningDate !== editedEndingDate) return "半日休暇の場合、開始日と終了日は同じ日付にしてください";
        return true;
    }
]

const reasonRules = [
    value => {
        if (!value) return "申請理由は空白にできません";
        if (value.length > 200) return "申請理由は200文字以内で入力してください";
        return true;
    }
]

const handoverRules = [
    value => {
        console.log('handover 校验值：', value);
        if (!value) return "引継ぎ状況を選択してください";
        if (!handoverStatus.some(status => status.value === value)) return "正しい引継ぎ状況を選択してください";
        return true;
    }
]

const noticeRules = [
    value => {
        if (!value && model.value.leaveType === "special") return "特別休暇の場合、連絡事項に具体的な制度名を記入してください";
        if (value.length > 300) return "連絡事項は300文字以内で入力してください";
        return true;
    }
]

const onFormChange = async () => {
    // 休假类型或起始日变化时，重新校验结束日期是否合法
    if (model.value.endDate) {
        await endingDateBar.value?.validate();
    }
    // 休假类型变化时，重新校验是否要填写补充说明
    await noticeBar.value?.validate();
};

async function submit() {
    // 触发校验
    const { valid, errors } = await formRef.value?.validate();
    if (!valid) {
        // 聚焦第一个错误位置
        const firstError = errors[0];
        const input = inputRefs[firstError.id];
        if (firstError.id === "handover") {
            input?.value?.$el
                ?.querySelector('input[type="radio"]')
                ?.focus();
        } else {
            input?.value?.focus()
        };
        return;
    }

    requestSubmit();
}

const buttonStyle = {
    block: true,
    color: 'primary',
    size: 'x-large',
    class: 'my-4',
}
</script>

<template>
    <!-- 失败弹出错误信息 -->
    <!-- <AppMessage ref="appMessageRef" :form-error="applications.errorMessage" /> -->
    <v-form ref="formRef" @submit.prevent="submit" validate-on="blur" id="apply-form" novalidate>
        <!-- 休假类型下拉框 -->
        <v-select label="休暇種別" id="leave-type" name="leave-type" required :items="validLeaveType" placeholder="お選びください"
            v-model="model.leaveType" :rules="leaveTypeRules" ref="leaveTypeBar"
            @update:model-value="onFormChange" />
        <!-- 开始结束日期框响应式布局 -->
        <v-container fluid class="px-0">
            <v-row>
                <v-col cols="12" md="6">
                    <!-- 开始日期输入框 -->
                    <v-text-field label="開始日" id="beginning-date" name="beginning-date" type="date" required
                        v-model="model.startDate" :rules="beginningDateRules" ref="beginningDateBar"
                        @update:model-value="onFormChange" />
                </v-col>
                <v-col cols="12" md="6">
                    <!-- 结束日期输入框 -->
                    <v-text-field label="終了日" id="ending-date" name="ending-date" type="date" required
                        v-model="model.endDate" :rules="endingDateRules" ref="endingDateBar" />
                </v-col>
            </v-row>
        </v-container>
        <!-- 申请理由输入框 -->
        <v-textarea label="申請理由" id="reason" name="reason" rows="4" cols="40" maxlength="200" required
            v-model.trim="model.reason" :rules="reasonRules" ref="reasonBar" />
        <!-- 交接状况单选 -->
        <v-radio-group label="引継ぎ状況" v-model="model.handoverStatus" :rules="handoverRules" ref="handoverBar"
            id="handover" inline @update:model-value="onHandoverChange">
            <v-radio v-for="item in handoverStatus" :key="item.value" :label="item.title" :value="item.value"></v-radio>
        </v-radio-group>
        <!-- 联络事项输入框 -->
        <v-textarea label="連絡事項" id="notice" name="notice" rows="5" cols="40" maxlength="300"
            v-model="model.note" :rules="noticeRules" ref="noticeBar" />
        <!-- 提交表单按钮 -->
        <v-btn v-bind="buttonStyle" :disabled="props.processing" type="submit" id="apply-button">申請する</v-btn>
    </v-form>
</template>

<style scoped></style>