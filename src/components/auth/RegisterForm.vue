<script setup>
import { ref } from 'vue';
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
const accountInput = ref('');
const passwordInput = ref('');
const passwordCheckInput = ref('');
const nameInput = ref('');
const departmentInput = ref('');

const accountBar = ref(null);
const passwordBar = ref(null);
const passwordCheckBar = ref(null);
const nameBar = ref(null);
const departmentBar = ref(null);

const errorMessage = ref({});

// const registerButton = document.getElementById("register-button");
// const homeButton = document.getElementById("home-button");
// const registerSuccess = document.getElementById("register-success")
// const registerConfirm = document.getElementById("register-confirm")
//账号格式
const accountPattern = /^[a-z0-9._-]{4,20}$/;

// const ValidDepartments = {
//     development: "系统开发部",
//     quality: "品质管理部",
//     sales: "营业部",
//     "general-affairs": "总务部",
//     "human-resources": "人事部"
// };
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
        const editedAccount = value?.toString().toLowerCase().trim();

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
        if (value !== passwordInput.value) return "パスワードは8～32文字で入力してください";

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

function registerCheck(account, password, passwordCheck, name, department) {
    //处理账号密码格式
    let editedAccount = account.toString().toLowerCase().trim();
    let editedPassword = password.toString();
    let editedPasswordCheck = passwordCheck.toString();
    let editedName = name.toString().trim();
    //正确错误状态
    // let accountInValid = true;
    // let passwordInValid = true;
    // let passwordCheckInValid = true;
    // let nameInValid = true;
    // let departmentInValid = true;

    //账号格式校验
    if (!editedAccount) {
        errorMessage.value.account = "ユーザー名は空白にできません";
    } else if (editedAccount.length < 4 || editedAccount.length > 20) {
        errorMessage.value.account = "ユーザー名は4～20文字で入力してください";
    } else if (!accountPattern.test(editedAccount)) {
        errorMessage.value.account = "ユーザー名を正しい形式で入力してください";
    } else {
        accountInValid = false;
    }
    //密码格式校验
    if (!editedPassword) {
        errorMessage.value.password = "パスワードは空白にできません";
    } else if (editedPassword.length < 8 || editedPassword.length > 32) {
        errorMessage.value.password = "パスワードは8～32文字で入力してください";
    } else {
        passwordInValid = false;
    }
    //确认密码是否一致
    if (!editedPasswordCheck) {
        errorMessage.value.passwordCheck = "パスワードは空白にできません";
    } else if (editedPassword !== editedPasswordCheck) {
        errorMessage.value.passwordCheck = "確認用パスワードが一致しません";
    } else {
        passwordCheckInValid = false;
    }
    //名字格式校验
    if (!editedName) {
        errorMessage.value.name = "氏名は空白にできません";
    } else if (editedName.length < 2 || editedName.length > 40) {
        errorMessage.value.name = "氏名は2～40文字で入力してください";
    } else {
        nameInValid = false;
    }
    //部门输入校验
    if (department === "") {
        errorMessage.value.department = "部署を選択してください";
    } else if (!department || !Object.keys(ValidDepartments).includes(department)) {
        errorMessage.value.department = "正しい部署を選択してください";
    } else {
        departmentInValid = false;
    }

    //格式不正确时获得焦点
    if (accountInValid) {
        accountBar.value?.focus();
    } else if (passwordInValid) {
        passwordBar.value?.focus();
    } else if (passwordCheckInValid) {
        passwordCheckBar.value?.focus();
    } else if (nameInValid) {
        nameBar.value?.focus();
    } else if (departmentInValid) {
        departmentBar.value?.focus();
        //输入无误后成功
    } else {
        passwordInput.value = "";
        passwordCheckInput.value = "";
        alert(`入力内容を確認しました アカウント：${editedAccount}、氏名：${editedName}、所属：${ValidDepartments[department]}`);
        router.push({ name: 'login' });
    }
}
//注册按钮
function register() {
    processing.value = true;
    startTimeCounter();
    //清除原有错误显示
    // errorMessage.value = {};
    //调用登陆函数
    registerCheck(accountInput.value, passwordInput.value, passwordCheckInput.value, nameInput.value, departmentInput.value);
}

</script>

<template>
    <v-form ref="formRef" @submit.prevent="submitForm" action="login.html" method="post" class="legacy-page">
        <p>
            <!-- <label for="account">アカウント <span>必須</span></label> -->
            <v-text-field id="account" name="account" minlength="4" maxlength="20" pattern="[a-z0-9._\-]{4,20}"
                title="半角英小文字、数字、「._-」のみ使用できます" required autocomplete="none" label="アカウント" v-model="accountInput"
                ref="accountBar" />
            半角英小文字、数字、「._-」のみ使用できます
        </p>
        <!-- <p id="accountError" class="error-message">{{ errorMessage.account }}</p> -->

        <p>
            <!-- <label for="password">パスワード <span>必須</span></label> -->
            <v-text-field id="password" name="password" type="password" minlength="8" maxlength="32" autocomplete="none"
                required label="パスワード" v-model="passwordInput" ref="passwordBar" />
        </p>
        <!-- <p id="passwordError" class="error-message">{{ errorMessage.password }}</p> -->

        <p>
            <!-- <label for="password-check">パスワード (確認) <span>必須</span></label> -->
            <v-text-field id="password-check" name="password-check" type="password" minlength="8" maxlength="32"
                required label="パスワード (確認)" v-model="passwordCheckInput" ref="passwordCheckBar" />
        </p>
        <!-- <p id="passwordCheckError" class="error-message">{{ errorMessage.passwordCheck }}</p> -->

        <p>
            <!-- <label for="name">氏名 <span>必須</span></label> -->
            <v-text-field id="name" name="name" minlength="2" maxlength="40" autocomplete="none" required label="氏名"
                v-model="nameInput" ref="nameBar" />
        </p>
        <!-- <p id="nameError" class="error-message">{{ errorMessage.name }}</p> -->

        <p>
            <!-- <label for="no">社員番号 </label> -->
            <v-text-field id="no" name="no" disabled label="社員番号" /> *社員番号は登録完了時に自動採番されます
        </p>

        <p>
            <!-- <label for="department">所属 <span>必須</span></label> -->
            <v-select id="department" name="department" autocomplete="none" required v-model="departmentInput"
                ref="departmentBar" :items="ValidDepartments" label="所属" placeholder="お選びください"/>
        </p>
        <!-- <p id="departmentError" class="error-message">{{ errorMessage.department }}</p> -->

        <v-btn block color="primary" type="submit" id="register-button" :disabled="processing">登録する</v-btn>
        <!-- <p id="register-success" class="success-message"></p>
        <p id="register-confirm" class="success-message"></p> -->

        <RouterLink :to="{ name: 'login' }" class="link text-center d-block">ログインページへ</RouterLink>
    </v-form>
</template>

<style scoped></style>