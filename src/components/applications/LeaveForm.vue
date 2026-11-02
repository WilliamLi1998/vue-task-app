<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router'
import { todayTimeStamp, parseDateTextToUTC } from "@/utils/date.js";
import { validLeaveType, handoverStatus } from '@/constants/masterData';
import { useApplications } from '@/stores/applications';
import AppMessage from '../common/AppMessage.vue';

const router = useRouter();

const applications = useApplications();

const processing = ref(false);

//导入DOM元素
const formRef = ref(null);

const applicationDraft = ref({
    "leaveType": "",
    "startDate": "",
    "endDate": "",
    "reason": "",
    "handoverStatus": "",
    "note": "",
});

onMounted(() => {
    if (applications.applicationDraft) {
        applicationDraft.value = applications.applicationDraft;
    }
})

onUnmounted(() => {
    applications.errorMessage = '';
});

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
    "notice": noticeBar
}

async function onHandoverChange(value) {
    console.log('单选事件的值：', value);

    await nextTick();

    console.log(
        'v-model 当前值：',
        applicationDraft.value.handoverStatus
    );

    await handoverBar.value?.validate();
}
//申请表单校验函数
const formError = ref("");

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
        const editedBeginningDate = parseDateTextToUTC(applicationDraft.value.startDate);
        const editedEndingDate = parseDateTextToUTC(value);

        if (!editedEndingDate) return "正しい終了日を選択してください";
        if (editedBeginningDate && editedEndingDate < editedBeginningDate) return "終了日は開始日以降の日付を選択してください";
        if ((applicationDraft.value.leaveType === "half-am" || applicationDraft.value.leaveType === "half-pm") && editedBeginningDate !== editedEndingDate) return "半日休暇の場合、開始日と終了日は同じ日付にしてください";
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
        if (!value && applicationDraft.value.leaveType === "special") return "特別休暇の場合、連絡事項に具体的な制度名を記入してください";
        if (value.length > 300) return "連絡事項は300文字以内で入力してください";
        return true;
    }
]

const onFormChange = async () => {
    if (applicationDraft.value.endDate) {
        await endingDateBar.value?.validate();
    }
    await noticeBar.value?.validate();
};

async function submitForm() {
    formError.value = "";
    //点击后暂时禁用
    processing.value = true;
    try {
        const { valid, errors } = await formRef.value?.validate();
        if (!valid) {
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

        applications.applicationDraft = applicationDraft.value;
        router.push({ name: 'leave-confirm' });
    } catch (error) {
        console.error(error);
    } finally {
        processing.value = false;
    }
}

const buttonStyle = {
    block: true,
    color: 'primary',
    size: 'x-large',
    class: 'my-4',
}
</script>

<template>
    <main>
        <section>
            <AppMessage ref="appMessageRef" :form-error="applications.errorMessage"></AppMessage>
            <v-form ref="formRef" @submit.prevent="submitForm" validate-on="blur" id="apply-form" action="confirm.html"
                method="get" novalidate>
                <v-select label="休暇種別" id="leave-type" name="leave-type" required :items="validLeaveType"
                    placeholder="お選びください" v-model="applicationDraft.leaveType" :rules="leaveTypeRules"
                    ref="leaveTypeBar" @update:model-value="onFormChange" />

                <v-container class="px-0">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field label="開始日" id="beginning-date" name="beginning-date" type="date" required
                                v-model="applicationDraft.startDate" :rules="beginningDateRules" ref="beginningDateBar"
                                @update:model-value="onFormChange" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="終了日" id="ending-date" name="ending-date" type="date" required
                                v-model="applicationDraft.endDate" :rules="endingDateRules" ref="endingDateBar" />
                        </v-col>
                    </v-row>
                </v-container>

                <v-textarea label="申請理由" id="reason" name="reason" rows="4" cols="40" maxlength="200" required
                    v-model.trim="applicationDraft.reason" :rules="reasonRules" ref="reasonBar" />

                <v-radio-group label="引継ぎ状況" v-model="applicationDraft.handoverStatus" :rules="handoverRules"
                    ref="handoverBar" id="handover" inline @update:model-value="onHandoverChange">
                    <v-radio v-for="item in handoverStatus" :key="item.value" :label="item.title"
                        :value="item.value"></v-radio>
                </v-radio-group>

                <v-textarea label="連絡事項" id="notice" name="notice" rows="5" cols="40" maxlength="300"
                    v-model="applicationDraft.note" :rules="noticeRules" ref="noticeBar" />

                <v-btn v-bind="buttonStyle" :disabled="processing" type="submit" id="apply-button">申請する</v-btn>
            </v-form>
        </section>
    </main>

    <footer>
    </footer>
</template>

<style scoped></style>