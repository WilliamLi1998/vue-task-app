<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useApplications } from "@/stores/applications.js";
import BusinessLayout from "../components/layout/BusinessLayout.vue";
import AppMessage from "@/components/common/AppMessage.vue";
import LoadingIndicator from "@/components/common/LoadingIndicator.vue";
import ApplicationSearch from "@/components/applications/ApplicationSearch.vue";
import ApplicationTable from "@/components/applications/ApplicationTable.vue";

const applications = useApplications();
// 搜索条件对象
const params = ref({
    status: '',
    keyword: '',
})
// 加载一览表函数
async function handleLoadList() {
    try {
        // 当无对应条件时，去除params的属性
        const searchParams = { ...params.value };
        if (!searchParams.status) {
            delete searchParams.status;
        }
        if (!searchParams.keyword) {
            delete searchParams.keyword;
        }
        //调用pinia一览表函数
        await applications.loadApplicationList(searchParams);
    } catch (error) {
        console.error('申請一覧の取得に失敗しました', error);
    }
}
//自动加载一览表
onMounted(() => {
    applications.errorMessage = '';
    handleLoadList();
});
//离开时清除错误信息
onUnmounted(() => {
    applications.errorMessage = '';
});
// 控制弹窗开关
const dialog = ref(false);
// 删除的申请的ID
const selectedApplicationId = ref(null);

// 打开确认弹窗
function tryCancel(id) {
    selectedApplicationId.value = id;
    dialog.value = true;
}
// 确认取消，开始取消函数
async function confirmCancel() {
    // 清除前次错误信息
    applications.errorMessage = '';
    try {
        // 调用取消申请pinia
        await applications.handleCancel(selectedApplicationId.value);
        // 关闭弹窗
        dialog.value = false;
    } catch (error) {
        // 删除失败弹窗报错
        alert(applications.errorMessage);
        console.error('キャンセルできませんでした', error);
    }
}
// 申请一览表表头
const headers = [
    { title: '受付番号', key: 'receiptNumber' },
    { title: '休暇種別', key: 'leaveType' },
    { title: '休暇期間', key: 'leavePeriod' },
    { title: '申請日数', key: 'leaveDays' },
    { title: '状態', key: 'status' },
]

// const allSelected = computed({
//     get() {
//         return selectedStatuses.value.length === applicationStatus.length;
//     },
//     set(checked) {
//         selectedStatuses.value = checked
//             ? applicationStatus.map(status => status.value)
//             : []
//     },
// });
</script>

<template>
    <BusinessLayout title="申請一覧">
        <!-- <div class="d-flex flex-nowrap align-center">
            <v-label>申請状態</v-label>
            <v-checkbox v-model="allSelected" label="全選択" hide-details class="mr-4" />
            <v-checkbox v-for="status in applicationStatus" :key="status.value" :label="status.title"
                v-model="selectedStatuses" :value="status.value" hide-details class="mr-4" />
        </div> -->
        <!-- 导入搜索组件 -->
        <ApplicationSearch v-model="params" @search="handleLoadList()" />
        <!-- 加载中显示加载文字组件 -->
        <template v-if="applications.status === 'loading'">
            <LoadingIndicator />
        </template>
        <!-- 失败弹出错误信息 -->
        <template v-else-if="applications.status === 'failed'">
            <AppMessage ref="appMessageRef" :form-error="applications.errorMessage"></AppMessage>
        </template>
        <!-- 无申请提示信息 -->
        <template v-else-if="applications.status === 'loaded' && applications.applicationList.length === 0">
            <p class="text-h2">申請はありません。</p>
        </template>
        <!-- 有申请但不符合筛选条件提示信息 -->
        <template
            v-else-if="applications.status === 'loaded' && applications.applicationList.length !== 0 && applications.filteredApplicationList.length === 0">
            <p class="text-h2">検索条件に一致する申請はありません。</p>
        </template>
        <!-- 有符合条件申请，调用一览表组件 -->
        <template v-else-if="applications.status === 'loaded' && applications.filteredApplicationList.length !== 0">
            <ApplicationTable :headers="headers" :filteredApplicationList="applications.filteredApplicationList"
                @cancel="tryCancel" />
        </template>
        <!-- 取消确认弹窗 -->
        <v-dialog v-model="dialog" max-width="450">
            <v-card>
                <v-card-title>申請取消の確認</v-card-title>
                <!-- 弹窗标题 -->
                <v-card-text>この申請を取り消してもよろしいですか？<br>取り消した申請は元に戻せません。</v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <!-- 放弃返回按钮 -->
                    <v-btn variant="text" @click="dialog = false" :disabled="applications.processing">戻る</v-btn>
                    <!-- 确认取消按钮 -->
                    <v-btn color="error" variant="flat" :loading="applications.processing"
                        :disabled="applications.processing" @click="confirmCancel">
                        取消する
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </BusinessLayout>
</template>

<style scoped></style>
