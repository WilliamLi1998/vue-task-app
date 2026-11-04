import { httpClient } from './http.js'
import { useRoute } from 'vue-router';
// 获取首页一览
export async function getDashboard(signal) {
    return (await httpClient.get('/dashboard', { signal })).data.data;
}
// 新增申请
export async function submitApplication(input) {
    return (await httpClient.post('/leave-applications', input)).data.data;
}
// 获取单条申请信息
export async function getApplication(signal) {
    const route = useRoute();
    const id = route.params.id;
    return (await httpClient.get(`/leave-applications/${id}`, { signal })).data.data;
}
// 获取申请一览
export async function getApplicationList(params, signal) {
    return (await httpClient.get('/leave-applications', { params, signal })).data.data;
}
// 取消申请
export async function cancelApplication(id, signal) {
    // const route = useRoute();
    // const id = route.params.id;
    return (await httpClient.patch(`/leave-applications/${id}/cancel`, { signal })).data.data;
}

