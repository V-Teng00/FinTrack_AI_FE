<script setup>
import { ref } from 'vue'
import ImageLightbox from './ImageLightbox.vue'

const props = defineProps({
  receipt: { type: Object, required: true },
})
const emit = defineEmits(['delete'])

const showLightbox = ref(false)
</script>

<template>
  <div class="row">
    <button
      v-if="receipt.thumbnail_url"
      class="thumb-btn"
      @click="showLightbox = true"
      aria-label="View receipt image"
    >
      <img :src="receipt.thumbnail_url" alt="" />
    </button>
    <div class="thumb placeholder" v-else>{{ receipt.store_name?.[0] || '?' }}</div>

    <div class="info">
      <div class="store">{{ receipt.store_name }}</div>
      <div class="meta mono-num">{{ receipt.date }} · {{ receipt.category }}</div>
    </div>

    <div class="amount-block">
      <div class="amount mono-num">RM {{ Number(receipt.total_myr).toFixed(2) }}</div>
      <div v-if="receipt.currency !== 'MYR'" class="original mono-num">
        ({{ receipt.currency }} {{ Number(receipt.total).toFixed(2) }})
      </div>
    </div>

    <button class="del" title="Delete" @click="emit('delete', receipt.id)">✕</button>

    <ImageLightbox
      v-if="showLightbox"
      :src="receipt.thumbnail_url"
      :alt="receipt.store_name"
      @close="showLightbox = false"
    />
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 40px 1fr auto auto;
  align-items: center;
  gap: 14px;
  padding: 12px 4px;
  border-bottom: 1px dashed var(--paper-100);
}

.row:last-child {
  border-bottom: none;
}

.thumb, .thumb-btn {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  overflow: hidden;
  background: var(--paper-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--brand-green);
}

.thumb-btn {
  border: none;
  padding: 0;
  cursor: zoom-in;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store {
  font-weight: 600;
  font-size: 14px;
}

.meta {
  font-size: 11.5px;
  color: var(--paper-ink-soft);
  margin-top: 2px;
}

.amount {
  font-weight: 700;
}

.amount-block {
  text-align: right;
}

.original {
  font-size: 10.5px;
  color: var(--paper-ink-soft);
  margin-top: 1px;
}

.del {
  background: none;
  border: none;
  color: var(--paper-ink-soft);
  font-size: 13px;
  padding: 4px 6px;
}

.del:hover {
  color: var(--wax-red);
}
</style>