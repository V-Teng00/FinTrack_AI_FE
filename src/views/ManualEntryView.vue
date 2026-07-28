<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReceiptsStore } from '../stores/receipts'
import client from '../services/api'

const router = useRouter()
const store = useReceiptsStore()

// keep this in sync with ReceiptExtractionService::CATEGORIES in Laravel —
// duplicated intentionally, same pattern as the rest of this project
const CATEGORIES = [
  'Groceries', 'Food & Drink', 'Transport', 'Health',
  'Utilities', 'Shopping', 'Entertainment', 'Software & Subscriptions', 'Uncategorized',
]

const form = ref({
  store_name: '',
  date: new Date().toISOString().slice(0, 10),
  total: '',
  currency: 'MYR',
  category: 'Uncategorized',
})

const submitting = ref(false)
const error = ref('')

async function submit() {
  submitting.value = true
  error.value = ''
  try {
    const { data } = await client.post('/receipts/manual', form.value)
    store.receipts.unshift(data.data)
    router.push('/receipts')
  } catch (e) {
    error.value = e.response?.data?.message || 'Could not save this expense. Check the fields and try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div class="eyebrow">manual entry</div>
      <h1>Add an expense</h1>
      <p class="sub">No receipt to scan? Enter it directly.</p>
    </header>

    <form class="form receipt-card" @submit.prevent="submit">
      <label>
        <span class="field-label">Store / description</span>
        <input v-model="form.store_name" type="text" required placeholder="e.g. Grab ride" />
      </label>

      <div class="row">
        <label>
          <span class="field-label">Date</span>
          <input v-model="form.date" type="date" required :max="new Date().toISOString().slice(0,10)" />
        </label>

        <label>
          <span class="field-label">Category</span>
          <select v-model="form.category" required>
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
      </div>

      <div class="row">
        <label>
          <span class="field-label">Amount</span>
          <input v-model="form.total" type="number" step="0.01" min="0" required placeholder="0.00" />
        </label>

        <label>
          <span class="field-label">Currency</span>
          <select v-model="form.currency" required>
            <option value="MYR">MYR</option>
            <option value="USD">USD</option>
            <option value="SGD">SGD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button class="btn primary" type="submit" :disabled="submitting">
        {{ submitting ? 'Saving…' : 'Save expense' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.page {
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sub {
  color: var(--paper-ink-soft);
  font-size: 14px;
  margin-top: 10px;
}

.form {
  padding: 24px 24px 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.field-label {
  font-size: 12px;
  color: var(--paper-ink-soft);
  font-weight: 600;
}

.row {
  display: flex;
  gap: 14px;
}

input, select {
  border: 1px solid var(--paper-100);
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--paper-ink);
  background: #fff;
}

input:focus, select:focus {
  outline: 2px solid var(--brand-green-bright);
  outline-offset: 1px;
}

.error {
  color: var(--wax-red);
  font-size: 13px;
}

.btn {
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 12px 18px;
  border-radius: 3px;
  border: none;
}

.btn.primary {
  background: var(--brand-green);
  color: #fff;
}

.btn:disabled {
  opacity: 0.6;
}
</style>