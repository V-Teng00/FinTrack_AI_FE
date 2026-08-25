<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import client from '../services/api'

const router = useRouter()
const CATEGORIES = [
  'Groceries', 'Food & Drink', 'Transport', 'Health',
  'Utilities', 'Shopping', 'Entertainment', 'Software & Subscriptions', 'Uncategorized',
]

const goals = ref([])
const category = ref(CATEGORIES[0])
const amount = ref('')
const saving = ref(false)

async function load() {
  const { data } = await client.get('/goals')
  goals.value = data.data
}

async function save() {
  if (!amount.value || Number(amount.value) < 0) return
  saving.value = true
  try {
    await client.post('/goals', { category: category.value, monthly_limit: Number(amount.value) })
    amount.value = ''
    await load()
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  await client.delete(`/goals/${id}`)
  await load()
}

function fmt(n) {
  return `RM ${Number(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`
}

onMounted(load)
</script>

<template>
  <div class="page">
    <button class="back-btn" @click="router.back()">‹ Back</button>
    <header class="page-head">
      <div class="eyebrow">budgets</div>
      <h1>Category goals</h1>
      <p class="sub">Set a monthly limit per category — ask the chatbot for advice against these.</p>
    </header>

    <form class="form receipt-card" @submit.prevent="save">
      <div class="row">
        <select v-model="category">
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
        <input v-model="amount" type="number" step="0.01" min="0" placeholder="Monthly limit" />
        <button class="btn primary" type="submit" :disabled="saving">Save</button>
      </div>
    </form>

    <div class="panel receipt-card">
      <div v-if="!goals.length" class="empty">No goals set yet.</div>
      <div v-for="g in goals" :key="g.id" class="goal-row">
        <span>{{ g.category }}</span>
        <span class="mono-num">{{ fmt(g.monthly_limit) }}</span>
        <button class="del" @click="remove(g.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 520px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
.sub { color: var(--paper-ink-soft); font-size: 14px; margin-top: 10px; }
.back-btn { align-self: flex-start; background: none; border: none; font-family: var(--font-mono); font-size: 12px; color: var(--paper-ink-soft); padding: 0; }
.form { padding: 18px 20px; }
.row { display: flex; gap: 10px; }
select, input { border: 1px solid var(--paper-100); border-radius: 4px; padding: 9px 10px; font-size: 13px; font-family: var(--font-sans); }
select { flex: 1; }
input { width: 130px; }
.btn { font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; padding: 9px 16px; border-radius: 3px; border: none; background: var(--brand-green); color: #fff; }
.panel { padding: 8px 20px 20px; }
.goal-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed var(--paper-100); font-size: 13px; }
.goal-row:last-child { border-bottom: none; }
.del { background: none; border: none; color: var(--paper-ink-soft); font-size: 12px; }
.del:hover { color: var(--wax-red); }
.empty { text-align: center; color: var(--paper-ink-soft); padding: 20px 0; }
</style>