<script setup>
import { useApplications } from '@/stores/applications.js';
import BusinessLayout from '../components/layout/BusinessLayout.vue';
import { calculateDateSpan } from '@/utils/date.js';
import { onMounted, ref } from 'vue';
import AppMessage from '@/components/common/AppMessage.vue';
import { useRouter } from 'vue-router';
import ApplicationSummary from '@/components/applications/ApplicationSummary.vue';

const router = useRouter();
const applications = useApplications();
//计算申请天数
const paidLeaveDays = ref(0);
if (applications.applicationDraft.leaveType === "half-am" || applications.applicationDraft.leaveType === "half-pm") {
    paidLeaveDays.value = 0.5;
} else {
    paidLeaveDays.value = calculateDateSpan(applications.applicationDraft.startDate, applications.applicationDraft.endDate);
}
//提出申请表单
async function handleSubmit() {
    try {
        //调用新增申请API
        await applications.handleApplication();
        //成功后跳转完成界面
        router.replace({
            name: 'leave-complete',
            params: { id: applications.leaveApplication.id },
        })
    } catch (error) {
        //API报错跳回申请界面
        router.replace({ name: 'leave-apply' });
    }
}
//进入页面时清除别处错误信息
onMounted(() => {
    applications.errorMessage = '';
});

const buttonStyle = {
    block: true,
    color: "primary",
    size: "x-large",
    class: "my-4",
};

const whiteButtonStyle = {
    block: true,
    color: "white",
    size: "x-large",
    class: "my-4",
};
</script>

<template>
    <BusinessLayout title="申請内容確認">
        <AppMessage ref="appMessageRef" :form-error="applications.errorMessage" />
        <!-- 申请信息确认表显示草稿 -->
        <ApplicationSummary :paidLeaveDays="paidLeaveDays" :applicationDraft="applications.applicationDraft" />
        <v-container>
            <v-row>
                <v-col cols="12" md="6">
                    <!-- 修正按钮跳回申请页 -->
                    <v-btn v-bind="whiteButtonStyle" type="button" :to="{ name: 'leave-apply' }">修正する</v-btn>
                </v-col>
                <v-col cols="12" md="6">
                    <!-- 提交申请按钮 -->
                    <v-btn v-bind="buttonStyle" type="button" @click="handleSubmit()"
                        :disabled="applications.submitting">申請する</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </BusinessLayout>
</template>

<style scoped></style>