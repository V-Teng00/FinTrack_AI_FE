<script setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: 'Receipt' },
})
const emit = defineEmits(['close'])
</script>

<template>
  <div class="lightbox" @click.self="emit('close')">
    <button class="close-btn" @click="emit('close')" aria-label="Close">✕</button>
    <img :src="src" :alt="alt" />
  </div>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(20, 33, 28, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 32px;
}

.lightbox img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 16px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>