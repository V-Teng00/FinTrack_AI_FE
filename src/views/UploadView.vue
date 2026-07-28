<script setup>
import { ref } from 'vue'
import { useReceiptsStore } from '../stores/receipts'
import CameraCapture from '../components/CameraCapture.vue'
import { RouterLink } from 'vue-router'

const store = useReceiptsStore()

const fileInput = ref(null)
const dragging = ref(false)
const showCamera = ref(false)
const previewUrl = ref('')
const status = ref('idle') // idle | uploading | done | error
const progress = ref(0)
const result = ref(null)
const errorMsg = ref('')

function pickFile() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) handleFile(file)
}

function onDrop(e) {
  dragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) handleFile(file)
}

async function handleFile(file) {
  previewUrl.value = URL.createObjectURL(file)
  status.value = 'uploading'
  progress.value = 0
  errorMsg.value = ''
  result.value = null
  try {
    const data = await store.uploadReceipt(file, (p) => (progress.value = p))
    result.value = data
    status.value = 'done'
  } catch (e) {
    status.value = 'error'
    errorMsg.value = 'Extraction failed. Check the image and try again, or verify the backend is reachable.'
  }
}

function onCaptured(file) {
  showCamera.value = false
  handleFile(file)
}

function reset() {
  status.value = 'idle'
  previewUrl.value = ''
  result.value = null
  errorMsg.value = ''
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div class="eyebrow">step 02</div>
      <h1>Scan a receipt</h1>
      <p class="sub">Upload a photo, or capture one directly. The extraction pipeline reads store, date, items and total.</p>
    </header>

    <div
      v-if="status === 'idle'"
      class="dropzone"
      :class="{ dragging }"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <p class="drop-label">Drag a receipt image here</p>
      <div class="drop-actions">
        <button class="btn primary" @click="pickFile">Choose file</button>
        <button class="btn" @click="showCamera = true">Use camera</button>
      </div>
      <RouterLink to="/add-manual" class="manual-link">or enter it manually</RouterLink>
      <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onFileChange" />
    </div>

    <div v-else class="result-area">
      <div class="preview receipt-card">
        <img v-if="previewUrl" :src="previewUrl" alt="Receipt preview" />
      </div>

      <div class="result-panel receipt-card">
        <template v-if="status === 'uploading'">
          <div class="eyebrow">extracting…</div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="hint">Uploading and running structured extraction ({{ progress }}%).</p>
        </template>

        <template v-else-if="status === 'done'">
          <div class="eyebrow">extracted</div>
          <dl class="fields">
            <dt>Store</dt><dd>{{ result.store_name }}</dd>
            <dt>Date</dt><dd class="mono-num">{{ result.date }}</dd>
            <dt>Category</dt><dd>{{ result.category }}</dd>
            <dt>Total</dt><dd class="mono-num total">RM {{ Number(result.total).toFixed(2) }}</dd>
          </dl>
          <button class="btn primary" @click="reset">Scan another</button>
        </template>

        <template v-else-if="status === 'error'">
          <div class="eyebrow">error</div>
          <p class="hint error-text">{{ errorMsg }}</p>
          <button class="btn" @click="reset">Try again</button>
        </template>
      </div>
    </div>

    <CameraCapture v-if="showCamera" @captured="onCaptured" @close="showCamera = false" />
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.sub {
  color: var(--paper-ink-soft);
  font-size: 14px;
  margin-top: 10px;
  max-width: 46ch;
}

.dropzone {
  border: 1.5px dashed var(--ink-line);
  border-radius: 4px;
  padding: 60px 24px;
  text-align: center;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.dropzone.dragging {
  border-color: var(--brand-green-bright);
  background: var(--ink-900);
}

.drop-label {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--paper-ink-soft);
  margin-bottom: 20px;
}

.drop-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.hidden-input {
  display: none;
}

.btn {
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 11px 18px;
  border-radius: 3px;
  border: 1px solid var(--ink-line);
  background: transparent;
  color: var(--paper-ink);
}

.btn.primary {
  background: var(--brand-green);
  border-color: var(--brand-green);
  color: var(--paper-0);
}

.result-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.preview {
  padding: 8px;
  overflow: hidden;
}

.preview img {
  width: 100%;
  display: block;
  border-radius: 2px;
}

.result-panel {
  padding: 20px 20px 28px;
  min-height: 200px;
}

.progress-track {
  height: 6px;
  background: var(--paper-100);
  border-radius: 4px;
  overflow: hidden;
  margin: 14px 0 10px;
}

.progress-fill {
  height: 100%;
  background: var(--brand-green);
  transition: width 0.2s ease;
}

.hint {
  font-size: 13px;
  color: var(--paper-ink-soft);
}

.error-text {
  color: var(--wax-red);
}

.fields {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 16px;
  margin: 14px 0 20px;
}

.fields dt {
  color: var(--paper-ink-soft);
  font-size: 12px;
  align-self: center;
}

.fields dd {
  margin: 0;
  font-weight: 600;
}

.fields .total {
  font-size: 18px;
  color: var(--brand-green);
}

.manual-link {
  display: block;
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: var(--brand-green-bright);
  text-decoration: none;
}

.manual-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .result-area { grid-template-columns: 1fr; }
}
</style>
