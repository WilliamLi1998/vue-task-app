import { getCurrentUser, logout } from "@/api/auth";
import { toApiError } from "@/api/http";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useApplications } from "./applications";

export const useAuth = defineStore('auth', () => {
    const userInfo = ref(null);
    const initialized = ref(false);
    // 恢复登录状态
    async function loadUserInfo() {
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            controller.abort();
        }, 5000);

        try {
            // 调用登录信息api
            userInfo.value = await getCurrentUser(controller.signal);
            return userInfo.value;
        } catch (error) {
            const apiError = toApiError(error);
            console.error(apiError);
            // 异常时清空登录状态
            userInfo.value = null;           
        } finally {
            // 初始化完成
            initialized.value = true;
            clearTimeout(timerId);
        }
    }
    // 登出函数
    async function clearUserInfo() {
        try {
            // 调用登出api
            await logout();
            // 清空业务状态
            const application = useApplications();
            application.reset();
            // 成功时清空用户信息
            userInfo.value = null;
            initialized.value = true;

            return true;
        } catch (error) {
            const apiError = toApiError(error);
            console.error(apiError);

            alert(apiError.message);
            return false;
        }
    }

    return { userInfo, initialized, loadUserInfo, clearUserInfo }
})