<script setup>
import AuthLayout from '../components/layout/AuthLayout.vue';
import RegisterForm from '../components/auth/RegisterForm.vue';
import AppMessage from '@/components/common/AppMessage.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getDepartments, login, registerUser } from '@/api/auth.js';
import { toApiError } from '@/api/http.js';
import { useAuth } from "@/stores/auth.js";


const router = useRouter();

const processing = ref(false);
const loadingDepartments = ref(false);
const auth = useAuth();


const formRef = ref(null);
const formError = ref('');

//有效部门数组
const validDepartments = ref([]);

async function loadDepartments() {
    loadingDepartments.value = true;
    formError.value = '';
    // 取消signal与定时器
    const controller = new AbortController();
    const timerId = setTimeout(() => {
        controller.abort();
    }, 5000);

    //调用api读取部门
    try {
        validDepartments.value = await getDepartments(controller.signal);
    } catch (error) {
        //调用处理函数，显示错误信息
        const apiError = toApiError(error);
        formError.value = apiError.message;
        console.error(apiError);
    } finally {
        //读取结束后清理
        loadingDepartments.value = false;
        clearTimeout(timerId);
    }
}
// 进入后自动调用pinia加载部门
onMounted(() => {
    loadDepartments();
});

async function handleSubmit(formInput) {
    formError.value = "";
    processing.value = true;

    try {
        let registerResponse = await registerUser(formInput);
        //输入信息弹窗
        alert(`入力内容を確認しました 社員番号：${registerResponse.employeeNumber}、アカウント：${registerResponse.account}、氏名：${registerResponse.name}、所属：${validDepartments.value.find(validDepartment => validDepartment.value === registerResponse.department).label}`);
        //跳转登陆页面
        await login({ account: formInput.account, password: formInput.password });
        await auth.loadUserInfo();
        router.push({ name: 'home' });
    } catch (error) {
        formRef.value?.focusAccount();
        const apiError = toApiError(error);
        formError.value = apiError.message;
    } finally {
        processing.value = false;
    }
}
</script>

<template>
    <!-- 导入登入注册统一页面模板 -->
    <AuthLayout title="アカウント登録">
        <!-- 失败弹出错误信息 -->
        <AppMessage ref="appMessageRef" :form-error="formError" />
        <!-- 导入注册表单组件 -->
        <RegisterForm ref="formRef" :validDepartments="validDepartments" :processing="processing"
            :loadingDepartments="loadingDepartments" @submit="handleSubmit" />
    </AuthLayout>
</template>

<style scoped></style>