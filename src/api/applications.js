import { httpClient } from './http.js'
import { useRoute } from 'vue-router';

export async function getDashboard(signal) {
    return (await httpClient.get('/dashboard', { signal })).data.data;
}

export async function submitApplication(input) {
    return (await httpClient.post('/leave-applications', input)).data.data;
}

export async function getApplication(signal) {
    const route = useRoute();
    const id = route.params.id;
    return (await httpClient.get(`/leave-applications/${id}`, { signal })).data.data;
}

export async function getApplicationList(params, signal) {
    return (await httpClient.get('/leave-applications', { params, signal })).data.data;
}

export async function cancelApplication(id, signal) {
    // const route = useRoute();
    // const id = route.params.id;
    return (await httpClient.patch(`/leave-applications/${id}/cancel`, { signal })).data.data;
}

