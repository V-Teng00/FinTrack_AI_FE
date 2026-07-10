<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart, LineController, LineElement, PointElement,
  LinearScale, CategoryScale, Filler, Tooltip,
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const props = defineProps({
  daily: { type: Array, default: () => [] }, // [{date, amount}]
})

const canvasRef = ref(null)
let chart = null

function render() {
  if (!canvasRef.value) return
  if (chart) chart.destroy()
  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels: props.daily.map((d) => d.date),
      datasets: [
        {
          data: props.daily.map((d) => d.amount),
          borderColor: '#4f8a76',
          backgroundColor: 'rgba(79, 138, 118, 0.18)',
          pointBackgroundColor: '#c98a34',
          pointBorderColor: '#c98a34',
          pointRadius: 3,
          borderWidth: 2,
          fill: true,
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: '#64756b', font: { family: 'Space Mono', size: 10 } },
          grid: { color: 'rgba(34,48,42,0.06)' },
        },
        y: {
          ticks: { color: '#64756b', font: { family: 'Space Mono', size: 10 } },
          grid: { color: 'rgba(34,48,42,0.06)' },
        },
      },
    },
  })
}

onMounted(render)
watch(() => props.daily, render, { deep: true })
onBeforeUnmount(() => chart && chart.destroy())
</script>

<template>
  <div class="chart-wrap">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.chart-wrap {
  height: 240px;
  position: relative;
}
</style>
