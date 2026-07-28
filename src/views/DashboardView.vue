<script setup>
import { onMounted, computed } from 'vue'
import { useReceiptsStore } from '../stores/receipts'
import StatCard from '../components/StatCard.vue'
import SpendingChart from '../components/SpendingChart.vue'
import CategoryChart from '../components/CategoryChart.vue'
import MonthPicker from '../components/MonthPicker.vue'
import IncomeCard from '../components/IncomeCard.vue'

const store = useReceiptsStore()

onMounted(() => {
  store.fetchSummary()
})

const fmt = (n) => `RM ${Number(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`

const savingsHint = computed(() => {
  if (!store.summary || !store.summary.income) return 'Set an income to calculate savings'
  return `${fmt(store.summary.income)} income − ${fmt(store.summary.total_spending)} spent`
})
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div>
        <div class="eyebrow">monthly statement</div>
        <h1>Dashboard</h1>
      </div>
      <MonthPicker :model-value="store.month" @update:model-value="store.setMonth" />
    </header>

    <p v-if="store.error" class="error">{{ store.error }}</p>

    <section class="stats">
      <StatCard label="Total spending" :value="fmt(store.summary?.total_spending)" :rotate="-0.6" />
      <IncomeCard />
      <StatCard
        label="Savings"
        :value="fmt(store.summary?.savings)"
        :hint="savingsHint"
        tone="green"
        :rotate="-0.3"
      />
    </section>

    <section class="charts">
      <div class="panel receipt-card">
        <div class="eyebrow">daily spending</div>
        <SpendingChart :daily="store.summary?.daily || []" />
      </div>
      <div class="panel receipt-card">
        <div class="eyebrow">category breakdown</div>
        <CategoryChart :categories="store.summary?.by_category || []" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 980px;
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
  background: rgba(166, 64, 47, 0.12);
  border: 1px solid rgba(166, 64, 47, 0.3);
  padding: 10px 14px;
  border-radius: 3px;
  font-size: 13px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.charts {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 20px;
}

.panel {
  padding: 20px 20px 28px;
}

@media (max-width: 760px) {
  .stats, .charts { grid-template-columns: 1fr; }
}
</style>
