<script setup>
import { onMounted, computed } from 'vue'
import { useReceiptsStore } from '../stores/receipts'
import ReceiptListItem from '../components/ReceiptListItem.vue'
import { RouterLink } from 'vue-router'

const store = useReceiptsStore()

onMounted(() => {
  store.fetchReceipts()
})

const total = computed(() =>
  store.receipts.reduce((sum, r) => sum + Number(r.total || 0), 0)
)

function onDelete(id) {
  store.deleteReceipt(id)
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div>
        <div class="eyebrow">step 03</div>
        <h1>History</h1>
      </div>
      <div class="month mono-num">{{ store.receipts.length }} receipts</div>
    </header>

    <p v-if="store.error" class="error">{{ store.error }}</p>

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
          <span class="mono-num total-amount">RM {{ total.toFixed(2) }}</span>
        </div>
      </template>
      <div v-else class="empty">
        <p>No receipts scanned yet.</p>
        <RouterLink to="/upload" class="btn primary">Scan your first receipt</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  color: var(--paper-0);
}
</style>
