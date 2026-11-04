import axios from 'axios'
// api服务器基本配置
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1_0000,
  withCredentials: true
})
// api统一错误信息
export function toApiError(error) {
  if (!error.response) {
    return {
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'サーバーに接続できませんでした',
      details: []
    }
  }

  return {
    status: error.response.status,
    code: error.response.data?.error?.code ?? 'UNKNOWN_ERROR',
    message: error.response.data?.error?.message ?? '処理に失敗しました',
    details: error.response.data?.error?.details ?? []
  }
}

