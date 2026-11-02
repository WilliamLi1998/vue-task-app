<script setup>
import { useAuth } from '@/stores/auth';
import { useRouter } from 'vue-router';

defineProps({
  title:{ type:String, required: true }
})

const auth = useAuth();
const router = useRouter();
// 申请界面导航列表
const menuItems = [
    { title: 'ホーム', to: { name: 'home' } },
    { title: '休暇申請', to: { name: 'leave-apply' } },
    { title: '申請一覧', to: { name: 'application-list' } },
]
// 登出函数
async function logout() {
    const success = await auth.clearUserInfo();

    if (success) {
        router.replace({ name:'login' });
    }
}
</script>

<template>
    <v-app>
        <!-- 系统标题 -->
        <v-app-bar color="primary">
            <v-app-bar-title class="font-weight-bold">有給休暇申請システム</v-app-bar-title>
        </v-app-bar>
        <!-- 导航栏 -->
        <v-app-bar color="blue" elevation="0" :order="1">
            <v-container class="d-flex align-center justify-start ga-2 px-0 ml-4">
                <v-btn v-for="item in menuItems" :key="item.title" :to="item.to" variant="text" color="white">
                    {{ item.title }}
                </v-btn>
                <v-btn @click="logout" variant="text" color="white" >ログアウト</v-btn>
            </v-container>
        </v-app-bar>

        <v-main>
            <v-container class="py-6">
                <!-- 动态显示传入标题 -->
                <h1 class="text-h4">{{ title }}</h1>
                <slot></slot>
            </v-container>
        </v-main>
    </v-app>
</template>

<style scoped></style>