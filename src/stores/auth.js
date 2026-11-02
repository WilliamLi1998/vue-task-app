import { getCurrentUser, logout } from "@/api/auth";
import { toApiError } from "@/api/http";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useApplications } from "./applications";

export const useAuth = defineStore('auth', () => {
    const userInfo = ref(null);
    const initialized = ref(false);

    async function loadUserInfo() {
        const controller = new AbortController();
        const timerId = setTimeout(() => {
            controller.abort();
        }, 5000);

        try {
            userInfo.value = await getCurrentUser(controller.signal);

            return userInfo.value;
        } catch (error) {
            const apiError = toApiError(error);
            console.error(apiError);

            userInfo.value = null;           
        } finally {
            initialized.value = true;
            clearTimeout(timerId);
        }
    }

    async function clearUserInfo() {
        try {
            await logout();

            const application = useApplications();
            application.reset();

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