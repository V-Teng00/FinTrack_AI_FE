<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip } from 'chart.js'

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip)

const props = defineProps({
  categories: { type: Array, default: () => [] }, // [{category, amount}]
})

const palette = ['#2f5d50', '#4f8a76', '#c98a34', '#a6402f', '#7a8f86', '#5b6f66']

const canvasRef = ref(null)
let chart = null

function render() {
  if (!canvasRef.value) return
  if (chart) chart.destroy()
  const sorted = [...props.categories].sort((a, b) => b.amount - a.amount)
  chart = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels: sorted.map((c) => c.category),
      datasets: [
        {
          data: sorted.map((c) => c.amount),
          backgroundColor: sorted.map((_, i) => palette[i % palette.length]),
          borderRadius: 2,
          barThickness: 16,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: '#64756b', font: { family: 'Space Mono', size: 10 } },
          grid: { color: 'rgba(34,48,42,0.06)' },
        },
        y: {
          ticks: { color: '#22302a', font: { family: 'Inter', size: 12 } },
          grid: { display: false },
        },
      },
    },
  })
}

onMounted(render)
watch(() => props.categories, render, { deep: true })
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
