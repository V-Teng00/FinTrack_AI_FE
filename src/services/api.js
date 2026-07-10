import axios from 'axios'

/**
 * API CONTRACT ASSUMPTIONS (implement these routes in Laravel):
 *
 *  POST   /api/receipts          multipart/form-data { image }
 *         -> { id, store_name, date, items: [{name, qty, price}], total, category, currency }
 *
 *  GET    /api/receipts?month=YYYY-MM
 *         -> [ { id, store_name, date, total, category, currency, thumbnail_url } ]
 *
 *  DELETE /api/receipts/:id
 *
 *  GET    /api/dashboard/summary?month=YYYY-MM
 *         -> { total_spending, income, savings, by_category: [{category, amount}],
 *              daily: [{date, amount}] }
 *
 *  POST   /api/chat              { message, month? }
 *         -> { reply, data?: { sql?, rows? } }   // data is optional grounding evidence
 *
 * Auth: assumes Sanctum/Bearer token stored after login; not implemented in this
 * frontend slice — add an Authorization header interceptor once auth exists.
 */

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 20000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const receiptsApi = {
  upload(file, onProgress) {
    const form = new FormData()
    form.append('image', file)
    return client.post('/receipts', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100))
      },
    })
  },
  list(month) {
    return client.get('/receipts', { params: { month } })
  },
  remove(id) {
    return client.delete(`/receipts/${id}`)
  },
}

export const dashboardApi = {
  summary(month) {
    return client.get('/dashboard/summary', { params: { month } })
  },
}

export const chatApi = {
  ask(message, month) {
    return client.post('/chat', { message, month })
  },
}

export default client
