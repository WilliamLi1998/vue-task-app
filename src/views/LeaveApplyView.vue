<script setup>
import { nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import { todayTimeStamp, parseDateTextToUTC, calculateDateSpan } from "../utils/date.js";

const router = useRouter()

import BusinessLayout from '../components/layout/BusinessLayout.vue';

let remainingLeaveDays = 10;
let paidLeaveDays;

const processing = ref(false);

//计时器
let timeCounter;

function startTimeCounter() {
    clearInterval(timeCounter);//清空旧定时器
    //开始新定时器
    timeCounter = setTimeout(() => {
        processing.value = false;
    }, 2000);
}
//刷新后不保存表单 待改
// window.addEventListener("load", () => {
//     document.querySelector("form").reset();
// });
//检查登录状态 待改
// const currentUserData = sessionStorage.getItem("paidLeaveCurrentUser");
// let currentUserInfo;
// if (currentUserData === null) {
//     location.href = "login.html";
// } else {
//     try {
//         currentUserInfo = JSON.parse(currentUserData);
//         if (!currentUserInfo.employeeNumber || !currentUserInfo.name || !currentUserInfo.department) {
//             throw new Error("ユーザーデータが破損しているか、必要な項目が不足しています");
//         }
//     } catch (error) {
//         console.error(error.message);
//         sessionStorage.removeItem("paidLeaveCurrentUser");
//         location.href = "login.html";
//     }
// }

const validLeaveType = [
    { title: '有給休暇', value: 'paid' },
    { title: '半日休暇（午前）', value: 'half-am' },
    { title: '半日休暇（午後）', value: 'half-pm' },
    { title: '特別休暇', value: 'special' }
]
//导入DOM元素
const formRef = ref(null);

const leaveTypeInput = ref('');
const beginningDateInput = ref('');
const endingDateInput = ref('');
const reasonInput = ref('');
const handoverInput = ref('');
const noticeInput = ref('');

const formErrorBar = ref(null);

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

//检查并读取草稿 待改
// let paidLeaveDraft = sessionStorage.getItem("paidLeaveDraft");
let paidLeaveInfo;
// if (paidLeaveDraft === null) {
//     //没有草稿时跳过
// } else {
//     try {
//         paidLeaveInfo = JSON.parse(paidLeaveDraft);
//         if (!paidLeaveInfo.ownerEmployeeNumber || !paidLeaveInfo.leaveType || !paidLeaveInfo.beginningDate
//             || !paidLeaveInfo.endingDate || !paidLeaveInfo.paidLeaveDays || !paidLeaveInfo.reason
//             || !paidLeaveInfo.handover
//         ) {
//             throw new Error("下書きが破損しているか、必要な項目が不足しています");
//         }
//     } catch (error) {
//         alert("下書きが破損しているか、必要な項目が不足しています");
//         console.error(error.message);
//         sessionStorage.removeItem("paidLeaveDraft");
//     }
// }
// if (paidLeaveInfo.ownerEmployeeNumber && paidLeaveInfo.ownerEmployeeNumber !== currentUserInfo.employeeNumber) {
//     sessionStorage.removeItem("paidLeaveDraft");
// } else {

// }

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
        const editedBeginningDate = parseDateTextToUTC(beginningDateInput.value);
        const editedEndingDate = parseDateTextToUTC(value);

        if (!editedEndingDate) return "正しい終了日を選択してください";
        if (editedBeginningDate && editedEndingDate < editedBeginningDate) return "終了日は開始日以降の日付を選択してください";
        if ((leaveTypeInput.value === "half-am" || leaveTypeInput.value === "half-pm") && editedBeginningDate !== editedEndingDate) return "半日休暇の場合、開始日と終了日は同じ日付にしてください";
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
        if (!value) return "引継ぎ状況を選択してください";
        if (value !== "finish" && value !== "unneeded") return "正しい引継ぎ状況を選択してください";
        return true;
    }
]

const noticeRules = [
    value => {
        if (!value && leaveTypeInput.value === "special") return "特別休暇の場合、連絡事項に具体的な制度名を記入してください";
        if (value.length > 300) return "連絡事項は300文字以内で入力してください";
        return true;
    }
]

const onFormChange = async () => {
    if (endingDateInput.value) {
        await endingDateBar.value?.validate();
    }
    await noticeBar.value?.validate();
};

