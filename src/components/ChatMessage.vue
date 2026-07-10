<script setup>
defineProps({
  role: { type: String, required: true }, // 'user' | 'assistant'
  text: { type: String, required: true },
})
</script>

<template>
  <div class="msg" :class="role">
    <div class="bubble" :class="{ 'receipt-card': role === 'assistant' }">
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
.msg {
  display: flex;
  margin-bottom: 14px;
}

.msg.user {
  justify-content: flex-end;
}

.msg.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.55;
}

.msg.user .bubble {
  background: var(--ink-800);
  border: 1px solid var(--ink-line);
  border-radius: 10px 10px 2px 10px;
}

.msg.assistant .bubble {
  padding-bottom: 20px;
  border-radius: 2px 10px 10px 10px;
}

.msg.assistant .bubble.receipt-card::after {
  background:
    linear-gradient(-45deg, var(--surface) 6px, transparent 0) 0 4px,
    linear-gradient(45deg, var(--surface) 6px, transparent 0) 0 4px;
  background-size: 14px 18px;
  background-repeat: repeat-x;
}

@media (max-width: 640px) {
  .bubble { max-width: 88%; }
}
</style>
