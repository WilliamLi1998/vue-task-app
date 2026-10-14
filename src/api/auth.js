import { httpClient } from './http.js'

export async function getCurrentUser(signal) {
  return (await httpClient.get('/auth/me', { signal })).data.data;
}

export async function login(input) {
  return (await httpClient.post('/auth/login', input)).data.data;
}

export async function logout() {
  await httpClient.post('/auth/logout');
}

export async function getDepartments(signal) {
  return (await httpClient.get('/master/departments', { signal })).data.data;
}

export async function registerUser(input) {
  return (await httpClient.post('/users', input)).data.data;
}