async function submitForm() {
    formError.value = ""
    //点击后暂时禁用
    processing.value = true;
    startTimeCounter();
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

    //计算申请天数
    if (leaveTypeInput.value === "half-am" || leaveTypeInput.value === "half-pm") {
        paidLeaveDays = 0.5;
    } else {
        paidLeaveDays = calculateDateSpan(beginningDateInput.value, endingDateInput.value);
    }
    if (paidLeaveDays > remainingLeaveDays) {
        formError.value = "申請日数は現在の有給休暇残日数を超えることはできません";

        await nextTick();

        formErrorBar.value?.$el?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
        return;
    }
}

//申请按钮 保存待改
// applyForm.addEventListener("submit", event => {
//     event.preventDefault();

//     const handoverSelected = document.querySelector('input[name="handover"]:checked');

//     //点击后暂时禁用
//     applyButton.disabled = true;
//     startTimeCounter();
//     //清除原有错误显示
//     //调用登陆函数
//     const checkResult = applyCheck(leaveTypeBar.value, beginningDateBar.value, endingDateBar.value, reasonBar.value, handoverSelected?.value, noticeBar.value);
//     if (checkResult) {
//         console.log("success");
//         paidLeaveDraft = {
//             ownerEmployeeNumber: currentUserInfo.employeeNumber,
//             leaveType: leaveTypeBar.value,
//             beginningDate: beginningDateBar.value,
//             endingDate: endingDateBar.value,
//             paidLeaveDays: Number(paidLeaveDays),
//             reason: reasonBar.value,
//             handover: handoverSelected.value,
//             notice: noticeBar.value
//         };
//         //保存输入状态
//         try {
//             sessionStorage.setItem("paidLeaveDraft", JSON.stringify(paidLeaveDraft));
//         } catch (error) {
//             console.error(error.message);
//             alert("下書きは保存できません");
//             return;
//         }
//         location.href = "confirm.html";
//     }
// })
</script>

<template>
    <BusinessLayout title="休暇申請">
        <main class="legacy-page">
            <section class="box">
                <v-form ref="formRef" @submit.prevent="submitForm" validate-on="blur" id="apply-form"
                    action="confirm.html" method="get" novalidate>
                    <v-alert v-if="formError" ref="formErrorBar" type="error" variant="tonal" class="mb-4">
                        {{ formError }}
                    </v-alert>
                    <v-select label="休暇種別" id="leave-type" name="leave-type" required :items="validLeaveType"
                        placeholder="お選びください" v-model="leaveTypeInput" :rules="leaveTypeRules" ref="leaveTypeBar"
                        @update:model-value="onFormChange" />

                    <div class="date-bar">
                        <p>
                            <v-text-field label="開始日" id="beginning-date" name="beginning-date" type="date" required
                                v-model="beginningDateInput" :rules="beginningDateRules" ref="beginningDateBar"
                                @update:model-value="onFormChange" />
                        </p>
                        <p>
                            <v-text-field label="終了日" id="ending-date" name="ending-date" type="date" required
                                v-model="endingDateInput" :rules="endingDateRules" ref="endingDateBar" />
                        </p>
                    </div>

                    <v-textarea label="申請理由" id="reason" name="reason" rows="4" cols="40" maxlength="200" required
                        v-model="reasonInput" :rules="reasonRules" ref="reasonBar" />

                    <v-radio-group label="引継ぎ状況" v-model="handoverInput" :rules="handoverRules" ref="handoverBar"
                        id="handover" inline>
                        <v-radio label="対応済" id="finish" name="handover" type="radio" value="finish" required />
                        <v-radio label="対応不要" id="unneeded" name="handover" type="radio" value="unneeded" />
                    </v-radio-group>

                    <v-textarea label="連絡事項" id="notice" name="notice" rows="5" cols="40" maxlength="300"
                        v-model="noticeInput" :rules="noticeRules" ref="noticeBar" />

                    <v-btn block color="primary" :disabled="processing" type="submit" id="apply-button">申請する</v-btn>
                </v-form>
            </section>
        </main>

        <footer>
            <p>現在は確認画面の動作確認のため、固定のテストデータを表示しています。</p>
        </footer>
    </BusinessLayout>
</template>

<style scoped></style>