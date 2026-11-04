<script setup>
import { useRouter } from "vue-router";
import BusinessLayout from "../components/layout/BusinessLayout.vue";
import LeaveForm from "@/components/applications/LeaveForm.vue";
import { useApplications } from "@/stores/applications.js";
import { onMounted, onUnmounted, ref } from "vue";
import AppMessage from "@/components/common/AppMessage.vue";

const router = useRouter();

const applications = useApplications();

const processing = ref(false);

const formRef = ref(null);
// 草稿对象
const applicationDraft = ref({
    "leaveType": "",
    "startDate": "",
    "endDate": "",
    "reason": "",
    "handoverStatus": "",
    "note": "",
});

// 如果有草稿，回复填写状态
onMounted(() => {
    if (applications.applicationDraft) {
        applicationDraft.value = applications.applicationDraft;
    }
})
// 离开时清除错误信息
onUnmounted(() => {
    applications.errorMessage = '';
});

function submitApplicationDraft() {
    processing.value = true;
    try {      
        // 保存草稿
        applications.applicationDraft = applicationDraft.value;
        // 跳转错误界面
        router.push({ name: 'leave-confirm' });
    } catch (error) {
        console.error(error);
    } finally {
        processing.value = false;
    }
}
</script>

<template>
	<BusinessLayout title="休暇申請">
        <!-- 失败弹出错误信息 -->
        <AppMessage ref="appMessageRef" :form-error="applications.errorMessage" />
        <!-- 申请页面，导入申请表单 -->
		<LeaveForm ref="formRef" @submit="submitApplicationDraft" :processing="processing" v-model="applicationDraft"/>
	</BusinessLayout>
</template>

<style scoped></style>
