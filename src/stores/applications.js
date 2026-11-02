import { cancelApplication, getApplication, getApplicationList, getDashboard, submitApplication } from "@/api/applications";
import { toApiError } from "@/api/http";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useApplications = defineStore('application', () => {
    const dashboard = ref(null);
    const applicationDraft = ref(null);
    const leaveApplication = ref(null);
    const applicationList = ref([]);
    const filteredApplicationList = ref([]);
    const status = ref('');
    const submitting = ref(false);
    const processing = ref(false);
    const errorMessage = ref('');

    async function loadDashboard() {
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            controller.abort();
        }, 5000);

        try {
            dashboard.value = await getDashboard(controller.signal);
            return dashboard.value;
        } catch (error) {
            const apiError = toApiError(error);
            console.error(apiError);
        } finally {
            clearTimeout(timerId);
        }
    }

    async function handleApplication() {
        errorMessage.value = '';
        submitting.value = true;
        try {
            leaveApplication.value = await submitApplication(applicationDraft.value);
            applicationDraft.value = null;
        } catch (error) {
            const apiError = toApiError(error);
            errorMessage.value = apiError.message;
            console.error(apiError);

            throw error;
        } finally {
            submitting.value = false;
        }
    }

    async function loadApplicationList(params) {
        status.value = 'loading';
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            controller.abort();
        }, 5000);
        try {
            filteredApplicationList.value = await getApplicationList(params, controller.signal);
            applicationList.value = await getApplicationList({}, controller.signal);
            status.value = 'loaded';
        } catch (error) {
            status.value = 'failed';
            console.error(error);
            const apiError = toApiError(error);
            errorMessage.value = apiError.message;
            console.error(apiError);
        } finally {
            clearTimeout(timerId);
        }
    }

    async function loadApplication() {
        status.value = 'loading';
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            controller.abort();
        }, 5000);
        try {
            leaveApplication.value = await getApplication(controller.signal);
            status.value = 'loaded';
        } catch (error) {
            status.value = 'failed';
            const apiError = toApiError(error);
            errorMessage.value = apiError.message;
            console.error(apiError);
        } finally {
            clearTimeout(timerId);
        }
    }

    async function handleCancel(id) {
        processing.value = true;
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            controller.abort();
        }, 5000);
        try {
            await cancelApplication(id, controller.signal);
            // 更新 Pinia 中对应申请的状态
            const target = applicationList.value.find(
                item => item.id === id
            );
            if (target) {
                target.status = 'cancelled';
            }

            // 更新筛选后的列表（表格实际使用的数据）
            const filteredTarget = filteredApplicationList.value.find(
                item => item.id === id
            );

            if (filteredTarget) {
                filteredTarget.status = 'cancelled';
            }
        } catch (error) {
            const apiError = toApiError(error);
            errorMessage.value = apiError.message;
            console.error(apiError);
        } finally {
            clearTimeout(timerId);
            processing.value = false;
        }
    }

    async function reset() {
        dashboard.value = null;
        applicationDraft.value = null;
        leaveApplication.value = null;
        applicationList.value = [];
        filteredApplicationList.value = [];
        submitting.value = null;
        status.value = '';
        submitting.value = false;
        processing.value = false;
        errorMessage.value = '';
    }

    return {
        dashboard, applicationDraft, leaveApplication, applicationList, filteredApplicationList, status, submitting, processing,
        errorMessage, loadDashboard, loadApplication, loadApplicationList, handleApplication, handleCancel, reset
    };
})