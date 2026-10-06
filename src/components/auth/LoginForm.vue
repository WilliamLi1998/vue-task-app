<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

//正确账号密码
const savedAccount = "training.user";
const savedPassword = "training123";
//读取页面元素
const formRef = ref(null);

const accountInput = ref('');
const passwordInput = ref('');
//聚焦获取DOM
const accountBar = ref(null);
const passwordBar = ref(null);

const inputRefs = {
    account: accountBar,
    password: passwordBar
}


// const errorMessage = ref({});
const processing = ref(false);
// const loginButton = document.getElementById("login-button");
// const homeButton = document.getElementById("home-button");
//正确用户信息
const userInfo = {
    employeeNumber: "EMP-00001",
    name: "山田 太郎",
    department: "development"
};
//检查用户信息格式，正确后显示直接跳转按钮 待改

// const currentUserInfo = JSON.parse(sessionStorage.getItem("paidLeaveCurrentUser"));
// if (currentUserInfo && currentUserInfo.employeeNumber && currentUserInfo.name && currentUserInfo.department) {
//     homeButton.style.display = "block";
// }

//计时器
let timeCounter;

function startTimeCounter() {
    clearInterval(timeCounter);//清空旧定时器
    //开始新定时器
    timeCounter = setTimeout(() => {
        processing.value = false;
    }, 1000);
}

//账号密码校验函数
const accountRules = [
    value => {
        const editedAccount = value?.toString().toLowerCase().trim();

        if (!editedAccount) return "ユーザー名は空白にできません";
        if (editedAccount.length < 4 || editedAccount.length > 20) return "ユーザー名は4～20文字で入力してください";

        return true;
    }
]

const passwordRules = [
    value => {
        const editedPassword = value?.toString();

        if (!editedPassword) return "パスワードは空白にできません";
        if (editedPassword.length < 8 || editedPassword.length > 32) return "パスワードは8～32文字で入力してください";

        return true;
    }
]

function loginCheck(account, password) {
    //处理账号密码格式
    // let editedAccount = account.toString().toLowerCase().trim();
    // let editedPassword = password.toString();
    //正确错误状态
    let accountInValid = true;
    let passwordInValid = true;
    //账号格式校验
    // if (editedAccount === "") {
    //     errorMessage.value.account = "ユーザー名は空白にできません";
    // } else if (editedAccount.length < 4 || editedAccount.length > 20) {
    //     errorMessage.value.account = "ユーザー名は4～20文字で入力してください";
    // } else {
    //     accountInValid = false;
    // }
    //密码格式校验
    // if (editedPassword === "") {
    //     errorMessage.value.password = "パスワードは空白にできません";
    // } else if (editedPassword.length < 8 || editedPassword.length > 32) {
    //     errorMessage.value.password = "パスワードは8～32文字で入力してください";
    // } else {
    //     passwordInValid = false;
    // }
    //格式不正确时获得焦点
    if (accountInValid) {
        accountBar.focus();
    } else if (passwordInValid) {
        passwordBar.focus();
        //账号密码正确时跳转
    } else if (editedAccount === savedAccount && editedPassword === savedPassword) {
        //保存登录状态
        try {
            sessionStorage.setItem("paidLeaveCurrentUser", JSON.stringify(userInfo));
        } catch (error) {
            accountBar.focus();
            errorMessage.value.password = "ログイン状態の保存に失敗しました";
            return;
        }
        router.push({ name: 'home' });
        //账号密码错误处理
    } else {
        errorMessage.value.password = "アカウントまたはパスワードが正しくありません";
        accountBar.value?.focus();
    }
}

//登录按钮
function login() {
    //点击后暂时禁用
    processing.value = true;
    startTimeCounter();
    //清除原有错误显示
    // errorMessage.value = {};
    //调用登陆函数
    loginCheck(accountInput.value, passwordInput.value);
}

async function submitForm() {
    //点击后暂时禁用
    processing.value = true;
    startTimeCounter();
    const { valid, errors } = await formRef.value.validate();
    if (!valid) {
        const firstError = errors[0];
        const input = inputRefs[firstError.id];

        input?.value?.focus();
    }
}
//跳转按钮
// function toHome () {
//     location.href = "index.html";
// }

</script>

<template>
    <v-form ref="formRef" @submit.prevent="submitForm" validate-on="blur" action="index.html" method="post" class="legacy-page">
        <v-btn block color="primary" type="button" id="home-button" :to="{ name: 'home' }">ホームへ</v-btn>
        
        <v-text-field label="アカウント" id="account" name="account" type="text" minlength="4" maxlength="20"
            autocomplete="username" required v-model="accountInput" :rules="accountRules" ref="accountBar" />
        <v-text-field label="パスワード" id="password" name="password" type="password" minlength="8" maxlength="32"
            autocomplete="off" required v-model="passwordInput" :rules="passwordRules" ref="passwordBar"
            validate-on="blur" />


        <v-btn block color="primary" type="submit" id="login-button" :disabled="processing">ログイン</v-btn>

        <RouterLink :to="{ name: 'register' }" class="link text-center d-block">アカウントをお持ちでない方</RouterLink>
    </v-form>
</template>

<style scoped></style>