<script setup>
import AuthLayout from '../components/layout/AuthLayout.vue';
import RegisterForm from '../components/auth/RegisterForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const processing = ref(false);
const formError = ref("");
//计时器
let timeCounter;

function startTimeCounter() {
    clearInterval(timeCounter);//清空旧定时器
    //开始新定时器
    timeCounter = setTimeout(() => {
        processing.value = false;
    }, 2000);
}

//有效部门
const validDepartments = [
    { title: "系统开发部", value: "development" },
    { title: "品质管理部", value: "quality" },
    { title: "营业部", value: "sales" },
    { title: "总务部", value: "general-affairs" },
    { title: "人事部", value: "human-resources" }
];

function handleSubmit(formInput) {
    formError.value = "";

    //点击后暂时禁用
    processing.value = true;
    startTimeCounter();

    alert(`入力内容を確認しました アカウント：${accountInput.value.toLowerCase().trim()}、氏名：${nameInput.value.trim()}、所属：${ValidDepartments[departmentInput.value]}`);

    router.push({ name: 'login' });
}
</script>

<template>
  <AuthLayout title="アカウント登録">
    <RegisterForm :formError="formError" :validDepartments="validDepartments" :processing="processing" @submit="handleSubmit"></RegisterForm>
  </AuthLayout>
</template>

<style scoped></style>