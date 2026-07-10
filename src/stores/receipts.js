import { defineStore } from 'pinia'
import { receiptsApi, dashboardApi } from '../services/api'
import { USE_MOCK, mockReceipts, mockSummary } from '../services/mockData'

function currentMonth() {
  return new Date().toISOString().slice(0, 7) // YYYY-MM
}

export const useReceiptsStore = defineStore('receipts', {
  state: () => ({
    month: currentMonth(),
    receipts: [],
    summary: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchReceipts() {
      this.loading = true
      this.error = null
      try {
        if (USE_MOCK) {
          this.receipts = mockReceipts
        } else {
          const { data } = await receiptsApi.list(this.month)
          this.receipts = data
        }
      } catch (e) {
        this.error = 'Could not load receipts. Is the backend running?'
      } finally {
        this.loading = false
      }
    },

    async fetchSummary() {
      this.loading = true
      this.error = null
      try {
        if (USE_MOCK) {
          this.summary = mockSummary
        } else {
          const { data } = await dashboardApi.summary(this.month)
          this.summary = data
        }
      } catch (e) {
        this.error = 'Could not load dashboard summary. Is the backend running?'
      } finally {
        this.loading = false
      }
    },

    async uploadReceipt(file, onProgress) {
      if (USE_MOCK) {
        // simulate latency + extraction result in mock mode
        await new Promise((r) => setTimeout(r, 900))
        const fake = {
          id: Date.now(),
          store_name: 'Sample Store',
          date: currentMonth() + '-10',
          total: 15.9,
          category: 'Groceries',
          currency: 'MYR',
          thumbnail_url: null,
        }
        this.receipts.unshift(fake)
        return fake
      }
      const { data } = await receiptsApi.upload(file, onProgress)
      this.receipts.unshift(data)
      return data
    },

    async deleteReceipt(id) {
      if (!USE_MOCK) await receiptsApi.remove(id)
      this.receipts = this.receipts.filter((r) => r.id !== id)
    },
  },
})
