<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import { todayTimeStamp, parseDateTextToUTC, calculateDateSpan } from "../utils/date.js";

const router = useRouter()

import BusinessLayout from '../components/layout/BusinessLayout.vue';

let remainingLeaveDays = 100;
let paidLeaveDays
//计时器
let timeCounter;

function startTimeCounter() {
    clearInterval(timeCounter);//清空旧定时器
    //开始新定时器
    timeCounter = setTimeout(() => {
        applyButton.disabled = false;
    }, 2000);
}
//刷新后不保存表单
// window.addEventListener("load", () => {
//     document.querySelector("form").reset();
// });
//检查登录状态
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
//休假类型映射
// const validLeaveType = {
//     paid: "有給休暇",
//     "half-am": "半日休暇（午前）",
//     "half-pm": "半日休暇（午後）",
//     special: "特別休暇"
// };
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

const leaveTypeBar = ref('');
const beginningDateBar = ref('');
const endingDateBar = ref('');
const reasonBar = ref('');
const handoverBar = ref('');
const noticeBar = ref('');

const inputRefs = {
    leaveType: leaveTypeBar,
    beginningDate: beginningDateBar,
    endingDate: endingDateBar,
    reason: reasonBar,
    handover: handoverBar,
    notice: noticeBar
}

// const applyForm = document.getElementById("apply-form");
// const applyButton = document.getElementById("apply-button");

// const leaveTypeError = document.getElementById("leaveTypeError");
// const beginningDateError = document.getElementById("beginningDateError");
// const endingDateError = document.getElementById("endingDateError");
// const reasonError = document.getElementById("reasonError");
// const handoverError = document.getElementById("handoverError");
// const noticeError = document.getElementById("noticeError");
// const paidLeaveDaysError = document.getElementById("paidLeaveDaysError");
//检查并读取草稿
// let paidLeaveDraft = sessionStorage.getItem("paidLeaveDraft");
let paidLeaveInfo;
if (paidLeaveDraft === null) {
    //没有草稿时跳过
} else {
    try {
        paidLeaveInfo = JSON.parse(paidLeaveDraft);
        if (!paidLeaveInfo.ownerEmployeeNumber || !paidLeaveInfo.leaveType || !paidLeaveInfo.beginningDate
            || !paidLeaveInfo.endingDate || !paidLeaveInfo.paidLeaveDays || !paidLeaveInfo.reason
            || !paidLeaveInfo.handover
        ) {
            throw new Error("下書きが破損しているか、必要な項目が不足しています");
        }
    } catch (error) {
        alert("下書きが破損しているか、必要な項目が不足しています");
        console.error(error.message);
        sessionStorage.removeItem("paidLeaveDraft");
    }
}
if (paidLeaveInfo.ownerEmployeeNumber && paidLeaveInfo.ownerEmployeeNumber !== currentUserInfo.employeeNumber) {
    sessionStorage.removeItem("paidLeaveDraft");
} else {

}

leaveTypeBar.addEventListener("change", () => {
    if (leaveTypeBar.value === "special") {
        leaveTypeError.textContent = "特別休暇の場合、連絡事項に具体的な制度名を記入してください";
        noticeError.textContent = "特別休暇の場合、連絡事項に具体的な制度名を記入してください";
    }
})
//申请表单校验函数
const leaveTypeRules = [
    value => {

        if (!value) return "休暇類別を選択してください";
        if (!validLeaveType.some(leaveType => leaveType.value === value)) return "正しい休暇類別を選択してください";

        return true;
    }
]

const beginningDateRules = [
    value => {

        if (!value) return "休暇類別を選択してください";
        if (!validLeaveType.some(leaveType => leaveType.value === value)) return "正しい休暇類別を選択してください";

        return true;
    }
]

