<script setup>
const links = [
  { to: '/dashboard', label: 'Dashboard', tag: '01' },
  { to: '/upload', label: 'Scan receipt', tag: '02' },
  { to: '/receipts', label: 'History', tag: '03' },
  { to: '/chat', label: 'Ask FinTrack AI', tag: '04' },
]
</script>

<template>
  <aside class="nav">
    <div class="brand">
      <span class="brand-mark">◈</span>
      <div>
        <div class="brand-name">FinTrack<span class="brand-name-accent"> AI</span></div>
        <div class="brand-sub eyebrow">expense intelligence</div>
      </div>
    </div>

    <nav class="links">
      <router-link
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="link"
        active-class="link-active"
      >
        <span class="link-tag mono-num">{{ link.tag }}</span>
        <span>{{ link.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.nav {
  background: var(--ink-900);
  border-right: 1px solid var(--ink-line);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 36px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  color: var(--brass);
  font-size: 20px;
}

.brand-name {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.02em;
}

.brand-name-accent {
  color: var(--brand-green-bright);
}

.brand-sub {
  margin-top: 2px;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 10px;
  border-radius: 3px;
  text-decoration: none;
  color: var(--paper-ink);
  opacity: 0.62;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.15s ease, background 0.15s ease;
}

.link:hover {
  opacity: 0.9;
  background: var(--ink-800);
}

.link-active {
  opacity: 1;
  background: var(--ink-800);
  box-shadow: inset 3px 0 0 var(--brand-green-bright);
}

.link-tag {
  color: var(--brand-green-bright);
  font-size: 11px;
}

.till {
  margin-top: auto;
  border-top: 1px dashed var(--ink-line);
  padding-top: 16px;
}

.till-note {
  font-size: 12px;
  line-height: 1.5;
  color: var(--paper-ink-soft);
  opacity: 0.8;
  margin-top: 6px;
}

@media (max-width: 860px) {
  .nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    z-index: 20;
    border-right: none;
    border-top: 1px solid var(--ink-line);
  }
  .brand, .till { display: none; }
  .links { flex-direction: row; width: 100%; justify-content: space-between; }
  .link { flex-direction: column; gap: 4px; font-size: 10px; padding: 6px 8px; }
}
</style>
