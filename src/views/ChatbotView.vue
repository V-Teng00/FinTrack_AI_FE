<script setup>
import { ref, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { useReceiptsStore } from '../stores/receipts'
import { chatApi } from '../services/api'
import { USE_MOCK, mockChatReply } from '../services/mockData'
import ChatMessage from '../components/ChatMessage.vue'

const store = useReceiptsStore()

const suggestions = [
  'How much did I spend on food this month?',
  'What is my biggest spending category?',
  'How much have I saved this month?',
]

const messages = ref([
  { role: 'assistant', text: "Ask me anything about your expenses — e.g. \"How much did I spend on food this month?\"" },
])
const input = ref('')
const sending = ref(false)
const scrollRef = ref(null)

async function send(text) {
  const question = (text ?? input.value).trim()
  if (!question || sending.value) return
  messages.value.push({ role: 'user', text: question })
  input.value = ''
  sending.value = true
  await scrollToBottom()
  try {
    let reply
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500))
      reply = mockChatReply(question)
    } else {
      const { data } = await chatApi.ask(question, store.month)
      reply = data.reply
    }
    messages.value.push({ role: 'assistant', text: reply })
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      text: "Couldn't reach the FinTrack AI backend. Check that /api/chat is running.",
    })
  } finally {
    sending.value = false
    await scrollToBottom()
  }
}

async function scrollToBottom() {
  await nextTick()
  if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div class="eyebrow">step 04</div>
      <h1>Ask FinTrack AI</h1>
      <p class="sub">Grounded in your actual receipts — not a generic chatbot guess.</p>
    </header>

    <RouterLink to="/goals" class="chip">Set budgets</RouterLink>

    <div class="chips">
      <button v-for="s in suggestions" :key="s" class="chip" @click="send(s)">{{ s }}</button>
    </div>

    <div class="chat-panel receipt-card">
      <div ref="scrollRef" class="messages">
        <ChatMessage v-for="(m, i) in messages" :key="i" :role="m.role" :text="m.text" />
        <div v-if="sending" class="typing mono-num">…drafting a grounded answer</div>
      </div>

      <form class="composer" @submit.prevent="send()">
        <input
          v-model="input"
          type="text"
          placeholder="Ask about your spending…"
          :disabled="sending"
        />
        <button type="submit" class="send-btn" :disabled="sending || !input.trim()">Send</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sub {
  color: var(--paper-ink-soft);
  font-size: 14px;
  margin-top: 10px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 16px;
  border: 1px solid var(--ink-line);
  background: var(--ink-800);
  color: var(--paper-ink);
}

.chip:hover {
  border-color: var(--brand-green-bright);
}

.chat-panel {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 480px;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 4px;
}

.typing {
  font-size: 11px;
  color: var(--paper-ink-soft);
  padding-left: 4px;
}

.composer {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid var(--paper-100);
  background: var(--paper-0);
}

.composer input {
  flex: 1;
  border: 1px solid var(--paper-100);
  background: #fff;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--paper-ink);
}

.composer input:focus {
  outline: 2px solid var(--brand-green-bright);
  outline-offset: 1px;
}

.send-btn {
  background: var(--brand-green);
  color: var(--paper-0);
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
}

.send-btn:disabled {
  opacity: 0.5;
}
</style>