function applyCheck(leaveType, beginningDate, endingDate, reason, handover, notice) {
    //处理表单格式
    const editedbeginningDate = parseDateTextToUTC(beginningDate);
    const editedendingDate = parseDateTextToUTC(endingDate);
    const editedReason = reason.toString().trim();
    const editedNotice = notice.toString().trim();
    //正确错误状态
    let leaveTypeInValid = true;
    let beginningDateInValid = true;
    let endingDateInValid = true;
    let reasonInValid = true;
    let handoverInValid = true;
    let noticeInValid = true;

    //休假类型校验
    if (leaveType === "") {
        leaveTypeError.textContent = "休暇類別を選択してください";
        leaveTypeBar.setAttribute("aria-invalid", "true");
    } else if (!leaveType || !Object.keys(validLeaveType).includes(leaveType)) {
        leaveTypeError.textContent = "正しい休暇類別を選択してください";
        leaveTypeBar.setAttribute("aria-invalid", "true");
    } else {
        leaveTypeInValid = false;
    }
    //开始日期校验
    if (!editedbeginningDate) {
        beginningDateError.textContent = "正しい開始日を選択してください";
        beginningDateBar.setAttribute("aria-invalid", "true");
    } else if (editedbeginningDate < todayTimeStamp) {
        beginningDateError.textContent = "開始日は今日以降の日付を選択してください";
        beginningDateBar.setAttribute("aria-invalid", "true");
    } else {
        beginningDateInValid = false;
    }
    //结束日期校验
    if (!editedendingDate) {
        endingDateError.textContent = "正しい終了日を選択してください";
        endingDateBar.setAttribute("aria-invalid", "true");
    } else if (!editedbeginningDate) {
        //开始日期不合法时不会继续判定
    } else if (editedendingDate < editedbeginningDate) {
        endingDateError.textContent = "終了日は開始日以降の日付を選択してください";
        endingDateBar.setAttribute("aria-invalid", "true");
    } else if ((leaveType === "half-am" || leaveType === "half-pm") && editedbeginningDate !== editedendingDate) {
        endingDateError.textContent = "半日休暇の場合、開始日と終了日は同じ日付にしてください";
        endingDateBar.setAttribute("aria-invalid", "true");
    } else {
        endingDateInValid = false;
    }
    //申请理由校验
    if (!editedReason) {
        reasonError.textContent = "申請理由は空白にできません";
        reasonBar.setAttribute("aria-invalid", "true");
    } else if (editedReason.length > 200) {
        reasonError.textContent = "申請理由は200文字以内で入力してください";
        reasonBar.setAttribute("aria-invalid", "true");
    } else {
        reasonInValid = false;
    }
    //交接状况校验
    // const handoverSelected = document.querySelector('input[name="handover"]:checked');
    if (!handover) {
        handoverError.textContent = "引継ぎ状況を選択してください";
        handoverBar.setAttribute("aria-invalid", "true");
    } else if (handover !== "finish" && handover !== "unneeded") {
        handoverError.textContent = "正しい引継ぎ状況を選択してください";
        handoverBar.setAttribute("aria-invalid", "true");
    } else {
        handoverInValid = false;
    }
    //联络事项校验
    if (leaveType === "special" && !editedNotice) {
        noticeError.textContent = "特別休暇の場合、連絡事項に具体的な制度名を記入してください";
        noticeBar.setAttribute("aria-invalid", "true");
    } else if (editedNotice.length > 300) {
        noticeError.textContent = "連絡事項は300文字以内で入力してください";
        noticeBar.setAttribute("aria-invalid", "true");
    } else {
        noticeInValid = false;
    }
    //计算申请天数
    paidLeaveDaysInValid = false;
    if (!beginningDateInValid && !endingDateInValid) {
        paidLeaveDays = 0;
        if (leaveType === "half-am" || leaveType === "half-pm") {
            paidLeaveDays = 0.5;
        } else {
            paidLeaveDays = calculateDateSpan(beginningDate, endingDate);
        }
        if (paidLeaveDays > remainingLeaveDays) {
            paidLeaveDaysInValid = true;
            paidLeaveDaysError.textContent = "申請日数は現在の有給休暇残日数を超えることはできません";
            // beginningDateBar.setAttribute("aria-invalid", "true");
            // endingDateBar.setAttribute("aria-invalid", "true");
        }
    }
    //格式不正确时获得焦点
    if (paidLeaveDaysInValid) {
        paidLeaveDaysError.focus();
    } else if (leaveTypeInValid) {
        leaveTypeBar.focus();
    } else if (beginningDateInValid) {
        beginningDateBar.focus();
    } else if (endingDateInValid) {
        endingDateBar.focus();
    } else if (reasonInValid) {
        reasonBar.focus();
    } else if (handoverInValid) {
        handoverBar.focus();
    } else if (noticeInValid) {
        noticeBar.focus();
    } else {//输入无误后成功
        return true;
    }
    return false;
}
//申请按钮
applyForm.addEventListener("submit", event => {
    event.preventDefault();

    const handoverSelected = document.querySelector('input[name="handover"]:checked');

    //点击后暂时禁用
    applyButton.disabled = true;
    startTimeCounter();
    //清除原有错误显示
    paidLeaveDaysError.textContent = "";
    leaveTypeError.textContent = "";
    beginningDateError.textContent = "";
    endingDateError.textContent = "";
    reasonError.textContent = "";
    handoverError.textContent = "";
    noticeError.textContent = "";
    leaveTypeBar.setAttribute("aria-invalid", "false");
    beginningDateBar.setAttribute("aria-invalid", "false");
    endingDateBar.setAttribute("aria-invalid", "false");
    reasonBar.setAttribute("aria-invalid", "false");
    handoverBar.setAttribute("aria-invalid", "false");
    noticeBar.setAttribute("aria-invalid", "false");
    //调用登陆函数
    const checkResult = applyCheck(leaveTypeBar.value, beginningDateBar.value, endingDateBar.value, reasonBar.value, handoverSelected?.value, noticeBar.value);
    if (checkResult) {
        console.log("success");
        paidLeaveDraft = {
            ownerEmployeeNumber: currentUserInfo.employeeNumber,
            leaveType: leaveTypeBar.value,
            beginningDate: beginningDateBar.value,
            endingDate: endingDateBar.value,
            paidLeaveDays: Number(paidLeaveDays),
            reason: reasonBar.value,
            handover: handoverSelected.value,
            notice: noticeBar.value
        };
        //保存输入状态
        try {
            sessionStorage.setItem("paidLeaveDraft", JSON.stringify(paidLeaveDraft));
        } catch (error) {
            console.error(error.message);
            alert("下書きは保存できません");
            return;
        }
        location.href = "confirm.html";
    }
})
</script>

