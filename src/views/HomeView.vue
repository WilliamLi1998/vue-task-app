<script setup>
import { useAuth } from "@/stores/auth.js";
import BusinessLayout from "../components/layout/BusinessLayout.vue";
import { ref } from "vue";
import { onMounted, onUnmounted } from "vue";
import { formatDate } from "@/utils/date.js";
import AppMessage from '@/components/common/AppMessage.vue';
import { useApplications } from "@/stores/applications.js";

const applications = useApplications();
const auth = useAuth();
// 获取基准日
const currentDate = formatDate(new Date());
// 汇总信息对象
const dashboard = ref({
    "employeeNumber": "",
    "name": "",
    "department": "",
    "departmentName": "",
    "remainingPaidLeaveDays": 0,
    "pendingCount": 0,
    "approvedDaysThisMonth": 0,
});
// 加载汇总信息函数
async function handleDashboard() {
    applications.errorMessage = '';
    //调用pinia读取汇总表
    try {
        dashboard.value = await applications.loadDashboard();
    } catch (error) {
        //调用处理函数，显示错误信息
        console.error('申請まとめの取得に失敗しました', error);
    }
}

//进入时加载汇总信息
onMounted(() => {
    handleDashboard();
});
// 离开时清除错误信息
onUnmounted(() => {
    applications.errorMessage = '';
});

// 汇总卡片样式
const blueCard = {
    class: "pa-4",
    color: "primary",
    variant: "tonal",
};
const blueTitle = {
    class: ["text-wrap", "px-0"],
};
const blueNumber = {
    class: ["text-primary", "font-weight-bold"],
};

const whiteCard = {
    class: "pa-8",
};
</script>

<template>
    <BusinessLayout title="ホーム">
        <AppMessage ref="appMessageRef" :form-error="applications.errorMessage"></AppMessage>
        <!-- 显示基准日 -->
        <div>
            <p class="text-right">{{ '基準日：' + currentDate }}</p>
        </div>
        <!-- 上方卡片 -->
        <v-card title="社員情報" v-bind="whiteCard">
            <v-container>
                <v-row>
                    <!-- 上左登录社员信息 -->
                    <v-col cols="12" md="4">
                        <v-list>
                            <v-list-item title="社員番号">{{ auth.userInfo.employeeNumber }}</v-list-item>
                            <v-list-item title="氏名">{{ auth.userInfo.name }}</v-list-item>
                            <v-list-item title="所属">{{ auth.userInfo.departmentName }}</v-list-item>
                        </v-list>
                    </v-col>
                    <!-- 上右汇总空间 -->
                    <v-col cols="12" md="8">
                        <v-container class="text-center">
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-card v-bind="blueCard">
                                        <v-card-title v-bind="blueTitle">有給残日数</v-card-title>
                                        <p v-bind="blueNumber">{{ dashboard.remainingPaidLeaveDays }}</p>
                                        <p>日</p>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card v-bind="blueCard">
                                        <v-card-title v-bind="blueTitle">申請中</v-card-title>
                                        <p v-bind="blueNumber">{{ dashboard.pendingCount }}</p>
                                        <p>件</p>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-card v-bind="blueCard">
                                        <v-card-title v-bind="blueTitle">当月承認済</v-card-title>
                                        <p v-bind="blueNumber">{{ dashboard.approvedDaysThisMonth }}</p>
                                        <p>日</p>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <!-- 中部卡片响应式布局 -->
        <v-container class="px-0">
            <v-row>
                <v-col cols="12" md="6">
                    <v-card :to="{ name: 'leave-apply' }" hover title="休暇を申請する" text="新しい休暇申請を入力します"
                        v-bind="whiteCard" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-card :to="{ name: 'leave-confirm' }" hover title="申請一覧を確認する" text="申請状況を検索・確認します"
                        v-bind="whiteCard" />
                </v-col>
            </v-row>
        </v-container>
        <!-- 下方卡片 -->
        <v-card title="注意事項" v-bind="whiteCard">
            <v-list>
                <v-list-item title="原則として、3営業日前までに申請してください。" />
                <v-list-item title="緊急の場合は、直属の上司に連絡してください。" />
            </v-list>
        </v-card>
    </BusinessLayout>
</template>

<style scoped></style>
