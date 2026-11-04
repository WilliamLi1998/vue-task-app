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
    // 加载首页汇总
    async function loadDashboard() {
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            controller.abort();
        }, 5000);

        try {
            // 调用首页汇总api
            dashboard.value = await getDashboard(controller.signal);
            return dashboard.value;
        } catch (error) {
            const apiError = toApiError(error);
            errorMessage.value = apiError.message;
            console.error(apiError);
        } finally {
            clearTimeout(timerId);
        }
    }
    // 提交申请
    async function handleApplication() {
        errorMessage.value = '';
        submitting.value = true;
        try {
            // 调用新增申请api
            leaveApplication.value = await submitApplication(applicationDraft.value);
            // 提交成功后清除草稿
            applicationDraft.value = null;
        } catch (error) {
            const apiError = toApiError(error);
            errorMessage.value = apiError.message;
            console.error(apiError);
            // 重新抛出错误给确认页面
            throw error;
        } finally {
            submitting.value = false;
        }
    }
    // 获取申请一览
    async function loadApplicationList(params = {}) {
        errorMessage.value = '';
        // 第一次加载成功后不改变状态
        if (status.value !== 'loaded') {
            status.value = 'loading';
        }     
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            controller.abort();
        }, 5000);
        try {
            // 调用申请一览api，获取带搜索条件申请
            filteredApplicationList.value = await getApplicationList(params, controller.signal);
            // 调用申请一览api，获取所有申请
            applicationList.value = await getApplicationList({}, controller.signal);
            status.value = 'loaded';
        } catch (error) {
            const apiError = toApiError(error);
            // 如果有错误详情则显示，否则显示基本错误信息
            errorMessage.value = apiError.details?.[0]?.message || apiError.message;
            console.error(apiError);
            // 第一次加载成功后不改变状态
            if (status.value !== 'loaded') {
                status.value = 'failed';
            }      
        } finally {
            clearTimeout(timerId);
        }
    }
    // 获取单独申请番号（完成页）
    async function loadApplication() {
        status.value = 'loading';
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            controller.abort();
        }, 5000);
        try {
            // 调用单独申请信息api
            leaveApplication.value = await getApplication(controller.signal);
            status.value = 'loaded';
        } catch (error) {
            // 没有对应申请则进入错误状态
            status.value = 'failed';
            const apiError = toApiError(error);
            errorMessage.value = apiError.message;
            console.error(apiError);
        } finally {
            clearTimeout(timerId);
        }
    }
    // 取消申请
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
            throw error;
        } finally {
            clearTimeout(timerId);
            processing.value = false;
        }
    }
    // 重置pinia状态
    async function reset() {
        dashboard.value = null;
        applicationDraft.value = null;
        leaveApplication.value = null;
        applicationList.value = [];
        filteredApplicationList.value = [];
        submitting.value = false;
        status.value = '';
        processing.value = false;
        errorMessage.value = '';
    }

    return {
        dashboard, applicationDraft, leaveApplication, applicationList, filteredApplicationList, status, submitting, processing,
        errorMessage, loadDashboard, loadApplication, loadApplicationList, handleApplication, handleCancel, reset
    };
})