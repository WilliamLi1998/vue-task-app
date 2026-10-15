import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true
})

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