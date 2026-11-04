import { httpClient } from './http.js'
// 获取当前登录用户信息
export async function getCurrentUser(signal) {
  return (await httpClient.get('/auth/me', { signal })).data.data;
}
// 登录
export async function login(input) {
  return (await httpClient.post('/auth/login', input)).data.data;
}
// 登出
export async function logout() {
  await httpClient.post('/auth/logout');
}
// 获取可注册部门一览
export async function getDepartments(signal) {
  return (await httpClient.get('/master/departments', { signal })).data.data;
}
// 注册
export async function registerUser(input) {
  return (await httpClient.post('/users', input)).data.data;
}