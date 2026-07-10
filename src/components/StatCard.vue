<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  hint: { type: String, default: '' },
  tone: { type: String, default: 'default' }, // default | green | red
  rotate: { type: Number, default: 0 },
})
</script>

<template>
  <div class="stat receipt-card" :style="{ transform: `rotate(${rotate}deg)` }">
    <div class="eyebrow">{{ label }}</div>
    <div class="stat-value mono-num" :class="tone">{{ value }}</div>
    <div v-if="hint" class="stat-hint">{{ hint }}</div>
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
.stat-value.red { color: var(--wax-red); }

.stat-hint {
  font-size: 12px;
  color: var(--paper-ink-soft);
}
</style>
