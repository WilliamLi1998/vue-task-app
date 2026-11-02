<script setup>
import { useAuth } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  title:{ type:String, required: true }
})

const menuItems = [
    { title: 'ホーム', to: { name: 'home' } },
    { title: '休暇申請', to: { name: 'leave-apply' } },
    { title: '申請一覧', to: { name: 'application-list' } },
]

const auth = useAuth();
const router = useRouter();

async function logout() {
    const success = await auth.clearUserInfo();

    if (success) {
        router.replace({ name:'login' });
    }
}
</script>

<template>
    <v-app>
        <v-app-bar color="primary">
            <v-app-bar-title class="font-weight-bold">有給休暇申請システム</v-app-bar-title>
        </v-app-bar>
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
                <h1 class="text-h4">{{ title }}</h1>
                <slot></slot>
            </v-container>
        </v-main>
    </v-app>
</template>

<style scoped></style>