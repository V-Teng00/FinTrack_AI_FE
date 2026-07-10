<script setup>
import { ref, onBeforeUnmount } from 'vue'

const emit = defineEmits(['captured', 'close'])

const videoRef = ref(null)
const canvasRef = ref(null)
const stream = ref(null)
const error = ref('')

async function start() {
  error.value = ''
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      await videoRef.value.play()
    }
  } catch (e) {
    error.value = 'Camera unavailable — check browser permissions, or upload a file instead.'
  }
}

function stop() {
  if (stream.value) {
    stream.value.getTracks().forEach((t) => t.stop())
    stream.value = null
  }
}

function capture() {
  const video = videoRef.value
  const canvas = canvasRef.value
  if (!video || !canvas) return
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  canvas.toBlob((blob) => {
    const file = new File([blob], `receipt-${Date.now()}.jpg`, { type: 'image/jpeg' })
    emit('captured', file)
    stop()
  }, 'image/jpeg', 0.92)
}

function close() {
  stop()
  emit('close')
}

start()
onBeforeUnmount(stop)
</script>

<template>
  <div class="capture-overlay">
    <div class="capture-frame">
      <div class="capture-head">
        <span class="eyebrow">align receipt in frame</span>
        <button class="x" @click="close">close</button>
      </div>

      <p v-if="error" class="cam-error">{{ error }}</p>
      <video v-else ref="videoRef" class="video" playsinline muted></video>

      <canvas ref="canvasRef" style="display:none"></canvas>

      <button v-if="!error" class="shutter" @click="capture">
        <span class="shutter-dot"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.capture-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 33, 28, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.capture-frame {
  width: min(420px, 100%);
  padding: 18px 18px 22px;
  background: var(--surface);
  border-radius: 8px;
  box-shadow: 0 20px 50px -12px rgba(20, 33, 28, 0.5);
}

.capture-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.x {
  background: none;
  border: none;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--paper-ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.video {
  width: 100%;
  border-radius: 3px;
  background: #000;
  aspect-ratio: 3/4;
  object-fit: cover;
}

.cam-error {
  font-size: 13px;
  color: var(--wax-red);
}

.shutter {
  display: block;
  margin: 16px auto 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid var(--brand-green);
  background: var(--paper-0);
}

.shutter-dot {
  display: block;
  width: 40px;
  height: 40px;
  margin: 4px auto;
  border-radius: 50%;
  background: var(--brand-green);
}
</style>
