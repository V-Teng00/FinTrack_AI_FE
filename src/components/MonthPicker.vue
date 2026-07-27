<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, required: true }, // 'YYYY-MM'
})
const emit = defineEmits(['update:modelValue'])

const label = computed(() => {
  const [year, month] = props.modelValue.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-MY', {
    month: 'long',
    year: 'numeric',
  })
})

function shift(delta) {
  const [year, month] = props.modelValue.split('-').map(Number)
  const d = new Date(year, month - 1 + delta, 1)
  const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  emit('update:modelValue', newMonth)
}
</script>

<template>
  <div class="month-picker">
    <button class="arrow" @click="shift(-1)" aria-label="Previous month">‹</button>
    <span class="label mono-num">{{ label }}</span>
    <button class="arrow" @click="shift(1)" aria-label="Next month">›</button>
  </div>
</template>

<style scoped>
.month-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--ink-800);
  border: 1px solid var(--ink-line);
  border-radius: 3px;
  padding: 4px 6px;
}

.arrow {
  background: none;
  border: none;
  font-size: 16px;
  line-height: 1;
  padding: 4px 8px;
  color: var(--paper-ink-soft);
  border-radius: 3px;
}

.arrow:hover {
  background: var(--surface-alt);
  color: var(--paper-ink);
}

.label {
  font-size: 13px;
  min-width: 110px;
  text-align: center;
}
</style>