<script setup>
import AuthLayout from "../components/layout/AuthLayout.vue";
import LoginForm from "../components/auth/LoginForm.vue";
import AppMessage from "@/components/common/AppMessage.vue";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { login } from "@/api/auth.js";
import { toApiError } from "@/api/http.js";
import { useAuth } from "@/stores/auth.js";

const route = useRoute();
const router = useRouter();

const auth = useAuth();

const processing = ref(false);

const formError = ref("");
const formRef = ref(null);

//存在登录状态时显示跳转按钮
const loginedIn = computed(() => !!auth.userInfo);

// 登录处理函数
async function handleLogin(formInput) {
    formError.value = "";
    processing.value = true;

    try {
        await login(formInput);
        await auth.loadUserInfo();
        //跳转主页或原页面
        const redirect = route.query.redirect;
        if (redirect) {
            router.replace(redirect);
        } else {
            router.push({ name: 'home' });
        }
    } catch (error) {
        formRef.value?.focusAccount();
        const apiError = toApiError(error);
        formError.value = apiError.message;
        console.error(error);
    } finally {
        processing.value = false;
    }
}
</script>

<template>
    <!-- 导入登入注册统一页面模板 -->
    <AuthLayout title="ログイン">
        <!-- 失败弹出错误信息 -->
        <AppMessage ref="appMessageRef" :form-error="formError"></AppMessage>
        <!-- 导入登录表单组件 -->
        <LoginForm ref="formRef" :loginedIn="loginedIn" :processing="processing"
            @submit="handleLogin" />
    </AuthLayout>
</template>

<style scoped></style>
