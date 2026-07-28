<script setup>
import { onMounted, computed } from 'vue'
import { useReceiptsStore } from '../stores/receipts'
import ReceiptListItem from '../components/ReceiptListItem.vue'
import MonthPicker from '../components/MonthPicker.vue'
import { RouterLink } from 'vue-router'

const store = useReceiptsStore()

onMounted(() => {
  store.fetchReceipts()
  store.fetchSummary()
})

const total = computed(() =>
  store.receipts.reduce((sum, r) => sum + Number(r.total_myr || 0), 0)
)

const incomeByMonth = computed(() => {
  const groups = {}
  for (const row of store.incomeHistory) {
    if (!groups[row.month]) groups[row.month] = []
    groups[row.month].push(row)
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
})

function onDelete(id) {
  store.deleteReceipt(id)
}

function fmt(n) {
  return `RM ${Number(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`
}

function fmtMonth(month) {
  const [year, m] = month.split('-').map(Number)
  return new Date(year, m - 1, 1).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div>
        <div class="eyebrow">step 03</div>
        <h1>History</h1>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <MonthPicker :model-value="store.month" @update:model-value="store.setMonth" />
        <span class="month mono-num">{{ store.receipts.length }} receipts</span>
      </div>
    </header>

    <p v-if="store.error" class="error">{{ store.error }}</p>

    <section class="section">
      <div class="eyebrow section-label">expenses</div>
      <div class="panel receipt-card">
        <template v-if="store.receipts.length">
          <ReceiptListItem
            v-for="r in store.receipts"
            :key="r.id"
            :receipt="r"
            @delete="onDelete"
          />
          <div class="total-row">
            <span class="eyebrow">total</span>
            <span class="mono-num total-amount">{{ fmt(total) }}</span>
          </div>
        </template>
        <div v-else class="empty">
          <p>No receipts scanned yet.</p>
          <RouterLink to="/upload" class="btn primary">Scan your first receipt</RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="eyebrow section-label">income — {{ fmtMonth(store.month) }}</div>
      <div class="panel receipt-card">
        <template v-if="store.summary?.income_sources?.length">
          <div v-for="row in store.summary.income_sources" :key="row.id" class="income-row">
            <div>
              <div class="income-month">{{ row.source }}</div>
              <div v-if="row.notes" class="income-updated">{{ row.notes }}</div>
            </div>
            <div class="income-amount mono-num">{{ fmt(row.amount) }}</div>
          </div>
        </template>
        <div v-else class="empty"><p>No income set for this month.</p></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.month {
  font-size: 13px;
  color: var(--paper-ink-soft);
  background: var(--ink-800);
  border: 1px solid var(--ink-line);
  padding: 6px 12px;
  border-radius: 3px;
}

.error {
  color: var(--wax-red);
  font-size: 13px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  padding-left: 2px;
}

.panel {
  padding: 8px 20px 30px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  margin-top: 4px;
  border-top: 1px solid var(--paper-ink);
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--brand-green);
}

.income-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 4px;
  border-bottom: 1px dashed var(--paper-100);
}

.income-row:last-child {
  border-bottom: none;
}

.income-month {
  font-weight: 600;
  font-size: 14px;
}

.income-updated {
  font-size: 11px;
  color: var(--paper-ink-soft);
  margin-top: 2px;
}

.income-amount {
  font-weight: 700;
  color: var(--brand-green);
}

.empty {
  text-align: center;
  padding: 40px 0 10px;
  color: var(--paper-ink-soft);
}

.btn {
  display: inline-block;
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 11px 18px;
  border-radius: 3px;
  text-decoration: none;
}

.btn.primary {
  background: var(--brand-green);
  color: #fff;
}
</style>