<template>
  <BusinessLayout title="休暇申請">
    <main class="legacy-page">
      <section class="box">
        <v-form ref="formRef" @submit.prevent="submitForm" validate-on="blur" id="apply-form" action="confirm.html" method="get" novalidate>
          <!-- <p id="paidLeaveDaysError" class="error-message"></p> -->
            <!-- <label for="leave-type">休暇種別 <span>必須</span></label> -->
            <v-select label="休暇種別" id="leave-type" name="leave-type" required 
            v-model="leaveTypeInput" :rules="leaveTypeRules" ref="leaveTypeBar"/>
              <option value="">お選びください</option>
              <option value="paid">有給休暇</option>
              <option value="half-am">半日休暇（午前）</option>
              <option value="half-pm">半日休暇（午後）</option>
              <option value="special">特別休暇</option>
          <!-- <p id="leaveTypeError" class="error-message"></p> -->

          <div class="date-bar">
            <p>
              <!-- <label for="beginning-date">開始日 <span>必須</span></label> -->
              <v-text-field label="開始日" id="beginning-date" name="beginnign-date" type="date"
                required v-model="beginningDateInput" :rules="beginningDateRules" ref="beginningDateBar" />
            </p>
            <p>
              <!-- <label for="ending-date">終了日 <span>必須</span></label> -->
              <v-text-field label="終了日" id="ending-date" name="ending-date" type="date" required
                v-model="endingDateInput" :rules="endingDateRules" ref="endingDateBar" />
            </p>
          </div>
          <!-- <p id="beginningDateError" class="error-message"></p>
          <p id="endingDateError" class="error-message"></p> -->

          <p>
            <!-- <label for="reason">申請理由 <span>必須</span></label> -->
            <v-textarea label="申請理由" id="reason" name="reason" rows="4" cols="40" maxlength="200" required 
              v-model="reasonInput" :rules="reasonRules" ref="reasonBar" />
          </p>
          <!-- <p id="reasonError" class="error-message"></p> -->

          <v-radio-group label="引継ぎ状況" v-model="handoverInput" :rules="handoverRules" ref="handoverBar" id="handover" inline>
            <!-- <legend>引継ぎ状況 <span>必須</span></legend> -->
            <!-- <div class="fieldset-content"> -->
              <!-- <div class="flex"> -->
                <v-ratio label="対応済" id="finish" name="handover" type="radio" value="finish" required />
                <!-- <label for="finish">対応済</label> -->
              <!-- </div> -->
              <!-- <div class="flex"> -->
                <v-ratio label="対応不要" id="unneeded" name="handover" type="radio" value="unneeded" />
                <!-- <label for="unneeded">対応不要</label>
              </div> -->
            <!-- </div> -->
          </v-radio-group>
          <!-- <p id="handoverError" class="error-message"></p> -->

          <p>
            <!-- <label for="notice">連絡事項</label> -->
            <v-textarea label="連絡事項" id="notice" name="notice" rows="5" cols="40" maxlength="300" 
              v-model="noticeInput" :rules="noticeRules" ref="noticeBar" />
          </p>
          <!-- <p id="noticeError" class="error-message"></p> -->

          <v-btn type="submit" id="apply-button">申請する</v-btn>
        </v-form>
      </section>
    </main>

    <footer>
      <p>現在は確認画面の動作確認のため、固定のテストデータを表示しています。</p>
    </footer>
  </BusinessLayout>
</template>

<style scoped></style>