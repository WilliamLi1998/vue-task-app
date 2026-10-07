<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
//计时器
let timeCounter;

const processing = ref(false);

function startTimeCounter() {
    clearInterval(timeCounter);//清空旧定时器
    //开始新定时器
    timeCounter = setTimeout(() => {
        processing.value = false;
    }, 2000);
}
//刷新后不保存表单
// window.addEventListener("load", () => {
//     document.querySelector("form").reset();
// });
//读取页面元素
const formRef = ref(null);

const accountInput = ref('');
const passwordInput = ref('');
const passwordCheckInput = ref('');
const nameInput = ref('');
const departmentInput = ref('');
//聚焦获取DOM
const accountBar = ref(null);
const passwordBar = ref(null);
const passwordCheckBar = ref(null);
const nameBar = ref(null);
const departmentBar = ref(null);

const inputRefs = {
    "account": accountBar,
    "password": passwordBar,
    "password-check": passwordCheckBar,
    "name": nameBar,
    "department": departmentBar
}


//账号格式
const accountPattern = /^[a-z0-9._-]{4,20}$/;

//有效部门
const ValidDepartments = [
    { title: "系统开发部", value: "development" },
    { title: "品质管理部", value: "quality" },
    { title: "营业部", value: "sales" },
    { title: "总务部", value: "general-affairs" },
    { title: "人事部", value: "human-resources" }
];

//账号密码校验函数
const accountRules = [
    value => {
        const editedAccount = value?.toLowerCase().trim();

        if (!editedAccount) return "ユーザー名は空白にできません";
        if (editedAccount.length < 4 || editedAccount.length > 20) return "ユーザー名は4～20文字で入力してください";
        if (!accountPattern.test(editedAccount)) return "ユーザー名を正しい形式で入力してください";

        return true;
    }
]

const passwordRules = [
    value => {

        if (!value) return "パスワードは空白にできません";
        if (value.length < 8 || value.length > 32) return "パスワードは8～32文字で入力してください";

        return true;
    }
]

const passwordCheckRules = [
    value => {

        if (!value) return "パスワードは空白にできません";
        if (value !== passwordInput.value) return "確認用パスワードが一致しません";

        return true;
    }
]

const nameRules = [
    value => {

        if (!value.trim()) return "氏名は空白にできません";
        if (value.trim().length < 2 || value.trim().length > 40) return "氏名は2～40文字で入力してください";

        return true;
    }
]

const departmentRules = [
    value => {

        if (!value) return "部署を選択してください";
        if (!ValidDepartments.some(department => department.value === value)) return "正しい部署を選択してください";

        return true;
    }
]
//密码更改后，重新验证两次密码输入是否一致
watch(passwordInput, async () => {
    await form.value?.validate()
})

//注册按钮
async function submitForm() {
    //点击后暂时禁用
    processing.value = true;
    startTimeCounter();
    const { valid, errors } = await formRef.value.validate();
    if (!valid) {
        const firstError = errors[0];
        const input = inputRefs[firstError.id];

        input?.value?.focus();

        return;
    }

    alert(`入力内容を確認しました アカウント：${accountInput.value.toLowerCase().trim()}、氏名：${nameInput.value.trim()}、所属：${ValidDepartments[departmentInput.value]}`);
    router.push({ name: 'login' });

}
</script>

<template>
    <v-form ref="formRef" @submit.prevent="submitForm" validate-on="blur" action="login.html" method="post"
        class="legacy-page">
        <p>
            <v-text-field id="account" name="account" minlength="4" maxlength="20" pattern="[a-z0-9._\-]{4,20}"
                title="半角英小文字、数字、「._-」のみ使用できます" required autocomplete="none" label="アカウント" v-model="accountInput"
                :rules="accountRules" ref="accountBar" />
            半角英小文字、数字、「._-」のみ使用できます
        </p>

            <v-text-field id="password" name="password" type="password" minlength="8" maxlength="32" autocomplete="none"
                required label="パスワード" v-model="passwordInput" :rules="passwordRules" ref="passwordBar" />

            <v-text-field id="password-check" name="password-check" type="password" minlength="8" maxlength="32"
                required label="パスワード (確認)" v-model="passwordCheckInput" :rules="passwordCheckRules"
                ref="passwordCheckBar" />

            <v-text-field id="name" name="name" minlength="2" maxlength="40" autocomplete="none" required label="氏名"
                v-model="nameInput" :rules="nameRules" ref="nameBar" />

        <p>
            <v-text-field id="no" name="no" disabled label="社員番号" /> *社員番号は登録完了時に自動採番されます
        </p>

            <v-select id="department" name="department" autocomplete="none" required v-model="departmentInput"
                ref="departmentBar" :items="ValidDepartments" label="所属" placeholder="お選びください"
                :rules="departmentRules" />

        <v-btn block color="primary" type="submit" id="register-button" :disabled="processing">登録する</v-btn>
        <!-- <p id="register-success" class="success-message"></p>
        <p id="register-confirm" class="success-message"></p> -->

        <RouterLink :to="{ name: 'login' }" class="link text-center d-block">ログインページへ</RouterLink>
    </v-form>
</template>

<style scoped></style>