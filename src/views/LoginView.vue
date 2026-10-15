<script setup>
import AuthLayout from "../components/layout/AuthLayout.vue";
import LoginForm from "../components/auth/LoginForm.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const processing = ref(false);
//计时器
let timeCounter;

function startTimeCounter() {
	clearInterval(timeCounter); //清空旧定时器
	//开始新定时器
	timeCounter = setTimeout(() => {
		processing.value = false;
	}, 1000);
}
//正确账号密码
const savedAccount = "training.user";
const savedPassword = "training123";

const loginedIn = ref(false);

const formError = ref("");
const formRef = ref(null);

//正确用户信息
const userInfo = {
	employeeNumber: "EMP-00001",
	name: "山田 太郎",
	department: "development",
};

//检查用户信息格式，正确后显示直接跳转按钮 待改
const currentUserInfo = JSON.parse(sessionStorage.getItem("paidLeaveCurrentUser"));
if (
	currentUserInfo &&
	currentUserInfo.employeeNumber &&
	currentUserInfo.name &&
	currentUserInfo.department
) {
	loginedIn.value = true;
}

function handleSubmit(formInput) {
	formError.value = "";

    //点击后暂时禁用
	processing.value = true;
	startTimeCounter();

	if (formInput.account === savedAccount && formInput.password === savedPassword) {
		//保存登录状态
		try {
			sessionStorage.setItem("paidLeaveCurrentUser", JSON.stringify(userInfo));
		} catch (error) {
			formRef.value?.focusAccount();
			formError.value = "ログイン状態の保存に失敗しました";
			return;
		}
		router.push({ name: "home" });
		//账号密码错误处理
	} else {
		formError.value = "アカウントまたはパスワードが正しくありません";
		formRef.value?.focusAccount();
	}
}
</script>

<template>
	<AuthLayout title="ログイン">
		<LoginForm
			ref="formRef"
			:formError="formError"
			:loginedIn="loginedIn"
			@submit="handleSubmit"
		></LoginForm>
	</AuthLayout>
</template>

<style scoped></style>
