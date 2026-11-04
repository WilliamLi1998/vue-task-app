<script setup>
import { useApplications } from '@/stores/applications.js';
import BusinessLayout from '../components/layout/BusinessLayout.vue';
import AppMessage from '@/components/common/AppMessage.vue';
import { onMounted, onUnmounted } from 'vue';
import LoadingIndicator from '@/components/common/LoadingIndicator.vue';

const applications = useApplications();

// 进入时清除原有错误信息，加载成功申请信息
onMounted(async () => {
    applications.errorMessage = '';
    await applications.loadApplication();
});
// 退出后清除错误信息
onUnmounted(() => {
    applications.errorMessage = '';
});
// 按钮卡片样式
const buttonStyle = {
    block: true,
    color: 'primary',
    size: 'x-large',
    class: 'my-4',
}
const whiteCard = {
    class: "pa-8",
};
</script>
<template>
    <BusinessLayout title="申請完了">
        <!-- 加载中显示加载文字组件 -->
        <template v-if="applications.status === 'loading'">
            <LoadingIndicator />
        </template>
        <!-- 失败弹出错误信息 -->
        <template v-else-if="applications.status === 'failed'">
            <AppMessage ref="appMessageRef" :form-error="applications.errorMessage"></AppMessage>
        </template>
        <!-- 加载成功后，显示番号界面 -->
        <v-card v-else-if="applications.status === 'loaded'" v-bind="whiteCard">
            <v-card-title class="text-h1 text-center font-weight-bold">申請が完了しました</v-card-title>
            <p class="text-h2 text-break">受付番号：
                <strong class="text-primary">{{ applications.leaveApplication.receiptNumber }}</strong>
            </p>
        </v-card>
        <v-container fluid class="px-0">
            <v-row>
                <v-col cols="12" md="6">
                    <!-- 跳转主页按钮 -->
                    <v-btn v-bind="buttonStyle" variant="tonal" :to="{ name: 'home' }">ホームページへ</v-btn>
                </v-col>
                <v-col cols="12" md="6">
                    <!-- 跳转申请一览按钮 -->
                    <v-btn v-bind="buttonStyle" :to="{ name: 'application-list' }">申請一覧へ</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </BusinessLayout>
</template>

<style scoped></style>