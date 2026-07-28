<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReceiptsStore } from '../stores/receipts'

const router = useRouter()
const store = useReceiptsStore()

const form = ref({
  month: store.month,
  source: '',
  amount: '',
  notes: '',
})

const submitting = ref(false)
const error = ref('')

function goBack() {
  router.back()
}

async function submit() {
  if (!form.value.source || !form.value.amount || Number(form.value.amount) < 0) {
    error.value = 'Enter a source and a valid amount.'
    return
  }
  submitting.value = true
  error.value = ''
  try {
    store.month = form.value.month
    await store.addIncome(form.value.source, Number(form.value.amount), form.value.notes || null)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Could not save. Check the fields and try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page">
    <button class="back-btn" @click="goBack">‹ Back</button>
    <header class="page-head">
      <div class="eyebrow">add income</div>
      <h1>Record income</h1>
      <p class="sub">Salary, part-time work, or any other income source.</p>
    </header>

    <form class="form receipt-card" @submit.prevent="submit">
      <label>
        <span class="field-label">Month</span>
        <input v-model="form.month" type="month" required />
      </label>

      <label>
        <span class="field-label">Source</span>
        <input v-model="form.source" type="text" required placeholder="e.g. Salary, Part-time job" />
      </label>

      <label>
        <span class="field-label">Amount (MYR)</span>
        <input v-model="form.amount" type="number" step="0.01" min="0" required placeholder="0.00" />
      </label>

      <label>
        <span class="field-label">Notes (optional)</span>
        <textarea v-model="form.notes" rows="3" placeholder="Any extra detail…"></textarea>
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button class="btn primary" type="submit" :disabled="submitting">
        {{ submitting ? 'Saving…' : 'Save income' }}
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

.back-btn {
  align-self: flex-start;
  background: none;
  border: none;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--paper-ink-soft);
  padding: 0;
  cursor: pointer;
}

.back-btn:hover {
  color: var(--brand-green-bright);
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
}

.field-label {
  font-size: 12px;
  color: var(--paper-ink-soft);
  font-weight: 600;
}

input, textarea {
  border: 1px solid var(--paper-100);
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--paper-ink);
  background: #fff;
}

input:focus, textarea:focus {
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