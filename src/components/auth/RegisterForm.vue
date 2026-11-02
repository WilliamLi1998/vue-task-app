<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    formError: { type: String },
    validDepartments: { type: Array, required: true },
    processing: { type: Boolean, default: false },
    loadingDepartments: { type: Boolean, default: false },
});
const emit = defineEmits(["submit"]);

function requestSubmit() {
    emit("submit", formInput.value);
}

//读取页面元素
const formRef = ref(null);
const formInput = ref({
    account: "",
    password: "",
    passwordConfirmation: "",
    name: "",
    department: "",
});
//聚焦获取DOM
const accountBar = ref(null);
const passwordBar = ref(null);
const passwordConfirmationBar = ref(null);
const nameBar = ref(null);
const departmentBar = ref(null);

const inputRefs = {
    "account": accountBar,
    "password": passwordBar,
    "password-check": passwordConfirmationBar,
    "name": nameBar,
    "department": departmentBar
}
//
function focusAccount() {
    accountBar.value?.focus();
}

function focusPassword() {
    passwordBar.value?.focus();
}

function focusPasswordConfirmation() {
    passwordConfirmationBar.value?.focus();
}

function focusName() {
    nameBar.value?.focus();
}

function focusDepartment() {
    departmentBar.value?.focus();
}

defineExpose({
    focusAccount,
    focusPassword,
    focusPasswordConfirmation,
    focusName,
    focusDepartment
});

//账号格式
const accountPattern = /^[a-z0-9._-]{4,20}$/;

//表单校验函数
const accountRules = [
    value => {
        // const editedAccount = value?.toLowerCase().trim();

        if (!value) return "ユーザー名は空白にできません";
        if (value.length < 4 || value.length > 20) return "ユーザー名は4～20文字で入力してください";
        if (!accountPattern.test(value)) return "ユーザー名を正しい形式で入力してください";

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

const passwordConfirmationRules = [
    value => {

        if (!value) return "パスワードは空白にできません";
        if (value !== formInput.value.password) return "確認用パスワードが一致しません";

        return true;
    }
]

const nameRules = [
    value => {

        if (!value) return "氏名は空白にできません";
        if (value.length < 2 || value.length > 40) return "氏名は2～40文字で入力してください";

        return true;
    }
]

const departmentRules = [
    value => {

        if (!value) return "部署を選択してください";
        if (!props.validDepartments.some(department => department.value === value)) return "正しい部署を選択してください";

        return true;
    }
]
//密码更改后，重新验证两次密码输入是否一致
watch(
    () => formInput.value.password,
    async () => {
        if (formInput.value.passwordConfirmation) {
            await passwordConfirmationBar.value?.validate();
        }
    })

//注册按钮
async function submitForm() {

    const { valid, errors } = await formRef.value.validate();
    if (!valid) {
        const firstError = errors[0];
        const input = inputRefs[firstError.id];

        input?.value?.focus();

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
    <v-form ref="formRef" @submit.prevent="submitForm" validate-on="blur" action="login.html" method="post">
        <!-- 账号输入栏 -->
        <p>
            <v-text-field id="account" name="account" minlength="4" maxlength="20" pattern="[a-z0-9._\-]{4,20}"
                title="半角英小文字、数字、「._-」のみ使用できます" required autocomplete="none" label="アカウント"
                v-model.trim="formInput.account" :rules="accountRules" ref="accountBar" />
            半角英小文字、数字、「._-」のみ使用できます
        </p>
        <!-- 密码输入栏 -->
        <v-text-field id="password" name="password" type="password" minlength="8" maxlength="32" autocomplete="none"
            required label="パスワード" v-model="formInput.password" :rules="passwordRules" ref="passwordBar" />
        <!-- 密码确认输入栏 -->
        <v-text-field id="password-check" name="password-check" type="password" minlength="8" maxlength="32" required
            label="パスワード (確認)" v-model="formInput.passwordConfirmation" :rules="passwordConfirmationRules"
            ref="passwordConfirmationBar" />
        <!-- 人名输入栏 -->
        <v-text-field id="name" name="name" minlength="2" maxlength="40" autocomplete="none" required label="氏名"
            v-model.trim="formInput.name" :rules="nameRules" ref="nameBar" />
        <!-- 禁用社员号码 -->
        <p>
            <v-text-field id="no" name="no" disabled label="社員番号" /> *社員番号は登録完了時に自動採番されます
        </p>
        <!-- 部门选择栏 -->
        <v-select id="department" name="department" autocomplete="none" required v-model="formInput.department"
            ref="departmentBar" :items="props.validDepartments" item-title="label" label="所属" placeholder="お選びください"
            :rules="departmentRules" :disabled="loadingDepartments" />
        <!-- 提交按钮 -->
        <v-btn v-bind="buttonStyle" type="submit" id="register-button" :disabled="props.processing">登録する</v-btn>
        <!-- 登录页面链接 -->
        <RouterLink :to="{ name: 'login' }" class="link text-center d-block">ログインページへ</RouterLink>
    </v-form>
</template>

<style scoped></style>