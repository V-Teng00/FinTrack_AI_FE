<script setup>
import NavSidebar from './components/NavSidebar.vue'
</script>

<template>
  <div class="shell">
    <NavSidebar />
    <main class="desk">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.desk {
  background: var(--ink-950);
  background-image:
    linear-gradient(var(--ink-line) 1px, transparent 1px);
  background-size: 100% 32px;
  padding: 40px 48px;
  overflow-x: hidden;
}

@media (max-width: 860px) {
  .shell {
    grid-template-columns: 1fr;
  }
  .desk {
    padding: 24px 20px 100px;
  }
}
</style>
