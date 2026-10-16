<script setup>
import { ref } from "vue";

const props = defineProps({
    formError: { type: String },
    loginedIn: { type: Boolean, default: false },
});

const emit = defineEmits(["submit"]);

function requestSubmit() {
    emit("submit", formInput.value);
}

//读取页面元素
const formRef = ref(null);

const formInput = ref({});

//聚焦获取DOM
const accountBar = ref(null);
const passwordBar = ref(null);

const inputRefs = {
    account: accountBar,
    password: passwordBar,
};

function focusAccount() {
    accountBar.value?.focus();
}

function focusPassword() {
    passwordBar.value?.focus();
}

defineExpose({
    focusAccount,
    focusPassword,
});

//账号密码校验函数
const accountRules = [
    (value) => {
        const editedAccount = value?.toLowerCase().trim();

        if (!editedAccount) return "ユーザー名は空白にできません";
        if (editedAccount.length < 4 || editedAccount.length > 20)
            return "ユーザー名は4～20文字で入力してください";

        return true;
    },
];

const passwordRules = [
    (value) => {
        const editedPassword = value?.trim();

        if (!editedPassword) return "パスワードは空白にできません";
        if (editedPassword.length < 8 || editedPassword.length > 32)
            return "パスワードは8～32文字で入力してください";

        return true;
    },
];

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
    color: "primary",
    size: "x-large",
    class: "my-4",
};
</script>

<template>
    <v-form ref="formRef" @submit.prevent="submitForm" validate-on="blur" action="index.html" method="post"
        class="legacy-page">
        <!-- 错误信息栏 -->
        <v-alert v-if="formError" ref="formErrorBar" type="error" variant="tonal" class="mb-4">
            {{ props.formError }}
        </v-alert>
        <!-- 有登录信息时的快速按钮 -->
        <v-btn v-if="props.loginedIn" v-bind="buttonStyle" type="button" id="home-button"
            :to="{ name: 'home' }">ホームへ</v-btn>
        <!-- 账号输入框 -->
        <v-text-field label="アカウント" id="account" name="account" type="text" minlength="4" maxlength="20"
            autocomplete="username" required v-model="formInput.account" :rules="accountRules" ref="accountBar" />
        <!-- 密码输入框 -->
        <v-text-field label="パスワード" id="password" name="password" type="password" minlength="8" maxlength="32"
            autocomplete="off" required v-model="formInput.password" :rules="passwordRules" ref="passwordBar"
            validate-on="blur" />
        <!-- 登录按钮 -->
        <v-btn v-bind="buttonStyle" type="submit" id="login-button" :disabled="processing">ログイン</v-btn>

        <RouterLink :to="{ name: 'register' }" class="link text-center d-block">アカウントをお持ちでない方</RouterLink>
    </v-form>
</template>

<style scoped></style>
