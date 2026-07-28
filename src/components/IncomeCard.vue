<script setup>
import { useReceiptsStore } from '../stores/receipts'
import { RouterLink } from 'vue-router'

const store = useReceiptsStore()

function fmt(n) {
  return `RM ${Number(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`
}
</script>

<template>
  <div class="stat receipt-card">
    <div class="eyebrow">Income</div>
    <div class="stat-value mono-num green">{{ fmt(store.summary?.income) }}</div>
    <RouterLink to="/add-income" class="edit-link">+ Add income</RouterLink>
  </div>
</template>

<style scoped>
.stat {
  padding: 18px 20px 26px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.stat-value.green { color: var(--brand-green); }

.edit-link {
  align-self: flex-start;
  font-size: 12px;
  color: var(--brand-green-bright);
  text-decoration: underline;
}
</style>